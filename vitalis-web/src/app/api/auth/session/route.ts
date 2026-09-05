import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/session';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('maides_session')?.value;
  
  if (!sessionToken) {
    return NextResponse.json({ authenticated: false });
  }

  const payload = await verifyToken(sessionToken);

  if (!payload) {
    return NextResponse.json({ authenticated: false });
  }

  return NextResponse.json({ authenticated: true, session: payload });
}
