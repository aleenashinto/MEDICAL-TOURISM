import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { doctorSchema, validateBody } from '@/lib/validation/schemas';
import { verifyToken } from '@/lib/session';
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

// We use Prisma directly below

// GET: Fetch all doctors
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const onlyActivePublished = searchParams.get("public") === "true";

    const whereClause: any = {};
    if (onlyActivePublished) {
      whereClause.status = "ACTIVE";
      whereClause.isPublished = true;
    }

    const doctors = await prisma.doctor.findMany({
      where: whereClause,
      include: { hospital: true },
      orderBy: { displayOrder: 'asc' },
    });

    const parsedDoctors = doctors.map(d => ({
      ...d,
      hospital: d.hospital?.name || "Unknown Hospital",
      hospitalName: d.hospital?.name || "Unknown Hospital",
      experienceYears: d.experience || 0,
      education: d.qualifications || "",
      languages: d.languages ? JSON.parse(d.languages) : [],
      availableDays: d.availableDays ? JSON.parse(d.availableDays) : [],
      published: d.isPublished ? "PUBLISHED" : "DRAFT"
    }));

    return NextResponse.json({
      success: true,
      total: parsedDoctors.length,
      doctors: parsedDoctors
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Create doctor
export async function POST(request: Request) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const validation = validateBody(doctorSchema, body);
    
    if (!validation.success) {
      return NextResponse.json({ success: false, error: "Validation failed", errors: validation.errors }, { status: 400 });
    }
    
    const data = validation.data!;

    let hospitalId = data.hospitalId;
    if (!hospitalId && data.hospital) {
      const h = await prisma.hospital.findFirst({ where: { name: data.hospital } });
      if (h) hospitalId = h.id;
    }

    if (!hospitalId) {
      return NextResponse.json({ success: false, error: "Valid hospital or hospitalId is required." }, { status: 400 });
    }

    const newDoc = await prisma.doctor.create({
      data: {
        hospitalId: hospitalId,
        name: data.name.trim(),
        title: data.title || "Consultant",
        specialty: data.specialty || "General",
        district: data.district || "Ernakulam",
        city: data.city || "Kochi, Kerala",
        experience: Number(data.experienceYears) || 0,
        qualifications: data.education || "",
        consultationFee: data.consultationFee || "",
        registrationNumber: data.registrationNumber || "",
        phone: data.phone || "",
        email: data.email || "",
        gender: data.gender || "Male",
        avatar: data.avatar || "",
        casesHandled: Number(data.casesHandled) || 0,
        rating: Number(data.rating) || 0,
        languages: JSON.stringify(Array.isArray(data.languages) && data.languages.length > 0 ? data.languages : ["English"]),
        department: data.department || "",
        displayOrder: Number(data.displayOrder) || 1,
        status: data.status || "ACTIVE",
        isPublished: data.published === "DRAFT" ? false : true,
        bio: data.bio || "",
        fullBiography: data.fullBiography || data.bio || "",
        availableDays: JSON.stringify(data.availableDays || []),
      }
    });

    return NextResponse.json({
      success: true,
      doctor: newDoc
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

    const validation = validateBody(doctorSchema, body);
    if (!validation.success) {
      return NextResponse.json({ success: false, error: "Validation failed", errors: validation.errors }, { status: 400 });
    }

    const updateData: any = { ...validation.data };
    delete updateData.id;
    if (updateData.published) {
       updateData.isPublished = updateData.published === "PUBLISHED" ? true : false;
       delete updateData.published;
    }
    if (updateData.experienceYears !== undefined) {
       updateData.experience = updateData.experienceYears;
       delete updateData.experienceYears;
    }
    if (updateData.education !== undefined) {
       updateData.qualifications = updateData.education;
       delete updateData.education;
    }
    if (updateData.rating !== undefined) updateData.rating = Number(updateData.rating);
    if (updateData.languages) updateData.languages = JSON.stringify(updateData.languages);
    if (updateData.availableDays) updateData.availableDays = JSON.stringify(updateData.availableDays);
    if (updateData.hospital || updateData.hospitalName) {
       delete updateData.hospital;
       delete updateData.hospitalName;
    }

    const updated = await prisma.doctor.update({
      where: { id: body.id },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      doctor: updated
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

    await prisma.doctor.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to delete doctor" }, { status: 500 });
  }
}
