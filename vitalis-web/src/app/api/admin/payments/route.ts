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
  const status = searchParams.get('status') || '';

  try {
    const invoices = await prisma.invoice.findMany({
      where: status ? { status } : {},
      include: {
        patient: {
          select: {
            id: true, firstName: true, lastName: true, country: true,
            user: { select: { email: true } }
          }
        },
        payments: true
      },
      orderBy: { createdAt: 'desc' }
    });

    // Compute summary stats
    const totalRevenue = invoices.reduce((sum, inv) => {
      const paid = inv.payments.filter(p => p.status === 'Completed').reduce((s, p) => s + p.amount, 0);
      return sum + paid;
    }, 0);

    const pendingAmount = invoices.reduce((sum, inv) => {
      const paid = inv.payments.filter(p => p.status === 'Completed').reduce((s, p) => s + p.amount, 0);
      return inv.status !== 'Paid' ? sum + (inv.amount - paid) : sum;
    }, 0);

    return NextResponse.json({ success: true, invoices, stats: { totalRevenue, pendingAmount, total: invoices.length } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!(await verifyAdmin())) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id) return NextResponse.json({ success: false, error: 'Invoice ID required' }, { status: 400 });

    const invoice = await prisma.invoice.update({
      where: { id },
      data: { status: status || 'Paid' }
    });

    return NextResponse.json({ success: true, invoice });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
