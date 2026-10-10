// src/middleware.js
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const getSecretKey = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret && process.env.NODE_ENV === 'production') {
    throw new Error('CRITICAL: JWT_SECRET environment variable is missing in production!');
  }
  return new TextEncoder().encode(secret || 'default_jwt_secret_key_spot_optics');
};

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Protect all /dashboard routes
  if (pathname.startsWith('/dashboard')) {
    const token = request.cookies.get('accessToken')?.value;

    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      await jwtVerify(token, getSecretKey());
      return NextResponse.next();
    } catch (err) {
      // Invalid or expired token -> redirect to /login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete('accessToken');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/dashboard'],
};
