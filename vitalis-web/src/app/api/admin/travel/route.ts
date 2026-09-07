import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/session';
import { cookies } from 'next/headers';

async function verifyAdmin() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('maides_session')?.value || cookieStore.get('vitalis_session')?.value;
  if (!sessionToken) return null;
  const decoded = await verifyToken(sessionToken);
  if (!decoded || decoded.role !== 'ADMIN') return null;
  return decoded;
}

export async function GET() {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const cases = await prisma.medicalCase.findMany({
      select: {
        id: true,
        patientId: true,
        condition: true,
        status: true,
        visaStatus: true,
        visaReference: true,
        arrivalDate: true,
        departureDate: true,
        flightDetails: true,
        airportPickup: true,
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            passportNo: true,
            country: true,
            phone: true,
            user: { select: { email: true } },
          },
        },
        hospital: {
          select: {
            id: true,
            name: true,
            city: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, travel: cases });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Failed to fetch travel data' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { caseId, visaStatus, visaReference, arrivalDate, departureDate, flightDetails, airportPickup } = body;

    if (!caseId) {
      return NextResponse.json({ success: false, error: 'caseId is required' }, { status: 400 });
    }

    const updated = await prisma.medicalCase.update({
      where: { id: caseId },
      data: {
        ...(visaStatus !== undefined && { visaStatus }),
        ...(visaReference !== undefined && { visaReference }),
        ...(arrivalDate !== undefined && { arrivalDate: arrivalDate ? new Date(arrivalDate) : null }),
        ...(departureDate !== undefined && { departureDate: departureDate ? new Date(departureDate) : null }),
        ...(flightDetails !== undefined && { flightDetails }),
        ...(airportPickup !== undefined && { airportPickup: Boolean(airportPickup) }),
      },
    });

    return NextResponse.json({ success: true, case: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Failed to update travel data' }, { status: 500 });
  }
}
