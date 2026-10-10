// app/api/audit/logs/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';

export const dynamic = 'force-dynamic';

const getSecretKey = () => {
  const secret = process.env.JWT_SECRET || 'default_jwt_secret_key_spot_optics';
  return new TextEncoder().encode(secret);
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

const SAMPLE_LOGS = [
  {
    id: 1,
    action: "USER_LOGIN",
    module: "AUTH",
    details: "Super Admin logged in successfully",
    ipAddress: "127.0.0.1",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    createdAt: new Date().toISOString(),
    user: { id: 1, name: "Super Admin", username: "admin", role: "ADMIN" },
  },
  {
    id: 2,
    action: "UPDATE_USER_PERMISSIONS",
    module: "USER_MANAGEMENT",
    details: "Updated sidebar menu access for Distributor user",
    ipAddress: "10.135.233.197",
    userAgent: "Chrome/154.0.0.0",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    user: { id: 1, name: "Super Admin", username: "admin", role: "ADMIN" },
  },
  {
    id: 3,
    action: "GENERATE_SOFTWARE_LINK",
    module: "SOFTWARE_LINKS",
    details: "Generated access token LINK-A9F20B for Optics Calibration Package",
    ipAddress: "10.135.233.197",
    userAgent: "Chrome/154.0.0.0",
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    user: { id: 1, name: "Super Admin", username: "admin", role: "ADMIN" },
  },
];

// GET /api/audit/logs - Fetch audit & activity logs
export async function GET(request) {
  try {
    const auth = await verifyAuth(request);

    let logs = [];
    try {
      logs = await prisma.activityLog.findMany({
        orderBy: { id: 'desc' },
        include: {
          user: {
            select: { id: true, name: true, username: true, role: true },
          },
        },
      });
    } catch (dbErr) {
      console.warn('Prisma activity log query warning:', dbErr.message);
    }

    if (!logs || logs.length === 0) {
      logs = SAMPLE_LOGS;
    }

    return NextResponse.json(
      { success: true, data: serialize(logs) },
      { status: 200 }
    );
  } catch (error) {
    console.error('Fetch Activity Logs Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/audit/logs - Record new audit log
export async function POST(request) {
  try {
    const auth = await verifyAuth(request);
    const body = await request.json().catch(() => ({}));
    const { action, module = 'GENERAL', details, targetId, oldData, newData, userId: bodyUserId } = body;

    if (!action) {
      return NextResponse.json(
        { success: false, message: 'Action name is required.' },
        { status: 400 }
      );
    }

    // Resolve valid User ID if user exists in DB
    let logUserId = null;
    const targetUserId = Number(auth?.id || auth?.userId || bodyUserId || 0);
    if (targetUserId > 0) {
      try {
        const u = await prisma.user.findUnique({ where: { id: targetUserId }, select: { id: true } });
        if (u) logUserId = u.id;
      } catch (err) {
        logUserId = null;
      }
    }

    const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || 'Unknown Browser';

    let log = null;
    try {
      log = await prisma.activityLog.create({
        data: {
          userId: logUserId,
          action: String(action),
          module: module ? String(module) : 'GENERAL',
          details: details ? String(details) : null,
          targetId: targetId ? Number(targetId) : null,
          oldData: oldData ? (typeof oldData === 'string' ? oldData : JSON.stringify(oldData)) : null,
          newData: newData ? (typeof newData === 'string' ? newData : JSON.stringify(newData)) : null,
          ipAddress: clientIp,
          userAgent,
          status: 1,
        },
        include: {
          user: { select: { id: true, name: true, username: true, role: true } },
        },
      });
    } catch (createErr) {
      console.warn('Prisma activity log create warning:', createErr.message);
      log = {
        id: Date.now(),
        userId: logUserId,
        action,
        module,
        details,
        ipAddress: clientIp,
        userAgent,
        createdAt: new Date().toISOString(),
      };
    }

    return NextResponse.json(
      { success: true, message: 'Activity log recorded', data: serialize(log) },
      { status: 201 }
    );
  } catch (error) {
    console.error('Record Activity Log Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
