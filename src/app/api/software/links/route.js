// app/api/software/links/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createActivityLog } from '@/lib/auditLog';
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

// GET /api/software/links - Fetch all generated software access links
export async function GET(request) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) return unauthorized('Unauthorized access');

    let links = [];
    try {
      links = await prisma.softwareLink.findMany({
        orderBy: { id: 'desc' },
        include: {
          software: true,
          receiver: {
            select: { id: true, name: true, username: true, role: true },
          },
          creator: {
            select: { id: true, name: true, username: true, role: true },
          },
        },
      });
    } catch (dbErr) {
      console.warn('Prisma software links query warning:', dbErr.message);
    }

    return NextResponse.json(
      { success: true, data: serialize(links || []) },
      { status: 200 }
    );
  } catch (error) {
    console.error('Fetch Software Links Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/software/links - Generate new software link
export async function POST(request) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) return unauthorized('Unauthorized access');

    const creatorId = Number(auth.id || auth.userId || 1);
    const body = await request.json().catch(() => ({}));
    const { softwareId, assignedTo, customToken } = body;

    if (!softwareId || !assignedTo) {
      return NextResponse.json(
        { success: false, message: 'Software Package and Assigned User are required.' },
        { status: 400 }
      );
    }

    const secureToken = customToken && customToken.trim()
      ? customToken.trim().toUpperCase()
      : `LINK-${crypto.randomBytes(8).toString('hex').toUpperCase()}`;

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
        receiver: { select: { id: true, name: true, username: true, role: true } },
        creator: { select: { id: true, name: true, username: true, role: true } },
      },
    });

    await createActivityLog({
      userId: creatorId,
      action: 'GENERATE_SOFTWARE_LINK',
      module: 'SOFTWARE_LINKS',
      details: `Generated access token ${secureToken} for "${link.software?.name || 'Software'}" assigned to ${link.receiver?.name || 'User'}`,
      targetId: link.id,
      newData: link,
      request,
    });

    return NextResponse.json(
      { success: true, message: 'Software access link created successfully', data: serialize(link) },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create Software Link Error:', error);
    if (error.code === 'P2002') {
      return NextResponse.json(
        { success: false, message: 'Token already exists. Generated token must be unique.' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
