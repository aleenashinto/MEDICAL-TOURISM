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

  const response = NextResponse.next();
  
  // Phase 14: Browser Cache Testing & Security
  // Prevent sensitive medical data from being cached by the browser.
  // This ensures that if a user logs out and presses "Back", the browser won't show cached PHI.
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');

  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/patient/:path*'],
};
