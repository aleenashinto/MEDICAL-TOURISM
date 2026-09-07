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
    if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const feedbackLogs = await prisma.auditLog.findMany({
      where: { action: 'PATIENT_FEEDBACK' },
      orderBy: { createdAt: 'desc' },
    });

    const feedbacks = feedbackLogs.map((log: any) => {
      let details: any = {};
      try { details = JSON.parse(log.details || '{}'); } catch (e) {}
      return {
        id: log.id,
        actorEmail: log.actorEmail,
        createdAt: log.createdAt,
        ...details
      };
    });

    return NextResponse.json({ success: true, feedbacks });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
