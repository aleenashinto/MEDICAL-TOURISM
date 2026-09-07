import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, error: "Invalid email format" }, { status: 400 });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // 1. Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: trimmedEmail }
    });
    
    if (user) {
      // 2. Generate secure token only if user exists
      const array = new Uint8Array(32);
      crypto.getRandomValues(array);
      const token = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
      
      const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
      
      await prisma.user.update({
        where: { email: trimmedEmail },
        data: {
          otp: token, // We use otp field for the reset token
          otpExpires: expires
        }
      });
      
      // In a real application, you would send the email here using an SMTP service like Resend or SendGrid.
      console.log(`[SECURE LOG] Reset link generated for ${trimmedEmail}: https://medical-tourism.com/auth/reset-password?token=${token}`);
    }

    // 3. Prevent account enumeration by always returning the exact same generic response
    return NextResponse.json({ 
      success: true, 
      message: "If an account exists, a recovery link has been sent."
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Failed to process request due to a server error." }, { status: 500 });
  }
}
