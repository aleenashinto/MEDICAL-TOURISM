import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/session';
import { cookies } from 'next/headers';

async function verifyAdmin() {
  const cookieStore = await cookies();
  const session = await verifyToken(cookieStore.get('maides_session')?.value || '');
  return session?.role === 'ADMIN' ? session : null;
}

export async function GET(request: Request) {
  if (!(await verifyAdmin())) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || '';
  const patientId = searchParams.get('patientId') || '';

  try {
    const documents = await prisma.document.findMany({
      where: {
        AND: [
          type ? { documentType: type } : {},
          patientId ? { patientId } : {}
        ]
      },
      include: {
        patient: { select: { id: true, firstName: true, lastName: true, country: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, documents });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!(await verifyAdmin())) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id) return NextResponse.json({ success: false, error: 'Document ID required' }, { status: 400 });

    const document = await prisma.document.update({
      where: { id },
      data: { status: status || 'Approved' }
    });

    return NextResponse.json({ success: true, document });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
