import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/session';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

async function verifyAuth() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('maides_session')?.value;
  if (!sessionCookie) return null;
  return await verifyToken(sessionCookie) as any;
}

export async function GET() {
  const session = await verifyAuth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    if (session.role === 'ADMIN') {
      const allAppointments = await prisma.appointment.findMany();
      return NextResponse.json({ success: true, appointments: allAppointments });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.email },
      include: { patient: true }
    });

    if (!user || !user.patient) {
      return NextResponse.json({ success: false, error: "Patient profile not found" }, { status: 404 });
    }

    const patientAppointments = await prisma.appointment.findMany({
      where: { patientId: user.patient.id }
    });

    return NextResponse.json({ success: true, appointments: patientAppointments });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch appointments" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await verifyAuth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await request.json();
    
    if (session.role === 'PATIENT') {
      const user = await prisma.user.findUnique({
        where: { email: session.email },
        include: { patient: true }
      });
      if (!user || !user.patient) return NextResponse.json({ error: "Patient profile not found" }, { status: 404 });
      
      data.patientId = user.patient.id; // Enforce Mass Assignment Protection
    }

    const newAppt = await prisma.appointment.create({ data });
    return NextResponse.json({ success: true, appointment: newAppt });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create appointment" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await verifyAuth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await request.json();
    const { id, ...updateData } = data;

    if (session.role === 'PATIENT') {
      const user = await prisma.user.findUnique({
        where: { email: session.email },
        include: { patient: true }
      });
      if (!user || !user.patient) return NextResponse.json({ error: "Patient profile not found" }, { status: 404 });

      // Ensure they own it before updating
      const existing = await prisma.appointment.findUnique({ where: { id } });
      if (!existing || existing.patientId !== user.patient.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      
      // Prevent ownership transfer
      delete updateData.patientId;
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({ success: true, appointment: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update appointment" }, { status: 500 });
  }
}
