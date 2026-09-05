import { NextResponse } from 'next/server';

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

let globalEnquiriesStore: ServerEnquiry[] = [
  {
    id: "MAIDES-MTNYZU7H",
    name: "ALEENA MATHEW",
    email: "aleenakochumon2@gmail.com",
    phone: "+971 50 821 4590",
    country: "United Arab Emirates",
    language: "English",
    treatment: "Cardiology & Cardiac Surgery",
    specialty: "Cardiology & Cardiac Surgery",
    district: "Ernakulam / Kochi",
    summary: "Patient submitted medical enquiry for specialized clinical consultation and treatment planning in Kerala.",
    budget: "USD 5,000 – 10,000",
    timeline: "ASAP (within 2 weeks)",
    urgency: "HIGH",
    submittedAt: "2026-09-05 11:25",
    status: "NEW",
    assignedHospital: "Amrita Institute of Medical Sciences",
    notes: "Clinical records received. Assigned for rapid cardiologist triage and treatment estimation."
  },
  {
    id: "ENQ-2026-004",
    name: "Sarah Jenkins",
    email: "sarah.jenkins@example.com",
    phone: "+44 7911 123456",
    country: "United Kingdom",
    language: "English",
    treatment: "Minimally Invasive Knee Replacement",
    specialty: "Orthopaedics & Joint Replacement",
    district: "Ernakulam / Kochi",
    summary: "Severe osteoarthritis in right knee, difficulty walking stairs, looking for robotic joint replacement.",
    budget: "$6,500",
    timeline: "ASAP (within 2 weeks)",
    urgency: "HIGH",
    submittedAt: "2026-09-04 09:30",
    status: "NEW",
    assignedHospital: "Aster Medcity, Kochi",
    notes: "Patient has knee cartilage wear and prefers Dr. Vijay Anand."
  },
  {
    id: "ENQ-2026-003",
    name: "Mohammed Al-Maktoum",
    email: "m.maktoum@example.ae",
    phone: "+971 50 987 6543",
    country: "United Arab Emirates",
    language: "Arabic",
    treatment: "Robotic Cardiac Valve Repair",
    specialty: "Cardiology & Cardiac Surgery",
    district: "Ernakulam / Kochi",
    summary: "Severe mitral valve regurgitation diagnosed 2 months ago, requires minimally invasive robotic repair.",
    budget: "$12,000",
    timeline: "1–3 months",
    urgency: "CRITICAL",
    submittedAt: "2026-09-04 07:15",
    status: "TRIAGED",
    assignedHospital: "Amrita Institute of Medical Sciences",
    notes: "Echo scans received, cardiology board review requested."
  },
  {
    id: "ENQ-2026-002",
    name: "Elena Rostova",
    email: "elena.rostova@example.de",
    phone: "+49 170 555 1234",
    country: "Germany",
    language: "English",
    treatment: "Ayurvedic Panchakarma & Stress Detox",
    specialty: "Classical Ayurveda & Panchakarma",
    district: "Thiruvananthapuram",
    summary: "Chronic neck pain, cervical spondylosis, and severe corporate burnout. Looking for 14-day residential Panchakarma.",
    budget: "$4,200",
    timeline: "1–3 months",
    urgency: "MEDIUM",
    submittedAt: "2026-09-03 16:45",
    status: "QUOTED",
    assignedHospital: "Somatheeram Ayurvedic Village",
    notes: "14-day rejuvenation package selected."
  },
  {
    id: "ENQ-2026-001",
    name: "Kwame Mensah",
    email: "kwame.mensah@example.gh",
    phone: "+233 24 123 4567",
    country: "Ghana",
    language: "English",
    treatment: "Oncology Second Opinion & PET-CT",
    specialty: "Oncology & Cancer Care",
    district: "Ernakulam / Kochi",
    summary: "Seeking comprehensive oncologist second opinion, PET-CT fusion scan and targeted biological therapy plan.",
    budget: "$9,500",
    timeline: "ASAP (within 2 weeks)",
    urgency: "HIGH",
    submittedAt: "2026-09-03 11:20",
    status: "CONVERTED",
    assignedHospital: "VPS Lakeshore Hospital",
    notes: "Converted to Case CAS-2026-085."
  }
];

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      count: globalEnquiriesStore.length,
      enquiries: globalEnquiriesStore
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

    if (!body.name || !body.name.trim()) {
      return NextResponse.json({ success: false, error: "Name is required." }, { status: 400 });
    }

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newId = body.id || `ENQ-2026-${String(globalEnquiriesStore.length + 5).padStart(3, '0')}`;

    let assignedHosp = "Aster Medcity, Kochi";
    const spec = (body.specialty || body.treatment || "").toLowerCase();
    if (spec.includes("ayurveda") || (body.district && body.district.includes("Thiruvananthapuram"))) {
      assignedHosp = "Somatheeram Ayurvedic Village, Kovalam";
    } else if (spec.includes("cardio") || spec.includes("neuro")) {
      assignedHosp = "Amrita Institute of Medical Sciences";
    } else if (spec.includes("onco") || spec.includes("gastro")) {
      assignedHosp = "VPS Lakeshore Hospital, Kochi";
    } else if (spec.includes("ortho") || spec.includes("joint")) {
      assignedHosp = "Aster Medcity, Kochi";
    } else if (spec.includes("transplant") || spec.includes("uro")) {
      assignedHosp = "Rajagiri Hospital, Aluva";
    }

    let urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = "MEDIUM";
    const timeline = (body.timeline || "").toLowerCase();
    if (timeline.includes("asap") || timeline.includes("2 weeks") || spec.includes("onco") || spec.includes("cardio")) {
      urgency = "HIGH";
    }

    const newEnquiry: ServerEnquiry = {
      id: newId,
      name: body.name.trim(),
      email: body.email ? body.email.trim() : "patient@medical.travel",
      phone: body.phone ? body.phone.trim() : "+971 50 000 0000",
      country: body.country || "United Arab Emirates",
      language: body.language || "English",
      treatment: body.specialty || body.treatment || "Specialist Clinical Consultation",
      specialty: body.specialty || "General Quaternary Healthcare",
      district: body.district || "Ernakulam / Kochi",
      summary: body.summary || "Patient submitted medical enquiry for treatment coordination in Kerala.",
      budget: body.budget || "USD 5,000 – 10,000",
      timeline: body.timeline || "Flexible",
      urgency: body.urgency || urgency,
      submittedAt: formattedDate,
      status: body.status || "NEW",
      assignedHospital: body.assignedHospital || assignedHosp,
      notes: body.summary ? `Patient Note: ${body.summary}` : "Medical records uploaded. Assigned for lead triage review.",
      documents: Array.isArray(body.documents) ? body.documents : []
    };

    globalEnquiriesStore = [newEnquiry, ...globalEnquiriesStore.filter(e => e.id !== newEnquiry.id)];

    return NextResponse.json({
      success: true,
      enquiry: newEnquiry,
      enquiries: globalEnquiriesStore
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to create enquiry" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: "Enquiry ID required." }, { status: 400 });
    }

    const index = globalEnquiriesStore.findIndex(e => e.id === body.id);
    if (index === -1) {
      globalEnquiriesStore = [body, ...globalEnquiriesStore];
    } else {
      globalEnquiriesStore[index] = { ...globalEnquiriesStore[index], ...body };
    }

    return NextResponse.json({
      success: true,
      enquiry: body,
      enquiries: globalEnquiriesStore
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to update enquiry" }, { status: 500 });
  }
}
