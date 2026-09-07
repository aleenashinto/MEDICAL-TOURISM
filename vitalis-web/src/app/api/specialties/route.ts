import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { specialtySchema, validateBody } from '@/lib/validation/schemas';
import { verifyToken } from '@/lib/session';
async function verifyAdmin() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('maides_session')?.value;
  if (!sessionCookie) return false;
  const session = await verifyToken(sessionCookie);
  return session && session.role === 'ADMIN';
}

export interface ServerSpecialty {
  id: string;
  name: string;
  code: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  iconName: string;
  image: string;
  displayOrder: number;
  status: 'ACTIVE' | 'INACTIVE';
  published: 'PUBLISHED' | 'DRAFT';
  hospitals: string[];
  doctors: string[];
  proceduresCount: number;
  keyProcedures: string[];
  accreditations: string[];
  leadDoctor: string;
  seoTitle?: string;
  seoDescription?: string;
}

// We use Prisma directly below

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isPublic = searchParams.get('public') === 'true';

    const whereClause: any = {};
    if (isPublic) {
      whereClause.status = 'ACTIVE';
      whereClause.isPublished = true;
    }

    const specialties = await prisma.specialty.findMany({
      where: whereClause,
      orderBy: { displayOrder: 'asc' },
    });

    const parsedSpecialties = specialties.map(s => ({
      ...s,
      hospitals: s.hospitals ? JSON.parse(s.hospitals) : [],
      doctors: s.doctors ? JSON.parse(s.doctors) : [],
      keyProcedures: s.keyProcedures ? JSON.parse(s.keyProcedures) : [],
      accreditations: s.accreditations ? JSON.parse(s.accreditations) : [],
      published: s.isPublished ? "PUBLISHED" : "DRAFT"
    }));

    return NextResponse.json({
      success: true,
      count: parsedSpecialties.length,
      specialties: parsedSpecialties
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch specialties', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const validation = validateBody(specialtySchema, body);
    
    if (!validation.success) {
      return NextResponse.json({ success: false, error: "Validation failed", errors: validation.errors }, { status: 400 });
    }
    
    const data = validation.data!;
    
    const existing = await prisma.specialty.findFirst({ where: { name: data.name } });
    if (existing) {
      return NextResponse.json({ success: false, error: "Specialty with this name already exists" }, { status: 409 });
    }

    const displayOrder = Number(data.displayOrder);
    let order = 99;
    if (displayOrder) order = displayOrder;
    else {
      const highest = await prisma.specialty.findFirst({
         orderBy: { displayOrder: 'desc' }
      });
      if (highest && highest.displayOrder !== null) order = highest.displayOrder + 1;
      else order = 1;
    }

    const newSpecialty = await prisma.specialty.create({
      data: {
        name: data.name.trim(),
        code: "SPEC-" + Date.now(),
        category: "Interventional & Surgical",
        shortDescription: data.description || `${data.name} center of excellence in Kerala.`,
        fullDescription: data.description || `${data.name} provides advanced clinical care in Kerala.`,
        iconName: data.icon || "HeartPulse",
        image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=800&q=80",
        displayOrder: order,
        status: data.status || "ACTIVE",
        isPublished: true,
        proceduresCount: 10,
        hospitals: JSON.stringify(["Aster Medcity, Kochi"]),
        doctors: JSON.stringify(["Chief Clinical Consultant"]),
        keyProcedures: JSON.stringify(["Standardized Clinical Treatments"]),
        accreditations: JSON.stringify(["NABH Accredited"]),
        leadDoctor: "Chief Clinical Consultant",
        seoTitle: `${data.name} in Kerala - MAIDES Healthcare`,
        seoDescription: `World-class ${data.name} treatments in Kerala accredited hospitals.`
      }
    });

    return NextResponse.json({
      success: true,
      specialty: newSpecialty
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to create specialty" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: "Specialty ID required for update." }, { status: 400 });
    }

    const validation = validateBody(specialtySchema, body);
    if (!validation.success) {
      return NextResponse.json({ success: false, error: "Validation failed", errors: validation.errors }, { status: 400 });
    }

    const updateData: any = { ...validation.data };
    delete updateData.id;
    if (updateData.displayOrder) updateData.displayOrder = Number(updateData.displayOrder);
    if (updateData.proceduresCount) updateData.proceduresCount = Number(updateData.proceduresCount);
    if (updateData.hospitals) updateData.hospitals = JSON.stringify(updateData.hospitals);
    if (updateData.doctors) updateData.doctors = JSON.stringify(updateData.doctors);
    if (updateData.keyProcedures) updateData.keyProcedures = JSON.stringify(updateData.keyProcedures);
    if (updateData.accreditations) updateData.accreditations = JSON.stringify(updateData.accreditations);

    const updated = await prisma.specialty.update({
      where: { id: body.id },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      specialty: updated
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to update specialty" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: "Specialty ID parameter is required." }, { status: 400 });
    }

    await prisma.specialty.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: `Specialty ${id} removed successfully`
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to delete specialty" }, { status: 500 });
  }
}
