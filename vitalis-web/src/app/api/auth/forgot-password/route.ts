import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { checkRateLimit } from '@/lib/rateLimit';
import { sendPasswordResetEmail } from '@/lib/email';

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

    // 1. Rate Limit Enforcement (Max 3 requests per hour per email)
    const rateCheck = await checkRateLimit(`forgot-password:${trimmedEmail}`, 3, 3600);
    if (!rateCheck.success) {
      return NextResponse.json({ success: false, error: "Too many password reset requests. Please try again in an hour." }, { status: 429 });
    }

    // 2. Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: trimmedEmail }
    });
    
    if (user) {
      // 3. Generate secure token only if user exists
      const array = new Uint8Array(32);
      crypto.getRandomValues(array);
      const token = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
      
      const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
      
      await prisma.user.update({
        where: { email: trimmedEmail },
        data: {
          otp: token,
          otpExpires: expires
        }
      });
      
      const origin = request.headers.get('origin') || 'http://localhost:3000';
      const resetLink = `${origin}/auth/reset-password?token=${token}`;
      await sendPasswordResetEmail(trimmedEmail, resetLink);
      console.log(`[SECURE LOG] Reset link generated for ${trimmedEmail}: ${resetLink}`);
    }

    // 4. Prevent account enumeration by always returning the exact same generic response
    return NextResponse.json({ 
      success: true, 
      message: "If an account exists, a recovery link has been sent."
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Failed to process request due to a server error." }, { status: 500 });
  }
}
