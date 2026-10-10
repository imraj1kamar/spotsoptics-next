// app/api/auth/profile/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';

const getSecretKey = () => {
  const secret = process.env.JWT_SECRET || 'default_jwt_secret_key_spot_optics';
  return new TextEncoder().encode(secret);
};

const serialize = (obj) =>
  JSON.parse(JSON.stringify(obj, (_, v) => (typeof v === 'bigint' ? v.toString() : v)));

const unauthorized = (message) =>
  NextResponse.json({ success: false, message }, { status: 401 });

export async function GET(request) {
  try {
    // 1. Header ya cookie se token nikalo
    const authHeader = request.headers.get('authorization');
    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else {
      token = request.cookies.get('accessToken')?.value;
    }

    if (!token) return unauthorized('Unauthorized: No token provided.');

    // 2. Token verify karo
    const { payload } = await jwtVerify(token, getSecretKey());

    // token mein id string hai, Prisma ko Int chahiye
    const userId = Number(payload.id);
    if (!Number.isInteger(userId)) return unauthorized('Invalid token payload.');

    // 3. DB se user details fetch karo
    let user = null;
    try {
      user = await prisma.user.findUnique({
        where: { id: userId },
      });
    } catch (dbErr) {
      console.error('Prisma profile query error:', dbErr.message);
      return unauthorized('Database query failure.');
    }

    if (!user || Number(user.status) !== 1) {
      return unauthorized('User not found or inactive.');
    }

    // 4. Password field remove karke return karo
    const { password: _, ...userData } = user;

    return NextResponse.json(
      { success: true, data: serialize(userData) },
      { status: 200 }
    );
  } catch (error) {
    console.error('Profile Fetch Error:', error);
    return unauthorized('Invalid or expired token.');
  }
}