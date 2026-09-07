import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/session';
import { cookies } from 'next/headers';

async function verifyAdmin() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('maides_session')?.value || cookieStore.get('vitalis_session')?.value;
  if (!sessionToken) return null;
  const decoded = await verifyToken(sessionToken);
  if (!decoded || decoded.role !== 'ADMIN') return null;
  return decoded;
}

export async function GET() {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const auditLogs = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return NextResponse.json({ success: true, logs: auditLogs });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Failed to fetch audit logs' }, { status: 500 });
  }
}
