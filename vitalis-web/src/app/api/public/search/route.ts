import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type') || 'all'; // hospital, doctor, treatment, all

    let results: any = {};

    if (type === 'all' || type === 'hospital') {
      results['hospitals'] = await prisma.hospital.findMany({
        where: {
          isPublished: true,
          name: { contains: query }
        },
        include: {
          treatments: true
        }
      });
    }

    if (type === 'all' || type === 'doctor') {
      results['doctors'] = await prisma.doctor.findMany({
        where: {
          isPublished: true,
          OR: [
            { name: { contains: query } },
            { specialty: { contains: query } }
          ]
        },
        include: {
          hospital: {
            select: { name: true, location: true }
          }
        }
      });
    }

    if (type === 'all' || type === 'treatment') {
      results['treatments'] = await prisma.treatment.findMany({
        where: {
          isPublished: true,
          OR: [
            { name: { contains: query } },
            { specialty: { contains: query } }
          ]
        },
        include: {
          packages: true,
          hospital: {
            select: { name: true, accreditation: true }
          }
        }
      });
    }

    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    console.error("Public Search API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
