import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/session';
import { cookies } from 'next/headers';

async function getAdminId() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('maides_session')?.value || cookieStore.get('vitalis_session')?.value;
  if (!sessionCookie) return null;
  const session = await verifyToken(sessionCookie);
  if (!session || session.role !== 'ADMIN') return null;
  
  if (session.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.email as string },
      include: { admin: true }
    });
    return user?.admin?.id || user?.id || 'admin';
  }
  return 'admin';
}

export async function POST(request: Request, context: any) {
  const adminId = await getAdminId();
  if (!adminId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const params = await context.params;
  const ticketId = params.id;

  try {
    const ticket = await prisma.supportTicket.findUnique({
      where: { id: ticketId }
    });

    if (!ticket) {
      return NextResponse.json({ success: false, error: 'Ticket not found' }, { status: 404 });
    }

    const body = await request.json();
    if (!body.text) {
      return NextResponse.json({ success: false, error: 'Message text is required' }, { status: 400 });
    }

    const message = await prisma.message.create({
      data: {
        patientId: ticket.patientId,
        senderId: adminId,
        recipientId: ticket.patientId, 
        text: body.text,
        category: 'Support',
        ticketId: ticketId,
      }
    });

    if (ticket.status === 'Open') {
      await prisma.supportTicket.update({
        where: { id: ticketId },
        data: { status: 'In Progress' }
      });
    }

    return NextResponse.json({ success: true, message });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
