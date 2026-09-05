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

export async function GET(request: Request) {
  try {
    const session = await verifyAuth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (session.role === 'ADMIN') {
      const allCases = await prisma.medicalCase.findMany();
      return NextResponse.json(allCases);
    }

    const user = await prisma.user.findUnique({
      where: { email: session.email },
      include: { patient: true }
    });

    if (!user || !user.patient) {
      return NextResponse.json({ error: "Patient profile not found" }, { status: 404 });
    }

    const patientCases = await prisma.medicalCase.findMany({
      where: { patientId: user.patient.id }
    });

    return NextResponse.json(patientCases);
  } catch (error) {
    return NextResponse.json([]);
  }
}
