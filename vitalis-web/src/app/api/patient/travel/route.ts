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
    const activeCase = await prisma.medicalCase.findFirst({
      where: { patientId },
      include: {
        hospital: { select: { id: true, name: true, city: true, address: true, emergencyPhone: true } },
        doctor: { select: { id: true, name: true, specialty: true, phone: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    if (!activeCase) {
      return NextResponse.json({ success: true, activeCase: null });
    }

    const nextAppointment = await prisma.appointment.findFirst({
      where: { patientId, appointmentDate: { gte: new Date() } },
      include: { doctor: true, hospital: true },
      orderBy: { appointmentDate: 'asc' }
    });

    return NextResponse.json({
      success: true,
      activeCase,
      nextAppointment
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
