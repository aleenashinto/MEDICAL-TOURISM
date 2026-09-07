import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/session';
import { cookies } from 'next/headers';

async function getPatientRecord() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('maides_session')?.value || cookieStore.get('vitalis_session')?.value;
  if (!sessionCookie) return null;
  const session = await verifyToken(sessionCookie);
  if (!session || !session.email) return null;

  const user = await prisma.user.findUnique({
    where: { email: session.email as string },
    include: { patient: { include: { user: { select: { email: true, isVerified: true } } } } }
  });
  return user?.patient || null;
}

export async function GET() {
  const patient = await getPatientRecord();
  if (!patient) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  return NextResponse.json({ success: true, patient });
}

export async function PUT(request: Request) {
  const patient = await getPatientRecord();
  if (!patient) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();

    const allowedFields = [
      'firstName', 'lastName', 'phone', 'altPhone', 'dob', 'gender',
      'country', 'state', 'city', 'addressLine1', 'addressLine2', 'postalCode',
      'passportNo', 'passportExpiry', 'nationality',
      'emergencyName', 'emergencyRelation', 'emergencyPhone', 'emergencyEmail',
      'bloodGroup'
    ];

    const updateData: Record<string, any> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    const updated = await prisma.patient.update({
      where: { id: patient.id },
      data: updateData,
      include: { user: { select: { email: true, isVerified: true } } }
    });

    return NextResponse.json({ success: true, patient: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
