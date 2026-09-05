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
  try {
    const session = await verifyAuth();
    
    // STRICT ROLE-BASED ACCESS CONTROL (SRS Section 5.1)
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: "Forbidden: Administrator access required" }, { status: 403 });
    }

    // Execute KPI queries in parallel for performance (SRS Section 5.2)
    const [
      totalPatients,
      totalCases,
      pendingAppointments,
      financialStats,
      recentInquiries
    ] = await Promise.all([
      prisma.patient.count(),
      prisma.medicalCase.count(),
      prisma.appointment.count({
        where: { status: 'Pending' }
      }),
      prisma.invoice.aggregate({
        _sum: { amount: true },
        where: { status: 'Paid' }
      }),
      prisma.supportTicket.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { patient: true }
      })
    ]);

    const dashboardData = {
      kpis: {
        totalPatients,
        activeCases: totalCases,
        pendingAppointments,
        totalRevenue: financialStats._sum.amount || 0
      },
      recentActivity: recentInquiries.map((ticket: any) => ({
        id: ticket.id,
        patientName: ticket.patient.firstName + ' ' + ticket.patient.lastName,
        subject: ticket.subject,
        status: ticket.status,
        date: ticket.createdAt
      }))
    };

    return NextResponse.json({ success: true, data: dashboardData });

  } catch (error) {
    console.error("Admin Dashboard API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
