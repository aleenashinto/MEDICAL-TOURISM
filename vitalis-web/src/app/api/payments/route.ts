import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/session';
import { cookies } from 'next/headers';

async function verifyAuth() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('maides_session')?.value;
  if (!sessionCookie) return null;
  return await verifyToken(sessionCookie) as any;
}

let globalPayments = [
  {
    id: "PAY-2026-001",
    patientEmail: "sarah.jenkins@example.com",
    invoiceNo: "INV-2026-042",
    treatment: "Total Knee Replacement All-Inclusive Package",
    hospital: "Aster Medcity, Kochi",
    breakdown: [
      { item: "Surgical Procedure", amount: ",400" },
      { item: "Implant", amount: ",200" }
    ],
    totalUSD: ",600",
    status: "DEPOSIT_PAID",
    depositPaid: ",500",
    balanceDue: ",100",
  }
];

export async function GET() {
  const session = await verifyAuth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const payments = session.role === 'ADMIN' ? globalPayments : globalPayments.filter(p => p.patientEmail.toLowerCase() === session.email.toLowerCase());
  return NextResponse.json({ success: true, payments });
}
