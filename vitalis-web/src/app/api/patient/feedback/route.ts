import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/session';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('maides_session')?.value || cookieStore.get('vitalis_session')?.value;
    if (!token) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const decoded = await verifyToken(token);
    if (!decoded || !decoded.email) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const email = decoded.email as string;
    const body = await request.json();
    const { category, targetName, treatment, rating, comment, recommend } = body;

    if (!rating || !comment) {
      return NextResponse.json({ success: false, error: 'Rating and comment are required' }, { status: 400 });
    }

    const patient = await prisma.patient.findFirst({
      where: { user: { email } }
    });

    if (!patient) {
      return NextResponse.json({ success: false, error: 'Patient profile not found' }, { status: 404 });
    }

    const feedback = await prisma.auditLog.create({
      data: {
        action: 'PATIENT_FEEDBACK',
        actorEmail: email,
        details: JSON.stringify({
          patientId: patient.id,
          patientName: `${patient.firstName} ${patient.lastName}`,
          category: category || 'Hospital Care',
          targetName: targetName || 'General Service',
          treatment: treatment || 'Medical Tourism',
          rating: Number(rating),
          recommend: Boolean(recommend),
          comment,
          submittedAt: new Date().toISOString()
        })
      }
    });

    return NextResponse.json({ success: true, feedback });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
