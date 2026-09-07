import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { hospitalSchema, validateBody } from '@/lib/validation/schemas';
import { verifyToken } from '@/lib/session';
async function verifyAdmin() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('maides_session')?.value;
  if (!sessionCookie) return false;
  const session = await verifyToken(sessionCookie);
  return session && session.role === 'ADMIN';
}

export interface ServerHospital {
  id: string;
  name: string;
  tagline: string;
  shortDescription: string;
  fullDescription: string;
  image: string;
  galleryImages: string[];
  address: string;
  city: string;
  district: string;
  region: "South Kerala" | "Central Kerala" | "North Kerala";
  state: string;
  country: string;
  postalCode: string;
  phone: string;
  email: string;
  website: string;
  emergencyPhone: string;
  beds: string;
  establishedYear: number;
  internationalPatientsAnnual: number;
  nearestAirport: string;
  airportDistanceKm: number;
  accreditations: string[];
  specialties: string[];
  doctors: string[];
  facilities: string[];
  internationalServices: string[];
  languages: string[];
  vipRoomsAvailable: boolean;
  ayurvedaWingAvailable: boolean;
  rating: number;
  reviewCount: number;
  displayOrder: number;
  status: "ACTIVE" | "INACTIVE";
  published: "PUBLISHED" | "DRAFT";
  casesActive: number;
  createdAt?: string;
  updatedAt?: string;
}

// We use Prisma directly below

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const onlyActivePublished = searchParams.get("public") === "true";

    const whereClause: any = {};
    if (onlyActivePublished) {
      whereClause.status = "ACTIVE";
      whereClause.isPublished = true;
    }

    const hospitals = await prisma.hospital.findMany({
      where: whereClause,
      orderBy: { displayOrder: 'asc' },
    });

    const parsedHospitals = hospitals.map(h => ({
      ...h,
      galleryImages: h.galleryImages ? JSON.parse(h.galleryImages) : [],
      accreditations: h.accreditations ? JSON.parse(h.accreditations) : [],
      facilities: h.facilities ? JSON.parse(h.facilities) : [],
      internationalServices: h.internationalServices ? JSON.parse(h.internationalServices) : [],
      languages: h.languages ? JSON.parse(h.languages) : [],
      published: h.isPublished ? "PUBLISHED" : "DRAFT"
    }));

    return NextResponse.json({
      success: true,
      total: parsedHospitals.length,
      hospitals: parsedHospitals
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const validation = validateBody(hospitalSchema, body);
    
    if (!validation.success) {
      return NextResponse.json({ success: false, error: "Validation failed", errors: validation.errors }, { status: 400 });
    }
    
    const data = validation.data!;

    const newHosp = await prisma.hospital.create({
      data: {
        name: data.name.trim(),
        tagline: data.description || "Accredited Quaternary Healthcare Institution",
        shortDescription: data.description || "Leading hospital destination.",
        fullDescription: data.description || "",
        image: data.image || "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80",
        galleryImages: JSON.stringify([data.image || "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=600"]),
        address: data.location || "Kerala, India",
        city: data.location.split(',')[0] || "Kochi",
        district: "Ernakulam",
        region: "Central Kerala",
        state: "Kerala",
        country: "India",
        postalCode: "682001",
        phone: data.contactPhone || "+91 484 669 9000",
        email: data.contactEmail || "international@hospital.org",
        website: "https://keralamedical.gov.in",
        emergencyPhone: "+91 484 669 9999",
        beds: data.beds ? `${data.beds} Beds` : "500 Beds",
        establishedYear: Number(data.established) || 2015,
        internationalPatientsAnnual: 15000,
        nearestAirport: "Cochin International Airport (COK)",
        airportDistanceKm: 20,
        accreditations: JSON.stringify(data.accreditation ? [data.accreditation] : ["NABH Certified", "JCI Accredited"]),
        facilities: JSON.stringify(["Advanced Robotic Surgery Suite", "24/7 International Desk"]),
        internationalServices: JSON.stringify(["24/7 International Desk", "Airport Chauffeur", "eVisa Assistance"]),
        languages: JSON.stringify(["English", "Arabic", "Malayalam", "Hindi"]),
        vipRoomsAvailable: true,
        ayurvedaWingAvailable: true,
        rating: Number(data.rating) || 4.92,
        reviewCount: 1200,
        displayOrder: 1,
        status: data.status || "ACTIVE",
        isPublished: true,
        casesActive: 10,
      }
    });

    return NextResponse.json({
      success: true,
      hospital: newHosp
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to create hospital" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: "Hospital ID required for update." }, { status: 400 });
    }

    const validation = validateBody(hospitalSchema, body);
    if (!validation.success) {
      return NextResponse.json({ success: false, error: "Validation failed", errors: validation.errors }, { status: 400 });
    }

    const updateData: any = { ...validation.data };
    delete updateData.id;
    if (updateData.galleryImages) updateData.galleryImages = JSON.stringify(updateData.galleryImages);
    if (updateData.accreditations) updateData.accreditations = JSON.stringify(updateData.accreditations);
    if (updateData.facilities) updateData.facilities = JSON.stringify(updateData.facilities);
    if (updateData.internationalServices) updateData.internationalServices = JSON.stringify(updateData.internationalServices);
    if (updateData.languages) updateData.languages = JSON.stringify(updateData.languages);

    const updated = await prisma.hospital.update({
      where: { id: body.id },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      hospital: updated
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to update hospital" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Hospital ID required." }, { status: 400 });
    }

    await prisma.hospital.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to delete hospital" }, { status: 500 });
  }
}