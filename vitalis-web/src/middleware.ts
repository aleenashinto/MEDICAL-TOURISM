import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/session';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Define protected routes
  const isAdminRoute = path.startsWith('/admin');
  const isPatientRoute = path.startsWith('/patient');
  
  if (!isAdminRoute && !isPatientRoute) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get('maides_session')?.value;

  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  const session = await verifyToken(sessionCookie);

  if (!session) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Role based access control
  if (isAdminRoute && session.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/patient/dashboard', request.url));
  }

  if (isPatientRoute && session.role === 'ADMIN') {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/patient/:path*'],
};
