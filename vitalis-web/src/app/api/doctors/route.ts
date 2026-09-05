import { NextResponse } from "next/server";
import { verifyToken } from '@/lib/session';
import { cookies } from 'next/headers';

async function verifyAdmin() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('maides_session')?.value;
  if (!sessionCookie) return false;
  const session = await verifyToken(sessionCookie);
  return session && session.role === 'ADMIN';
}

export interface ServerDoctor {
  id: string;
  name: string;
  title: string;
  specialty: string;
  hospital: string;
  hospitalName?: string;
  experienceYears: number;
  education: string;
  certifications?: string;
  consultationFee?: string;
  registrationNumber?: string;
  phone?: string;
  email?: string;
  gender?: string;
  avatar: string;
  casesHandled: number;
  rating: string | number;
  languages: string[];
  department?: string;
  displayOrder: number;
  status: "ACTIVE" | "ON_LEAVE" | "INACTIVE";
  published: "PUBLISHED" | "DRAFT";
  bio: string;
  fullBiography?: string;
  availableDays?: string[];
  district?: string;
  city?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Global server memory store seeded with default doctors
let globalDoctorsStore: ServerDoctor[] = [
  {
    id: "DOC-101",
    name: "Dr. Vijay Anand",
    title: "Senior Consultant & Head of Orthopedics",
    specialty: "Orthopaedics & Joint Replacement",
    hospital: "Aster Medcity, Kochi",
    hospitalName: "Aster Medcity, Kochi",
    district: "Ernakulam",
    city: "Kochi, Kerala",
    experienceYears: 24,
    education: "MBBS, MS (Ortho), MCh (UK), Fellowship Joint Reconstruction",
    certifications: "AAOS International Fellow, AO Spine Member",
    consultationFee: "$60 (₹5,000)",
    registrationNumber: "KMC-39102",
    phone: "+91 484 669 9000",
    email: "vijay.anand@astermedcity.com",
    gender: "Male",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80",
    casesHandled: 1420,
    rating: "4.96",
    languages: ["English", "Hindi", "Malayalam", "Arabic"],
    department: "Center of Orthopaedic Excellence",
    displayOrder: 1,
    status: "ACTIVE",
    published: "PUBLISHED",
    bio: "Pioneer in robotic total knee and hip replacements in South India with over 2,000+ joint surgeries performed for international patients.",
    fullBiography: "Distinguished orthopedic surgeon specializing in MAKO robotic-assisted sub-millimeter joint reconstruction and rapid rehabilitation protocols.",
    availableDays: ["Monday", "Wednesday", "Friday"]
  },
  {
    id: "DOC-102",
    name: "Dr. K. S. Muralidharan",
    title: "Chief of Cardiothoracic & Vascular Surgery",
    specialty: "Cardiology & Cardiac Surgery",
    hospital: "Amrita Institute of Medical Sciences",
    hospitalName: "Amrita Institute of Medical Sciences",
    district: "Ernakulam",
    city: "Kochi, Kerala",
    experienceYears: 28,
    education: "MBBS, MS, MCh (CTVS), FACC, FRCS (Edinburgh)",
    certifications: "FRCS (Edinburgh), Fellow Cardiothoracic Surgery (AIIMS)",
    consultationFee: "$75 (₹6,200)",
    registrationNumber: "KMC-48291",
    phone: "+91 484 285 1234",
    email: "ks.muralidharan@aims.amrita.edu",
    gender: "Male",
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80",
    casesHandled: 2100,
    rating: "4.98",
    languages: ["English", "Hindi", "Tamil", "Malayalam"],
    department: "Institute of Cardiovascular Sciences",
    displayOrder: 2,
    status: "ACTIVE",
    published: "PUBLISHED",
    bio: "Renowned cardiothoracic surgeon specializing in minimally invasive coronary bypass (CABG), valve repairs, and robotic cardiac reconstructions.",
    fullBiography: "Over 28 years of surgical mastery with a 99.4% survival record in complex beating-heart bypass and aortic valve revascularization.",
    availableDays: ["Tuesday", "Thursday", "Saturday"]
  },
  {
    id: "DOC-103",
    name: "Dr. Rajesh K.",
    title: "Lead Neuro & Spine Surgeon",
    specialty: "Neurology & Spine Surgery",
    hospital: "Rajagiri Hospital, Aluva",
    hospitalName: "Rajagiri Hospital, Aluva",
    district: "Ernakulam",
    city: "Kochi, Kerala",
    experienceYears: 19,
    education: "MBBS, MS, MCh (Neurosurgery), FACS (USA)",
    certifications: "WFNS Certified Skull Base Surgeon, AO Spine Member",
    consultationFee: "$65 (₹5,400)",
    registrationNumber: "KMC-55901",
    phone: "+91 484 290 5000",
    email: "rajesh.k@rajagirihospital.com",
    gender: "Male",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80",
    casesHandled: 980,
    rating: "4.90",
    languages: ["English", "Hindi", "Malayalam"],
    department: "Department of Neurosciences & Spine",
    displayOrder: 3,
    status: "ACTIVE",
    published: "PUBLISHED",
    bio: "Expert in endoscopic spinal decompression, microscopic brain tumor resections, and complex spinal fusion procedures with neuronavigation.",
    fullBiography: "Specialized in keyhole neurosurgery, brain tumor resections with intraoperative neuromonitoring, and motion-preserving disc surgeries.",
    availableDays: ["Monday", "Tuesday", "Thursday"]
  },
  {
    id: "DOC-104",
    name: "Dr. Arya Varma",
    title: "Chief Ayurvedic Physician",
    specialty: "Classical Ayurveda & Panchakarma",
    hospital: "Somatheeram Ayurvedic Village",
    hospitalName: "Somatheeram Ayurvedic Village",
    district: "Thiruvananthapuram",
    city: "Kovalam, Kerala",
    experienceYears: 16,
    education: "BAMS, MD (Ayurveda - Kayachikitsa), Traditional Lineage",
    certifications: "Ashtavaidya Lineage Gold Standard, Ayush Certified",
    consultationFee: "$45 (₹3,700)",
    registrationNumber: "KTC-12845",
    phone: "+91 471 226 8101",
    email: "dr.aryavarma@somatheeram.in",
    gender: "Female",
    avatar: "https://images.unsplash.com/photo-1594824813583-b78f4a13d789?auto=format&fit=crop&w=600&q=80",
    casesHandled: 1850,
    rating: "4.92",
    languages: ["English", "Malayalam", "Hindi", "German"],
    department: "Classical Panchakarma & Rasayana Sanctuary",
    displayOrder: 4,
    status: "ACTIVE",
    published: "PUBLISHED",
    bio: "Classical Ayurveda scholar focusing on authentic Panchakarma detoxification, chronic arthritis reversal, and neurological rehabilitation.",
    fullBiography: "Over 16 years leading international wellness retreats for holistic healing, chronic pain management, and Ayurvedic post-operative recovery.",
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
  },
  {
    id: "DOC-105",
    name: "Dr. Deepa Pillai",
    title: "Senior Consultant Medical Oncologist",
    specialty: "Oncology & Cancer Care",
    hospital: "VPS Lakeshore Hospital, Kochi",
    hospitalName: "VPS Lakeshore Hospital, Kochi",
    district: "Ernakulam",
    city: "Kochi, Kerala",
    experienceYears: 21,
    education: "MBBS, MD, DM (Medical Oncology - TMC Mumbai), ESMO Certified",
    certifications: "ESMO Fellow, ASCO Member",
    consultationFee: "$70 (₹5,800)",
    registrationNumber: "KMC-47201",
    phone: "+91 484 270 1011",
    email: "deepa.pillai@lakeshorehospital.com",
    gender: "Female",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80",
    casesHandled: 1640,
    rating: "4.94",
    languages: ["English", "Malayalam", "Hindi", "Tamil"],
    department: "Center for Comprehensive Cancer Care",
    displayOrder: 5,
    status: "ACTIVE",
    published: "PUBLISHED",
    bio: "Leading oncologist in targeted molecular therapy, precision immunotherapy, and organ-preserving multimodal cancer treatment protocols.",
    fullBiography: "Dedicated to international tumor board evaluations, genetic risk profiling, and advanced chemotherapy regimens with compassionate care.",
    availableDays: ["Tuesday", "Thursday", "Saturday"]
  }
];

// GET: Fetch all doctors
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const onlyActivePublished = searchParams.get("public") === "true";

  let result = [...globalDoctorsStore];

  if (onlyActivePublished) {
    result = result.filter(
      (d) => (d.status || "ACTIVE").toUpperCase() === "ACTIVE" && (d.published || "PUBLISHED").toUpperCase() === "PUBLISHED"
    );
  }

  result.sort((a, b) => (Number(a.displayOrder) || 999) - (Number(b.displayOrder) || 999));

  return NextResponse.json({
    success: true,
    total: result.length,
    doctors: result
  });
}

// POST: Create doctor
export async function POST(request: Request) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();

    if (!body.name || !body.name.trim()) {
      return NextResponse.json({ success: false, error: "Doctor name is required." }, { status: 400 });
    }

    const newDoc: ServerDoctor = {
      id: body.id || "DOC-" + Date.now(),
      name: body.name.trim(),
      title: body.title || "Senior Consultant Specialist",
      specialty: body.specialty || "Cardiology & Cardiac Surgery",
      hospital: body.hospital || body.hospitalName || "Aster Medcity, Kochi",
      hospitalName: body.hospitalName || body.hospital || "Aster Medcity, Kochi",
      district: body.district || (body.hospital?.includes("Trivandrum") ? "Thiruvananthapuram" : body.hospital?.includes("Calicut") ? "Kozhikode" : "Ernakulam"),
      city: body.city || "Kochi, Kerala",
      experienceYears: Number(body.experienceYears) || 15,
      education: body.education || "MBBS, MD, Board Certified",
      certifications: body.certifications || "Board Certified",
      consultationFee: body.consultationFee || "$60 (₹5,000)",
      registrationNumber: body.registrationNumber || ("KMC-" + Math.floor(10000 + Math.random() * 90000)),
      phone: body.phone || "+91 484 669 9000",
      email: body.email || "doctor@hospital.org",
      gender: body.gender || "Male",
      avatar: body.avatar || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80",
      casesHandled: Number(body.casesHandled) || 0,
      rating: body.rating || "4.95",
      languages: Array.isArray(body.languages) && body.languages.length > 0 ? body.languages : ["English", "Malayalam"],
      department: body.department || "Clinical Faculty",
      displayOrder: Number(body.displayOrder) || 1,
      status: body.status || "ACTIVE",
      published: body.published || "PUBLISHED",
      bio: body.bio || "Senior medical specialist delivering advanced international patient consultations.",
      fullBiography: body.fullBiography || body.bio || "",
      availableDays: body.availableDays || ["Monday", "Wednesday", "Friday"],
      createdAt: new Date().toISOString()
    };

    globalDoctorsStore = [newDoc, ...globalDoctorsStore.filter(d => d.id !== newDoc.id)];

    return NextResponse.json({
      success: true,
      doctor: newDoc,
      doctors: globalDoctorsStore
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to add doctor" }, { status: 500 });
  }
}

// PUT: Update doctor
export async function PUT(request: Request) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: "Doctor ID is required for update." }, { status: 400 });
    }

    const index = globalDoctorsStore.findIndex(d => d.id === body.id);
    if (index === -1) {
      globalDoctorsStore = [body, ...globalDoctorsStore];
    } else {
      globalDoctorsStore[index] = {
        ...globalDoctorsStore[index],
        ...body,
        updatedAt: new Date().toISOString()
      };
    }

    return NextResponse.json({
      success: true,
      doctor: globalDoctorsStore[index >= 0 ? index : 0],
      doctors: globalDoctorsStore
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to update doctor" }, { status: 500 });
  }
}

// DELETE: Delete doctor
export async function DELETE(request: Request) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Doctor ID required." }, { status: 400 });
    }

    globalDoctorsStore = globalDoctorsStore.filter(d => d.id !== id);

    return NextResponse.json({
      success: true,
      doctors: globalDoctorsStore
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to delete doctor" }, { status: 500 });
  }
}
