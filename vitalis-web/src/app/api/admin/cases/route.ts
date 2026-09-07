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
  const search = searchParams.get('search') || '';

  try {
    const cases = await prisma.medicalCase.findMany({
      where: {
        AND: [
          status ? { status } : {},
          search ? {
            OR: [
              { condition: { contains: search } },
              { treatment: { contains: search } },
              { patient: { firstName: { contains: search } } },
              { patient: { lastName: { contains: search } } },
            ]
          } : {}
        ]
      },
      include: {
        patient: {
          select: {
            id: true, firstName: true, lastName: true, country: true, phone: true,
            user: { select: { email: true } }
          }
        },
        hospital: { select: { id: true, name: true, city: true } },
        doctor: { select: { id: true, name: true, specialty: true } },
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, cases });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await verifyAdmin())) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { patientId, condition, treatment, hospitalId, doctorId, status, notes, estimatedCost, currency } = body;

    if (!patientId || !condition) {
      return NextResponse.json({ success: false, error: 'patientId and condition are required' }, { status: 400 });
    }

    const medicalCase = await prisma.medicalCase.create({
      data: {
        patientId,
        condition,
        treatment: treatment || condition,
        hospitalId: hospitalId || null,
        doctorId: doctorId || null,
        status: status || 'New',
        notes: notes || null,
        estimatedCost: estimatedCost ? parseFloat(estimatedCost) : null,
        currency: currency || 'USD',
      },
      include: {
        patient: { select: { firstName: true, lastName: true } },
        hospital: { select: { name: true } },
        doctor: { select: { name: true } },
      }
    });

    return NextResponse.json({ success: true, case: medicalCase });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!(await verifyAdmin())) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { id, ...updates } = body;
    if (!id) return NextResponse.json({ success: false, error: 'Case ID is required' }, { status: 400 });

    const allowedFields = ['status', 'treatment', 'condition', 'hospitalId', 'doctorId', 'notes', 'estimatedCost', 'currency', 'visaStatus', 'visaReference', 'visaExpiry'];
    const updateData: Record<string, any> = {};
    for (const field of allowedFields) {
      if (updates[field] !== undefined) updateData[field] = updates[field];
    }

    const medicalCase = await prisma.medicalCase.update({
      where: { id },
      data: updateData,
      include: {
        patient: { select: { firstName: true, lastName: true } },
        hospital: { select: { name: true } },
        doctor: { select: { name: true } },
      }
    });

    return NextResponse.json({ success: true, case: medicalCase });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
