// app/api/menus/[id]/route.js
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

// PUT /api/menus/[id] - Update sidebar menu item
export async function PUT(request, { params }) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) return unauthorized('Unauthorized access');

    const { id } = await params;
    const menuId = Number(id);

    if (!menuId || isNaN(menuId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid menu ID provided.' },
        { status: 400 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { label, href, icon, parentId, sortOrder, status } = body;

    const updateData = {};
    if (label !== undefined) updateData.label = label;
    if (href !== undefined) updateData.href = href;
    if (icon !== undefined) updateData.icon = icon;
    if (parentId !== undefined) updateData.parentId = parentId ? Number(parentId) : null;
    if (sortOrder !== undefined) updateData.sortOrder = Number(sortOrder);
    if (status !== undefined) updateData.status = Number(status);

    const updatedMenu = await prisma.menu.update({
      where: { id: menuId },
      data: updateData,
    });

    return NextResponse.json(
      { success: true, message: 'Menu item updated successfully', data: serialize(updatedMenu) },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update Menu Error:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, message: 'Menu item not found.' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/menus/[id] - Soft delete menu item (Set status = 0)
export async function DELETE(request, { params }) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) return unauthorized('Unauthorized access');

    const { id } = await params;
    const menuId = Number(id);

    if (!menuId || isNaN(menuId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid menu ID provided.' },
        { status: 400 }
      );
    }

    // Soft delete: update status to 0
    const updatedMenu = await prisma.menu.update({
      where: { id: menuId },
      data: { status: 0 },
    });

    return NextResponse.json(
      { success: true, message: 'Menu item deactivated successfully (Soft deleted).', data: serialize(updatedMenu) },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete Menu Error:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, message: 'Menu item not found.' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
