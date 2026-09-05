import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/session';
import { cookies } from 'next/headers';

async function verifyAuth() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('maides_session')?.value;
  if (!sessionCookie) return false;
  const session = await verifyToken(sessionCookie);
  return !!session;
}

export interface ServerAppointment {
  id: string;
  patient: string;
  patientEmail?: string;
  patientPhone?: string;
  patientCountry?: string;
  caseId: string;
  specialty: string;
  service: string;
  hospital: string;
  doctor: string;
  type: string;
  dateTime: string;
  preferredTime?: string;
  status: string;
  meetLink?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  consultationFeeUsd?: number;
  consultationFeeInr?: number;
}

let globalAppointmentsStore: ServerAppointment[] = [
  {
    id: "APT-2026-101",
    patient: "Sarah Jenkins",
    patientEmail: "sarah.jenkins@example.co.uk",
    patientPhone: "+44 7911 123456",
    patientCountry: "United Kingdom",
    caseId: "CAS-2026-089",
    specialty: "Orthopaedics & Joint Replacement",
    service: "Robotic Total Knee Replacement",
    hospital: "Aster Medcity, Kochi",
    doctor: "Dr. Vijay Anand",
    type: "VIDEO_CONSULTATION",
    dateTime: "2026-09-18 10:00 IST",
    status: "CONFIRMED",
    meetLink: "https://meet.google.com/xyz-ortho-aster",
    notes: "Pre-operative evaluation for right knee replacement.",
    createdAt: "2026-09-04 10:00",
    updatedAt: "2026-09-04 12:00",
    consultationFeeUsd: 60,
    consultationFeeInr: 5000
  },
  {
    id: "APT-2026-102",
    patient: "Mohammed Al-Maktoum",
    patientEmail: "m.maktoum@example.ae",
    patientPhone: "+971 50 987 6543",
    patientCountry: "United Arab Emirates",
    caseId: "CAS-2026-088",
    specialty: "Cardiology & Cardiac Surgery",
    service: "Robotic Cardiac Valve Repair",
    hospital: "Amrita Institute of Medical Sciences",
    doctor: "Dr. K. S. Muralidharan",
    type: "VIDEO_CONSULTATION",
    dateTime: "2026-09-19 14:30 IST",
    status: "SCHEDULED",
    meetLink: "https://meet.google.com/abc-cardio-amrita",
    notes: "Review echo scans and finalize robotic mitral valve repair timeline.",
    createdAt: "2026-09-04 14:00",
    updatedAt: "2026-09-04 15:30",
    consultationFeeUsd: 80,
    consultationFeeInr: 6800
  },
  {
    id: "APT-2026-103",
    patient: "Elena Rostova",
    patientEmail: "elena.rostova@example.de",
    patientPhone: "+49 170 555 1234",
    patientCountry: "Germany",
    caseId: "CAS-2026-087",
    specialty: "Classical Ayurveda & Panchakarma",
    service: "Authentic Panchakarma Clinical Intake",
    hospital: "Somatheeram Ayurvedic Village, Kovalam",
    doctor: "Dr. Arya Varma",
    type: "VIDEO_CONSULTATION",
    dateTime: "2026-09-20 11:00 IST",
    status: "REQUESTED",
    meetLink: "https://meet.google.com/ayur-somatheeram",
    notes: "Initial consultation for 21-day detox program.",
    createdAt: "2026-09-04 16:00",
    updatedAt: "2026-09-04 16:00",
    consultationFeeUsd: 40,
    consultationFeeInr: 3400
  }
];

export async function GET() {
  if (!(await verifyAuth())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    return NextResponse.json({
      success: true,
      count: globalAppointmentsStore.length,
      appointments: globalAppointmentsStore
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch appointments', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  if (!(await verifyAuth())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();

    if (!body.patient || !body.patient.trim()) {
      return NextResponse.json({ success: false, error: "Patient name is required." }, { status: 400 });
    }

    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const newId = body.id || `APT-2026-${Math.floor(100 + Math.random() * 900)}`;

    const newAppt: ServerAppointment = {
      id: newId,
      patient: body.patient.trim(),
      patientEmail: body.patientEmail || "patient@medical.travel",
      patientPhone: body.patientPhone || "+971 50 123 4567",
      patientCountry: body.patientCountry || "International Patient",
      caseId: body.caseId || `CAS-2026-${Math.floor(100 + Math.random() * 900)}`,
      specialty: body.specialty || "Cardiology & Cardiac Surgery",
      service: body.service || "Specialist Clinical Consultation",
      hospital: body.hospital || "Aster Medcity, Kochi",
      doctor: body.doctor || "Chief Medical Consultant",
      type: body.type || "VIDEO_CONSULTATION",
      dateTime: body.dateTime || `${body.date || "2026-09-20"} ${body.time || "10:00 IST"}`,
      preferredTime: body.preferredTime || body.time || "10:00 IST",
      status: body.status || "REQUESTED",
      meetLink: body.meetLink || `https://meet.google.com/maides-${Math.floor(100 + Math.random() * 900)}`,
      notes: body.notes || "Booked from Homepage Appointment Request",
      createdAt: now,
      updatedAt: now,
      consultationFeeUsd: body.consultationFeeUsd || 50,
      consultationFeeInr: body.consultationFeeInr || 4200
    };

    globalAppointmentsStore = [newAppt, ...globalAppointmentsStore.filter(a => a.id !== newAppt.id)];

    return NextResponse.json({
      success: true,
      appointment: newAppt,
      appointments: globalAppointmentsStore
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to create appointment" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!(await verifyAuth())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: "Appointment ID required." }, { status: 400 });
    }

    const index = globalAppointmentsStore.findIndex(a => a.id === body.id);
    if (index === -1) {
      globalAppointmentsStore = [body, ...globalAppointmentsStore];
    } else {
      globalAppointmentsStore[index] = { ...globalAppointmentsStore[index], ...body };
    }

    return NextResponse.json({
      success: true,
      appointment: body,
      appointments: globalAppointmentsStore
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to update appointment" }, { status: 500 });
  }
}
