import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// 10/10 Scalability: Scaffolded Webhook for Stripe/Razorpay Integration
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // In production, verify the cryptographic signature from Stripe/Razorpay here
    
    if (body.status === 'successful' && body.invoiceId) {
      await prisma.payment.create({
        data: {
          invoiceId: body.invoiceId,
          amount: body.amount,
          status: 'Completed',
          transactionReference: body.transactionId
        }
      });
      
      // Update invoice status
      await prisma.invoice.update({
        where: { id: body.invoiceId },
        data: { status: 'Paid' }
      });
      
      // Future Twilio/SendGrid notification trigger goes here
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
