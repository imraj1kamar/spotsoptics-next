// app/api/menus/route.js
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

// visibility (JSON array of roles) me userRole hai ya nahi
function isVisibleForRole(visibility, userRole) {
  if (!visibility) return false;
  try {
    const roles = typeof visibility === 'string' ? JSON.parse(visibility) : visibility;
    return Array.isArray(roles) && roles.map((r) => String(r).toUpperCase()).includes(userRole);
  } catch (e) {
    return false;
  }
}

// GET /api/menus - Role ke hisaab se sidebar menus
export async function GET(request) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) return unauthorized('Unauthorized: No token provided.');

    const { searchParams } = new URL(request.url);
    const fetchAll = searchParams.get('all') === 'true';

    const userRole = String(auth.role || '').toUpperCase();

    const menus = await prisma.menu.findMany({
      where: userRole === 'ADMIN' && fetchAll ? {} : { status: 1 },
      select: {
        id: true,
        label: true,
        href: true,
        icon: true,
        sortOrder: true,
        status: true,
        visibility: true,
      },
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    });

    // ADMIN ko sab, baaki ko sirf wahi jinki visibility me unka role ho
    const filteredMenus =
      userRole === 'ADMIN'
        ? menus
        : menus.filter((m) => isVisibleForRole(m.visibility, userRole));

    const formattedMenus = filteredMenus.map((m) => ({
      id: m.id,
      label: m.label,
      href: m.href,
      icon: m.icon,
      parentId: null,
      sortOrder: m.sortOrder ?? m.id,
      status: m.status,
      visibility: m.visibility,
    }));

    return NextResponse.json(
      { success: true, role: userRole, data: serialize(formattedMenus) },
      { status: 200, headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error) {
    console.error('Menus Fetch Error:', error);
    return NextResponse.json(
      { success: false, message: 'Menu fetch failed: ' + error.message },
      { status: 500 }
    );
  }
}

// POST /api/menus - Naya sidebar menu banao (sirf ADMIN)
export async function POST(request) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) return unauthorized('Unauthorized access');

    if (String(auth.role || '').toUpperCase() !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Only admin can create menus.' },
        { status: 403 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const {
      label,
      href,
      icon = 'Home',
      sortOrder = 0,
      status = 1,
      visibility = ['ADMIN'],
    } = body;

    if (!label || !href) {
      return NextResponse.json(
        { success: false, message: 'Menu label and target URL href are required.' },
        { status: 400 }
      );
    }

    const menu = await prisma.menu.create({
      data: {
        label,
        href,
        icon,
        sortOrder: Number(sortOrder),
        status: Number(status),
        visibility,
      },
    });

    return NextResponse.json(
      { success: true, message: 'Sidebar menu item created successfully', data: serialize(menu) },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create Menu Error:', error);
    if (error.code === 'P2002') {
      return NextResponse.json(
        { success: false, message: 'A menu item with this URL href already exists.' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}