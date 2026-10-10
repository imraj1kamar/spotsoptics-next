// app/api/auth/login/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createActivityLog } from '@/lib/auditLog';
import { SignJWT } from 'jose';
import bcrypt from 'bcryptjs';

// Static dummy hash for missing user timing resistance
const DUMMY_HASH = '$2a$10$e8wWw0L4vO7N5yN.1x3MLe7Gq1kY7P.0r2h1e5a8n7o9P0L1M2N3O';

const getSecretKey = (isRefresh = false) => {
  const name = isRefresh ? 'REFRESH_TOKEN_SECRET' : 'JWT_SECRET';
  const secret = process.env[name] || (isRefresh ? 'default_refresh_secret_key_spot_optics' : 'default_jwt_secret_key_spot_optics');
  return new TextEncoder().encode(secret);
};

const invalid = () =>
  NextResponse.json(
    { success: false, message: 'Invalid username or password.' },
    { status: 401 }
  );

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const username = body.username || body.email;
    const { password } = body;

    // 1. Validation + type check
    if (
      typeof username !== 'string' ||
      typeof password !== 'string' ||
      !username.trim() ||
      !password
    ) {
      return NextResponse.json(
        { success: false, message: 'Username and password are required.' },
        { status: 400 }
      );
    }

    const trimmedUsername = username.trim();

    // 2. Find user from Database
    let user = null;
    try {
      user = await prisma.user.findUnique({
        where: { username: trimmedUsername },
      });
    } catch (dbError) {
      console.error('Prisma DB query error during login:', dbError.message);
      return NextResponse.json(
        { success: false, message: 'Database connection failure.' },
        { status: 500 }
      );
    }

    if (!user) {
      await bcrypt.compare(password, DUMMY_HASH).catch(() => {});
      return invalid();
    }

    // 3. Verify password against hash in database
    const isPasswordValid = await bcrypt.compare(password, user.password).catch(() => false);

    if (!isPasswordValid) return invalid();

    // 4. Status checks
    if (Number(user.status) !== 1) {
      return NextResponse.json(
        { success: false, message: 'Your account is inactive or blocked.' },
        { status: 403 }
      );
    }

    const roleName = String(user.role).toUpperCase();

    // 5. Tokens
    const accessToken = await new SignJWT({
      id: String(user.id),
      username: user.username,
      role: roleName,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('15m')
      .sign(getSecretKey(false));

    const refreshToken = await new SignJWT({ id: String(user.id) })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(getSecretKey(true));

    // Record Activity Log entry for login
    await createActivityLog({
      userId: user.id,
      action: 'USER_LOGIN',
      module: 'AUTH',
      details: `User ${user.name || user.username} (@${user.username}) logged in successfully as ${roleName}`,
      targetId: user.id,
      request,
    });

    // 6. Build response
    const response = NextResponse.json(
      {
        success: true,
        message: 'Login successful!',
        data: {
          id: user.id,
          username: user.username,
          name: user.name,
          displayName: user.name || user.username,
          role: roleName,
        },
      },
      { status: 200 }
    );

    const base = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    };

    response.cookies.set({ ...base, name: 'accessToken', value: accessToken, maxAge: 15 * 60, path: '/' });
    response.cookies.set({ ...base, name: 'refreshToken', value: refreshToken, maxAge: 7 * 24 * 60 * 60, path: '/api/auth/refresh' });

    return response;
  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}