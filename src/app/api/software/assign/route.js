// app/api/software/assign/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';
import crypto from 'crypto';

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

// POST /api/software/assign - Assign software download link token to user
export async function POST(request) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) return unauthorized('Unauthorized access');

    const creatorId = Number(auth.id || auth.userId || 1);
    const body = await request.json().catch(() => ({}));
    const { softwareId, assignedTo } = body;

    if (!softwareId || !assignedTo) {
      return NextResponse.json(
        { success: false, message: 'Software ID and Assigned User ID are required.' },
        { status: 400 }
      );
    }

    const secureToken = `LINK-${crypto.randomBytes(8).toString('hex').toUpperCase()}`;

    const link = await prisma.softwareLink.create({
      data: {
        softwareId: Number(softwareId),
        assignedTo: Number(assignedTo),
        assignedBy: creatorId,
        secureToken,
        isUsed: false,
        status: 1,
      },
      include: {
        software: true,
        receiver: { select: { id: true, name: true, username: true } },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Software access link successfully assigned!',
        data: serialize(link),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Assign Software Link Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
