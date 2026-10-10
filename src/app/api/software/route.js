// app/api/software/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createActivityLog } from '@/lib/auditLog';
import { jwtVerify } from 'jose';

export const dynamic = 'force-dynamic';

const getSecretKey = () => {
  const secret = process.env.JWT_SECRET || 'default_jwt_secret_key_spot_optics';
  return new TextEncoder().encode(secret);
};

const serialize = (obj) =>
  JSON.parse(JSON.stringify(obj, (_, v) => (typeof v === 'bigint' ? v.toString() : v)));

const unauthorized = (message) =>
  NextResponse.json({ success: false, message }, { status: 401 });

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

// GET /api/software - List software packages for Admin or Assigned downloads for User
export async function GET(request) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) return unauthorized('Unauthorized access');

    const userId = Number(auth.id || auth.userId || 1);
    const userRole = String(auth.role || '').toUpperCase();

    let softwares = [];
    try {
      if (userRole === 'ADMIN') {
        softwares = await prisma.software.findMany({
          orderBy: { id: 'desc' },
          include: {
            links: {
              include: {
                receiver: {
                  select: { id: true, name: true, username: true, role: true },
                },
              },
            },
          },
        });
      } else {
        // Fetch software assigned to this specific user (Distributor or Client)
        const assignedLinks = await prisma.softwareLink.findMany({
          where: { assignedTo: userId, status: 1 },
          orderBy: { id: 'desc' },
          include: {
            software: true,
            creator: {
              select: { id: true, name: true, username: true, role: true },
            },
          },
        });

        softwares = assignedLinks
          .filter((link) => link.software && Number(link.software.status) === 1)
          .map((link) => ({
            id: link.software.id,
            linkId: link.id,
            name: link.software.name,
            description: link.software.description,
            baseFileUrl: link.software.baseFileUrl,
            secureToken: link.secureToken,
            isUsed: link.isUsed,
            status: link.software.status,
            createdAt: link.createdAt,
            assignedBy: link.creator?.name || 'Admin',
          }));
      }
    } catch (dbErr) {
      console.warn('Prisma software query warning:', dbErr.message);
    }

    return NextResponse.json(
      { success: true, data: serialize(softwares || []) },
      { status: 200 }
    );
  } catch (error) {
    console.error('Fetch Software Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/software - Add software entry to repository
export async function POST(request) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) return unauthorized('Unauthorized access');

    const body = await request.json().catch(() => ({}));
    const { name, description, baseFileUrl, status = 1 } = body;

    if (!name || !baseFileUrl) {
      return NextResponse.json(
        { success: false, message: 'Software name and storage download URL are required.' },
        { status: 400 }
      );
    }

    const software = await prisma.software.create({
      data: {
        name,
        description: description || null,
        baseFileUrl,
        status: Number(status),
      },
    });

    await createActivityLog({
      userId: auth?.id || auth?.userId,
      action: 'ADD_SOFTWARE',
      module: 'SOFTWARE',
      details: `Added new software "${software.name}" to repository`,
      targetId: software.id,
      newData: software,
      request,
    });

    return NextResponse.json(
      { success: true, message: 'Software added to repository', data: serialize(software) },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create Software Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
