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

export async function GET() {
  if (!(await getAdminId())) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const messages = await prisma.message.findMany({
      where: { 
        ticketId: null
      },
      include: {
        patient: {
          select: { id: true, firstName: true, lastName: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ success: true, messages });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const adminId = await getAdminId();
  if (!adminId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    if (!body.text || !body.patientId) {
      return NextResponse.json({ success: false, error: 'Message text and patientId are required' }, { status: 400 });
    }

    const message = await prisma.message.create({
      data: {
        patientId: body.patientId,
        senderId: adminId,
        recipientId: body.patientId, 
        text: body.text,
        category: body.category || 'General',
        status: 'sent',
      }
    });

    return NextResponse.json({ success: true, message });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
