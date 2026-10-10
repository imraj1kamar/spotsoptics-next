// app/api/dashboard/stats/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';

export const dynamic = 'force-dynamic';

const getSecretKey = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret && process.env.NODE_ENV === 'production') {
    throw new Error('CRITICAL: JWT_SECRET environment variable is missing in production!');
  }
  return new TextEncoder().encode(secret || 'default_jwt_secret_key_spot_optics');
};

const serialize = (obj) =>
  JSON.parse(JSON.stringify(obj, (_, v) => (typeof v === 'bigint' ? v.toString() : v)));

async function verifyAuth(request) {
  const authHeader = request.headers.get('authorization');
  const token =
    authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : request.cookies.get('accessToken')?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload;
  } catch (e) {
    return null;
  }
}

export async function GET(request) {
  try {
    const auth = await verifyAuth(request);
    const userId = Number(auth?.id || auth?.userId || 0);
    const tokenRole = String(auth?.role || 'ADMIN').toUpperCase();
    
    // Fetch live user from DB to get fresh role & name
    let dbUser = null;
    if (userId > 0) {
      try {
        dbUser = await prisma.user.findUnique({
          where: { id: userId },
          select: { id: true, name: true, username: true, role: true },
        });
      } catch (e) {}
    }

    const currentRole = dbUser?.role ? String(dbUser.role).toUpperCase() : tokenRole;
    const currentUser = {
      id: dbUser?.id || userId || 1,
      name: dbUser?.name || auth?.name || auth?.username || 'User',
      username: dbUser?.username || auth?.username || 'user',
      role: currentRole,
    };

    let softwareCount = 0;
    let linksCount = 0;
    let usersCount = 0;
    let menusCount = 0;
    let distributorsCount = 0;
    let clientsCount = 0;
    let usedLinksCount = 0;
    let rawActivities = [];

    try {
      if (currentRole === 'ADMIN') {
        const [
          sCount,
          lCount,
          uCount,
          mCount,
          dCount,
          cCount,
          ulCount,
          activities
        ] = await Promise.all([
          prisma.software.count({ where: { status: 1 } }),
          prisma.softwareLink.count({ where: { status: 1 } }),
          prisma.user.count({ where: { status: 1 } }),
          prisma.menu.count({ where: { status: 1 } }),
          prisma.user.count({ where: { role: 'DISTRIBUTOR', status: 1 } }),
          prisma.user.count({ where: { role: 'CLIENT', status: 1 } }),
          prisma.softwareLink.count({ where: { isUsed: true, status: 1 } }),
          prisma.activityLog.findMany({
            take: 8,
            orderBy: { createdAt: 'desc' },
            include: {
              user: { select: { id: true, name: true, role: true, username: true } },
            },
          }),
        ]);

        softwareCount = sCount;
        linksCount = lCount;
        usersCount = uCount;
        menusCount = mCount;
        distributorsCount = dCount;
        clientsCount = cCount;
        usedLinksCount = ulCount;
        rawActivities = activities || [];
      } else if (currentRole === 'DISTRIBUTOR') {
        const [
          lCount,
          cCount,
          ulCount,
          activities,
          assignedLinks
        ] = await Promise.all([
          prisma.softwareLink.count({ where: { assignedBy: userId, status: 1 } }),
          prisma.user.count({ where: { parentId: userId, role: 'CLIENT', status: 1 } }),
          prisma.softwareLink.count({ where: { assignedBy: userId, isUsed: true, status: 1 } }),
          prisma.activityLog.findMany({
            where: {
              OR: [
                { userId: userId },
                { user: { parentId: userId } },
              ],
            },
            take: 8,
            orderBy: { createdAt: 'desc' },
            include: {
              user: { select: { id: true, name: true, role: true, username: true } },
            },
          }),
          prisma.softwareLink.findMany({
            where: { assignedTo: userId, status: 1 },
            select: { softwareId: true },
          }),
        ]);

        const uniqueSoftwareIds = new Set(assignedLinks.map((l) => l.softwareId));
        const allSoftwareCount = await prisma.software.count({ where: { status: 1 } });

        softwareCount = uniqueSoftwareIds.size > 0 ? uniqueSoftwareIds.size : allSoftwareCount;
        linksCount = lCount;
        usersCount = cCount;
        distributorsCount = 0;
        clientsCount = cCount;
        usedLinksCount = ulCount;
        rawActivities = activities || [];
      } else {
        // CLIENT Role
        const [
          assignedLinks,
          ulCount,
          activities
        ] = await Promise.all([
          prisma.softwareLink.findMany({
            where: { assignedTo: userId, status: 1 },
            include: { software: true },
          }),
          prisma.softwareLink.count({ where: { assignedTo: userId, isUsed: true, status: 1 } }),
          prisma.activityLog.findMany({
            where: { userId: userId },
            take: 8,
            orderBy: { createdAt: 'desc' },
            include: {
              user: { select: { id: true, name: true, role: true, username: true } },
            },
          }),
        ]);

        softwareCount = assignedLinks.length;
        linksCount = assignedLinks.length;
        usersCount = 1;
        usedLinksCount = ulCount;
        rawActivities = activities || [];
      }
    } catch (dbErr) {
      console.warn('Dashboard Stats Prisma Query Warning:', dbErr.message);
    }

    // Format activity logs from DB
    let formattedActivities = rawActivities.map((act) => {
      const initials = act.user?.name
        ? act.user.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
        : 'SO';

      const timeAgo = act.createdAt
        ? new Date(act.createdAt).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })
        : 'Recently';

      return {
        id: act.id,
        initials,
        name: act.user?.name || act.module || 'System',
        action: act.action || 'performed an update',
        item: act.details || act.module || 'Workspace Item',
        time: timeAgo,
        color: act.module === 'USER_MANAGEMENT' ? 'mint' : act.module === 'SOFTWARE' ? 'peach' : 'lavender',
      };
    });

    // Exact progress metrics calculation
    const completedPct = linksCount > 0 ? Math.round((usedLinksCount / linksCount) * 100) : 0;
    const pendingCount = Math.max(0, linksCount - usedLinksCount);

    const dashboardData = {
      user: currentUser,
      stats: {
        totalSoftware: softwareCount,
        activeLinks: linksCount,
        totalUsers: usersCount,
        activeMenus: menusCount,
        distributorsCount,
        clientsCount,
        usedLinksCount,
        pendingLinksCount: pendingCount,
      },
      recentActivities: formattedActivities,
      progress: {
        completedPercentage: completedPct,
        completedCount: usedLinksCount,
        inProgressCount: pendingCount,
        totalCount: linksCount,
      },
    };

    return NextResponse.json(
      { success: true, data: serialize(dashboardData) },
      { status: 200, headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error) {
    console.error('Dashboard Stats API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch dashboard statistics.' },
      { status: 500 }
    );
  }
}
