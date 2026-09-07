import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/session';
import { cookies } from 'next/headers';

async function verifyAdmin() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('maides_session')?.value || cookieStore.get('vitalis_session')?.value;
  if (!sessionCookie) return null;
  const session = await verifyToken(sessionCookie);
  return session?.role === 'ADMIN' ? session : null;
}

export async function GET(request: Request) {
  if (!(await verifyAdmin())) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || '';

  try {
    const patients = await prisma.patient.findMany({
      where: {
        AND: [
          search ? {
            OR: [
              { firstName: { contains: search } },
              { lastName: { contains: search } },
              { country: { contains: search } },
            ]
          } : {},
          status ? { user: { isVerified: status === 'verified' } } : {}
        ]
      },
      include: {
        user: { select: { email: true, isVerified: true, createdAt: true } },
        cases: { select: { id: true, status: true, treatment: true }, orderBy: { createdAt: 'desc' }, take: 1 },
        appointments: { select: { id: true, appointmentDate: true, status: true }, orderBy: { appointmentDate: 'asc' }, take: 1 },
        invoices: { select: { id: true, amount: true, status: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, patients });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
