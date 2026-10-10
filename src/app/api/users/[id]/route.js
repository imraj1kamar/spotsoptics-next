// app/api/users/[id]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
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

// PUT /api/users/[id] - Update user details, role, and status
export async function PUT(request, { params }) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) return unauthorized('Unauthorized access');

    const resolvedParams = await params;
    const id = Number(resolvedParams.id);
    if (!Number.isInteger(id)) {
      return NextResponse.json({ success: false, message: 'Invalid User ID' }, { status: 400 });
    }

    const callerRole = String(auth.role || '').toUpperCase();
    const callerId = Number(auth.id || auth.userId || 0);

    const body = await request.json().catch(() => ({}));
    const { name, username, password, role, parentId, status } = body;

    if (role && String(role).toUpperCase() === 'ADMIN' && callerRole !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Forbidden: Only administrators can assign ADMIN role.' },
        { status: 403 }
      );
    }

    const updateData = {};

    if (name) updateData.name = name;
    if (username) updateData.username = username;
    if (role) updateData.role = String(role).toUpperCase();
    if (parentId !== undefined) updateData.parentId = parentId ? Number(parentId) : null;
    if (status !== undefined) updateData.status = Number(status);

    if (password && password.trim()) {
      updateData.password = await bcrypt.hash(password.trim(), 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    const { password: _, ...safeUser } = updatedUser;

    return NextResponse.json(
      { success: true, message: 'User updated successfully', data: serialize(safeUser) },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update User Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id] - Soft delete user (updates status id to 0)
export async function DELETE(request, { params }) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) return unauthorized('Unauthorized access');

    const callerRole = String(auth.role || '').toUpperCase();
    if (callerRole !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Forbidden: Only administrators can deactivate user accounts.' },
        { status: 403 }
      );
    }

    const resolvedParams = await params;
    const id = Number(resolvedParams.id);
    if (!Number.isInteger(id)) {
      return NextResponse.json({ success: false, message: 'Invalid User ID' }, { status: 400 });
    }

    // Soft delete: Update status to 0 (Inactive/Deleted)
    const softDeletedUser = await prisma.user.update({
      where: { id },
      data: { status: 0 },
    });

    return NextResponse.json(
      { success: true, message: 'User status updated to inactive (Soft deleted)', data: serialize(softDeletedUser) },
      { status: 200 }
    );
  } catch (error) {
    console.error('Soft Delete User Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
