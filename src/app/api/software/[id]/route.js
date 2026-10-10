// app/api/software/[id]/route.js
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

// PUT /api/software/[id] - Update software record
export async function PUT(request, { params }) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) return unauthorized('Unauthorized access');

    const resolvedParams = await params;
    const id = Number(resolvedParams.id);
    if (!Number.isInteger(id)) {
      return NextResponse.json({ success: false, message: 'Invalid Software ID' }, { status: 400 });
    }

    const body = await request.json().catch(() => ({}));
    const { name, description, baseFileUrl, status } = body;

    const updateData = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (baseFileUrl) updateData.baseFileUrl = baseFileUrl;
    if (status !== undefined) updateData.status = Number(status);

    const updatedSoftware = await prisma.software.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(
      { success: true, message: 'Software updated successfully', data: serialize(updatedSoftware) },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update Software Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/software/[id] - Soft delete software (set status to 0)
export async function DELETE(request, { params }) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) return unauthorized('Unauthorized access');

    const resolvedParams = await params;
    const id = Number(resolvedParams.id);
    if (!Number.isInteger(id)) {
      return NextResponse.json({ success: false, message: 'Invalid Software ID' }, { status: 400 });
    }

    const softDeleted = await prisma.software.update({
      where: { id },
      data: { status: 0 },
    });

    return NextResponse.json(
      { success: true, message: 'Software status updated to inactive', data: serialize(softDeleted) },
      { status: 200 }
    );
  } catch (error) {
    console.error('Soft Delete Software Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
