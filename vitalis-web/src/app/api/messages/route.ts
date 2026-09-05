import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/session';
import { cookies } from 'next/headers';

async function verifyAuth() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('maides_session')?.value;
  if (!sessionCookie) return null;
  return await verifyToken(sessionCookie) as any;
}

export async function GET() {
  const session = await verifyAuth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  // Return empty messages for now to satisfy data isolation rules 
  // without hardcoded mock data.
  return NextResponse.json({ success: true, messages: [] });
}
