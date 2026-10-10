// app/api/software/links/[id]/route.js
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

// PUT /api/software/links/[id] - Update software link (status or isUsed)
export async function PUT(request, { params }) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) return unauthorized('Unauthorized access');

    const resolvedParams = await params;
    const id = Number(resolvedParams.id);
    if (!Number.isInteger(id)) {
      return NextResponse.json({ success: false, message: 'Invalid Link ID' }, { status: 400 });
    }

    const body = await request.json().catch(() => ({}));
    const { status, isUsed } = body;

    const updateData = {};
    if (status !== undefined) updateData.status = Number(status);
    if (isUsed !== undefined) updateData.isUsed = Boolean(isUsed);

    const updatedLink = await prisma.softwareLink.update({
      where: { id },
      data: updateData,
      include: {
        software: true,
        receiver: { select: { id: true, name: true, username: true, role: true } },
        creator: { select: { id: true, name: true, username: true, role: true } },
      },
    });

    return NextResponse.json(
      { success: true, message: 'Software link updated successfully', data: serialize(updatedLink) },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update Software Link Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/software/links/[id] - Soft delete/revoke link (updates status to 0)
export async function DELETE(request, { params }) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) return unauthorized('Unauthorized access');

    const resolvedParams = await params;
    const id = Number(resolvedParams.id);
    if (!Number.isInteger(id)) {
      return NextResponse.json({ success: false, message: 'Invalid Link ID' }, { status: 400 });
    }

    const revokedLink = await prisma.softwareLink.update({
      where: { id },
      data: { status: 0 },
    });

    return NextResponse.json(
      { success: true, message: 'Access link status updated to revoked (0)', data: serialize(revokedLink) },
      { status: 200 }
    );
  } catch (error) {
    console.error('Revoke Software Link Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
