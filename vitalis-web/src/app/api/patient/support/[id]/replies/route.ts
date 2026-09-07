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

export async function POST(request: Request, context: any) {
  const patientId = await getPatientId();
  if (!patientId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const params = await context.params;
  const ticketId = params.id;

  try {
    const ticket = await prisma.supportTicket.findUnique({
      where: { id: ticketId }
    });

    if (!ticket || ticket.patientId !== patientId) {
      return NextResponse.json({ success: false, error: 'Ticket not found or unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    if (!body.text) return NextResponse.json({ success: false, error: 'Message text is required' }, { status: 400 });

    const message = await prisma.message.create({
      data: {
        patientId,
        senderId: patientId,
        recipientId: 'ADMIN',
        text: body.text,
        category: 'Support',
        ticketId
      }
    });

    return NextResponse.json({ success: true, message });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
