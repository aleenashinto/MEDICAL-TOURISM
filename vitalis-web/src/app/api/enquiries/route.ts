import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { enquirySchema, validateBody } from '@/lib/validation/schemas';
import { verifyToken } from '@/lib/session';

// Helper to hash passwords using native Web Crypto API (works in Next.js)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function verifyAdmin() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('maides_session')?.value;
  if (!sessionCookie) return false;
  const session = await verifyToken(sessionCookie);
  return session && session.role === 'ADMIN';
}

export interface ServerEnquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  language?: string;
  treatment: string;
  specialty?: string;
  district?: string;
  summary?: string;
  budget: string;
  timeline?: string;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  submittedAt: string;
  status: 'NEW' | 'TRIAGED' | 'QUOTED' | 'CONVERTED';
  assignedHospital: string;
  notes: string;
  documents?: { name: string; size: number }[];
}

// We use Prisma directly below

export async function GET() {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const enquiries = await prisma.enquiry.findMany({
      include: { hospital: true },
      orderBy: { submittedAt: 'desc' }
    });
    
    const parsedEnquiries = enquiries.map(e => ({
      ...e,
      assignedHospital: e.hospital?.name || "Unassigned"
    }));

    return NextResponse.json({
      success: true,
      count: parsedEnquiries.length,
      enquiries: parsedEnquiries
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch enquiries', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = validateBody(enquirySchema, body);
    
    if (!validation.success) {
      return NextResponse.json({ success: false, error: "Validation failed", errors: validation.errors }, { status: 400 });
    }
    
    const data = validation.data!;

    const email = data.email.trim();
    const name = data.name.trim();

    let user = await prisma.user.findUnique({ where: { email } });
    let patientId = null;

    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-10) + "Aa1@";
      const hashedPassword = await hashPassword(randomPassword);
      user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role: "PATIENT",
        }
      });
      
      const nameParts = name.split(" ");
      const firstName = nameParts[0] || "Unknown";
      const lastName = nameParts.slice(1).join(" ") || "Patient";
      
      const newPatient = await prisma.patient.create({
        data: {
          userId: user.id,
          firstName,
          lastName,
          phone: data.phone.trim(),
          country: data.country || null,
        }
      });
      patientId = newPatient.id;
    } else {
      const existingPatient = await prisma.patient.findUnique({ where: { userId: user.id } });
      if (existingPatient) patientId = existingPatient.id;
    }

    const count = await prisma.enquiry.count();
    const newId = data.id || `ENQ-2026-${String(count + 5).padStart(3, '0')}`;

    let assignedHospId = data.assignedHospitalId || null;
    let assignedHosp = data.assignedHospital || null;

    if (!assignedHospId && !assignedHosp) {
      const spec = (data.specialty || data.treatment || "").toLowerCase();
      if (spec.includes("ayurveda") || ((data as any).district && (data as any).district.includes("Thiruvananthapuram"))) {
        assignedHosp = "Somatheeram Ayurvedic Village, Kovalam";
      } else if (spec.includes("cardio") || spec.includes("neuro")) {
        assignedHosp = "Amrita Institute of Medical Sciences";
      } else if (spec.includes("onco") || spec.includes("gastro")) {
        assignedHosp = "VPS Lakeshore Hospital, Kochi";
      } else if (spec.includes("ortho") || spec.includes("joint")) {
        assignedHosp = "Aster Medcity, Kochi";
      } else if (spec.includes("transplant") || spec.includes("uro")) {
        assignedHosp = "Rajagiri Hospital, Aluva";
      } else {
        assignedHosp = "Aster Medcity, Kochi";
      }
    }

    if (assignedHosp && !assignedHospId) {
      const h = await prisma.hospital.findFirst({ where: { name: { contains: assignedHosp } }});
      if (h) assignedHospId = h.id;
    }

    let urgency = data.urgency || "MEDIUM";
    const timeline = (data.timeline || "").toLowerCase();
    if (!data.urgency) {
      const spec = (data.specialty || data.treatment || "").toLowerCase();
      if (timeline.includes("asap") || timeline.includes("2 weeks") || spec.includes("onco") || spec.includes("cardio")) {
        urgency = "HIGH";
      }
    }

    const newEnquiry = await prisma.enquiry.create({
      data: {
        id: newId,
        patientId,
        name,
        email,
        phone: data.phone.trim(),
        country: data.country || "Unknown",
        treatment: data.treatment,
        specialty: data.specialty || "General",
        budget: data.budget || "Not Specified",
        timeline: data.timeline || "Flexible",
        urgency: urgency,
        status: data.status || "NEW",
        assignedHospitalId: assignedHospId,
        notes: data.summary ? `Patient Note: ${data.summary}` : (data.notes || "Assigned for lead triage review."),
      }
    });

    return NextResponse.json({
      success: true,
      enquiry: newEnquiry
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to create enquiry" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: "Enquiry ID required." }, { status: 400 });
    }

    const validation = validateBody(enquirySchema, body);
    if (!validation.success) {
      return NextResponse.json({ success: false, error: "Validation failed", errors: validation.errors }, { status: 400 });
    }

    const updateData: any = { ...validation.data };
    delete updateData.id;
    
    if (updateData.assignedHospital) {
      const h = await prisma.hospital.findFirst({ where: { name: { contains: updateData.assignedHospital } }});
      if (h) updateData.assignedHospitalId = h.id;
      delete updateData.assignedHospital;
    }

    const updated = await prisma.enquiry.update({
      where: { id: body.id },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      enquiry: updated
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to update enquiry" }, { status: 500 });
  }
}
