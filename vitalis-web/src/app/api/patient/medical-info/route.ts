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
    const medicalInfo = await prisma.medicalInfo.findUnique({ where: { patientId } });
    return NextResponse.json({ success: true, medicalInfo: medicalInfo || null });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const patientId = await getPatientId();
  if (!patientId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { allergies, conditions, medications, bloodType, previousSurgeries, emergencyContact } = body;

    const medicalInfo = await prisma.medicalInfo.upsert({
      where: { patientId },
      create: {
        patientId,
        allergies: allergies || null,
        conditions: conditions || null,
        medications: medications || null,
        bloodType: bloodType || null,
        previousSurgeries: previousSurgeries || null,
        emergencyContact: emergencyContact || null,
      },
      update: {
        ...(allergies !== undefined && { allergies }),
        ...(conditions !== undefined && { conditions }),
        ...(medications !== undefined && { medications }),
        ...(bloodType !== undefined && { bloodType }),
        ...(previousSurgeries !== undefined && { previousSurgeries }),
        ...(emergencyContact !== undefined && { emergencyContact }),
      }
    });

    return NextResponse.json({ success: true, medicalInfo });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
