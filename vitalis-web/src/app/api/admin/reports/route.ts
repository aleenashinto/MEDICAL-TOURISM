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

    const totalPatients = await prisma.patient.count();
    const totalCases = await prisma.medicalCase.count();
    const totalAppointments = await prisma.appointment.count();
    const totalInvoices = await prisma.invoice.count();

    const paidInvoices = await prisma.invoice.aggregate({
      where: { status: 'PAID' },
      _sum: { amount: true },
    });

    const casesByStatus = await prisma.medicalCase.groupBy({
      by: ['status'],
      _count: { status: true },
    });

    return NextResponse.json({
      success: true,
      reports: {
        summary: {
          totalPatients,
          totalCases,
          totalAppointments,
          totalInvoices,
          totalRevenue: paidInvoices._sum.amount || 0,
        },
        casesByStatus,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Failed to fetch reports' }, { status: 500 });
  }
}
