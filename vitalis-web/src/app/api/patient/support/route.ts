import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/session';
import { cookies } from 'next/headers';

async function getPatientId() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('maides_session')?.value || cookieStore.get('vitalis_session')?.value;
  if (!sessionCookie) return null;
  const session = await verifyToken(sessionCookie);
  if (!session || !session.email) return null;
  const user = await prisma.user.findUnique({
    where: { email: session.email as string },
    include: { patient: true }
  });
  return user?.patient?.id || null;
}

export async function GET() {
  const patientId = await getPatientId();
  if (!patientId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const tickets = await prisma.supportTicket.findMany({
      where: { patientId },
      include: {
        messages: { orderBy: { createdAt: 'asc' } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, tickets });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const patientId = await getPatientId();
  if (!patientId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { subject, description, priority } = body;

    if (!subject || !description) {
      return NextResponse.json({ success: false, error: 'Subject and description are required' }, { status: 400 });
    }

    const ticket = await prisma.supportTicket.create({
      data: {
        patientId,
        subject,
        description,
        priority: priority || 'Medium',
        status: 'Open'
      }
    });

    return NextResponse.json({ success: true, ticket });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
