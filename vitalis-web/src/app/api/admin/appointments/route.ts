import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/session';
import { cookies } from 'next/headers';

async function verifyAdmin() {
  const cookieStore = await cookies();
  const session = await verifyToken(cookieStore.get('maides_session')?.value || '');
  return session?.role === 'ADMIN' ? session : null;
}

export async function GET(request: Request) {
  if (!(await verifyAdmin())) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || '';

  try {
    const appointments = await prisma.appointment.findMany({
      where: status ? { status } : {},
      include: {
        patient: { select: { id: true, firstName: true, lastName: true, phone: true, country: true } },
        doctor: { select: { id: true, name: true, specialty: true } },
        hospital: { select: { id: true, name: true, city: true } },
      },
      orderBy: { appointmentDate: 'asc' }
    });

    return NextResponse.json({ success: true, appointments });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!(await verifyAdmin())) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { id, status, notes, doctorId, hospitalId, appointmentDate } = body;

    if (!id) return NextResponse.json({ success: false, error: 'Appointment ID is required' }, { status: 400 });

    const updateData: Record<string, any> = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    if (doctorId) updateData.doctorId = doctorId;
    if (hospitalId) updateData.hospitalId = hospitalId;
    if (appointmentDate) updateData.appointmentDate = new Date(appointmentDate);

    const appointment = await prisma.appointment.update({
      where: { id },
      data: updateData,
      include: {
        patient: { select: { firstName: true, lastName: true } },
        doctor: { select: { name: true } },
        hospital: { select: { name: true } },
      }
    });

    return NextResponse.json({ success: true, appointment });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
