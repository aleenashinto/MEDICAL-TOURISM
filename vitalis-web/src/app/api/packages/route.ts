import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { packageSchema, validateBody } from '@/lib/validation/schemas';
import { verifyToken } from '@/lib/session';

async function verifyAdmin() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('maides_session')?.value;
  if (!sessionCookie) return false;
  const session = await verifyToken(sessionCookie);
  return session && session.role === 'ADMIN';
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isPublic = searchParams.get('public') === 'true';

    const whereClause: any = {};
    if (isPublic) {
      whereClause.isPublished = true;
    }

    const packages = await prisma.package.findMany({
      where: whereClause,
      include: {
        hospital: true,
        treatment: true,
      }
    });

    return NextResponse.json({
      success: true,
      packages
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch packages', error: error.message },
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
    const validation = validateBody(packageSchema, body);
    
    if (!validation.success) {
      return NextResponse.json({ success: false, error: "Validation failed", errors: validation.errors }, { status: 400 });
    }
    
    const data = validation.data!;

    const newPackage = await prisma.package.create({
      data: {
        name: data.name,
        treatmentId: data.treatmentId,
        hospitalId: data.hospitalId,
        costRange: data.costRange,
        duration: data.durationDays ? `${data.durationDays} Days` : "7 Days",
        inclusions: data.inclusions ? JSON.stringify(data.inclusions) : "",
        isPublished: data.status === "ACTIVE",
      }
    });

    return NextResponse.json({
      success: true,
      package: newPackage,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to create package" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: "Package ID required for update." }, { status: 400 });
    }

    const validation = validateBody(packageSchema, body);
    if (!validation.success) {
      return NextResponse.json({ success: false, error: "Validation failed", errors: validation.errors }, { status: 400 });
    }

    const updateData: any = { ...validation.data };
    delete updateData.id;
    if (updateData.durationDays !== undefined) {
      updateData.duration = `${updateData.durationDays} Days`;
      delete updateData.durationDays;
    }
    if (updateData.inclusions !== undefined) {
      updateData.inclusions = JSON.stringify(updateData.inclusions);
    }
    if (updateData.exclusions !== undefined) {
      delete updateData.exclusions; // not in model
    }
    if (updateData.status !== undefined) {
      updateData.isPublished = updateData.status === "ACTIVE";
      delete updateData.status;
    }

    const updated = await prisma.package.update({
      where: { id: body.id },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      package: updated
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to update package" }, { status: 500 });
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
      return NextResponse.json({ success: false, error: "Package ID parameter is required." }, { status: 400 });
    }

    await prisma.package.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: `Package ${id} removed successfully`
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to delete package" }, { status: 500 });
  }
}
