import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/session';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

async function verifyAuth() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('maides_session')?.value;
  if (!sessionCookie) return null;
  return await verifyToken(sessionCookie) as any;
}



export async function GET(request: Request) {
  try {
    const session = await verifyAuth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }



    // 1. Fetch Patient Profile
    const user = await prisma.user.findUnique({
      where: { email: session.email },
      include: {
        patient: {
          include: {
            cases: {
              where: {
                status: { notIn: ["Completed", "Cancelled", "Closed"] }
              },
              orderBy: { createdAt: 'desc' },
              take: 1,
              include: { hospital: true, doctor: true }
            },
            appointments: {
              where: {
                appointmentDate: { gt: new Date() },
                status: { notIn: ["Cancelled"] }
              },
              orderBy: { appointmentDate: 'asc' },
              take: 1,
              include: { doctor: true, hospital: true }
            },
            invoices: {
              include: { payments: true }
            }
          }
        }
      }
    });

    if (!user || !user.patient) {
      // Return a 404 or gracefully fallback to a completely empty state
      return NextResponse.json({ error: "Patient profile not found" }, { status: 404 });
    }

    const p = user.patient;
    const activeCase = p.cases.length > 0 ? p.cases[0] : null;
    const nextAppt = p.appointments.length > 0 ? p.appointments[0] : null;

    // Calculate Billing
    let total = 0;
    let paid = 0;
    p.invoices.forEach(inv => {
      total += inv.amount;
      inv.payments.forEach(pay => {
        if (pay.status === 'Completed') paid += pay.amount;
      });
    });

    // Derive journey from case status (simplified heuristic)
    const journeyStages = [
      "Enquiry Submitted",
      "Medical Review & Protocol",
      "Quotation Accepted",
      "Travel & Logistics",
      "Hospital Admission",
      "Discharge & Follow-Up"
    ];
    
    // Map status to a stage index 1-6 (default to 1 if unknown)
    const statusMap: Record<string, number> = {
      "New": 1,
      "Review": 2,
      "Approved": 3,
      "Travel & Logistics": 4,
      "Admitted": 5,
      "Discharged": 6
    };
    const currentStage = activeCase ? (statusMap[activeCase.status] || 1) : 0;

    const journey = journeyStages.map((title, index) => {
      const stage = index + 1;
      let status = "pending";
      if (stage < currentStage) status = "completed";
      else if (stage === currentStage) status = "current";
      
      return {
        stage,
        title,
        status,
        date: status === "completed" ? "Completed" : (status === "current" ? "In Progress" : "Upcoming")
      };
    });

    // Construct unified payload
    const payload = {
      patient: {
        id: p.id,
        name: `${p.firstName} ${p.lastName}`,
        email: user.email,
        verificationStatus: "Verified", // In a real app, from DB
        location: p.country || "International",
        patientType: p.country?.toLowerCase() === "india" ? "Domestic" : "International"
      },
      activeCase: activeCase ? {
        id: activeCase.id,
        treatment: activeCase.treatment || activeCase.condition,
        hospital: activeCase.hospital?.name || "Pending Selection",
        doctor: activeCase.doctor?.name || "Pending Assignment",
        status: activeCase.status,
        currentStage
      } : null,
      nextAppointment: nextAppt ? {
        id: nextAppt.id,
        dateTime: nextAppt.appointmentDate.toISOString(),
        service: nextAppt.notes || "Medical Consultation",
        doctor: nextAppt.doctor?.name || "Pending Assignment",
        status: nextAppt.status
      } : null,
      visa: {
        status: activeCase && activeCase.hospitalId ? "Letter Issued" : "Not Required",
        reference: activeCase ? `VISA-REF-${activeCase.id.slice(0, 6)}` : null
      },
      billing: {
        currency: p.invoices.length > 0 ? p.invoices[0].currency : "USD",
        total,
        paid,
        balance: total - paid,
        status: total === 0 ? "No Invoices" : (paid >= total ? "Fully Paid" : "Partially Paid")
      },
      journey: activeCase ? journey : [],
      isDemo: false
    };

    return NextResponse.json(payload);

  } catch (error) {
    console.error("Dashboard API Error:", error);
    // If DB fails entirely (like on Vercel missing SQLite), fallback to demo if email matches demo
    // Otherwise return 500
    return NextResponse.json({ error: "Failed to retrieve dashboard data" }, { status: 500 });
  }
}
