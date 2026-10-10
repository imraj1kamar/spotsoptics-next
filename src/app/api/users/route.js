// app/api/users/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createActivityLog } from '@/lib/auditLog';
import { jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';

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

// GET /api/users - Fetch users list
export async function GET(request) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) return unauthorized('Unauthorized access');

    const callerRole = String(auth.role || '').toUpperCase();
    const callerId = Number(auth.id || auth.userId || auth.sub || 0);

    const where = {};
    if (callerRole !== 'ADMIN') {
      where.parentId = callerId;
    }

    const users = await prisma.user.findMany({
      where,
      orderBy: { id: 'desc' },
      include: {
        parent: {
          select: { id: true, name: true, username: true, role: true },
        },
      },
    });

    // Sanitize passwords
    const safeUsers = (users || []).map(({ password, ...u }) => u);

    return NextResponse.json(
      { success: true, data: serialize(safeUsers) },
      { status: 200 }
    );
  } catch (error) {
    console.error('Fetch Users Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/users - Create new user (Distributor / Client)
export async function POST(request) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) return unauthorized('Unauthorized access');

    const body = await request.json().catch(() => ({}));
    const { name, username, password, role = 'CLIENT', parentId, status = 1 } = body;

    if (!name || !username || !password) {
      return NextResponse.json(
        { success: false, message: 'Name, username, and password are required.' },
        { status: 400 }
      );
    }

    const targetRole = String(role).toUpperCase();
    const callerRole = String(auth.role || '').toUpperCase();

    if (targetRole === 'ADMIN' && callerRole !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Forbidden: Only administrators can create ADMIN accounts.' },
        { status: 403 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const creatorId = Number(auth.id || auth.userId || auth.sub || 0);
    const assignedParentId = parentId ? Number(parentId) : (creatorId || null);

    const user = await prisma.user.create({
      data: {
        name,
        username,
        password: hashedPassword,
        role: String(role).toUpperCase(),
        parentId: assignedParentId,
        status: Number(status),
      },
    });

    await createActivityLog({
      userId: creatorId,
      action: 'CREATE_USER',
      module: 'USER_MANAGEMENT',
      details: `Created new ${user.role} user account for ${user.name} (@${user.username})`,
      targetId: user.id,
      newData: { id: user.id, name: user.name, username: user.username, role: user.role },
      request,
    });

    const { password: _, ...safeUser } = user;

    return NextResponse.json(
      { success: true, message: 'User created successfully', data: serialize(safeUser) },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create User Error:', error);
    if (error.code === 'P2002') {
      return NextResponse.json(
        { success: false, message: 'Username already exists.' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
