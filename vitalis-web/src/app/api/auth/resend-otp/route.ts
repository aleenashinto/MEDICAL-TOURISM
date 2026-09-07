import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hash } from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
    }

    const trimmedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: trimmedEmail }
    });

    if (!user) {
      // Prevent email enumeration
      return NextResponse.json({ success: true, message: "If the account exists and is unverified, an OTP has been sent." });
    }

    if (user.isVerified) {
      return NextResponse.json({ success: false, error: "Account is already verified." }, { status: 400 });
    }

    // Generate new OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await hash(otpCode, 10);
    const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    await prisma.user.update({
      where: { id: user.id },
      data: {
        otp: hashedOtp,
        otpExpires: otpExpiresAt,
        otpAttempts: 0,
        otpLockedUntil: null
      }
    });

    console.log(`[SECURE LOG] New OTP for ${trimmedEmail}: ${otpCode}`);

    return NextResponse.json({
      success: true,
      message: "A new OTP has been sent."
    });

  } catch (error: any) {
    console.error("Resend OTP error:", error.message);
    return NextResponse.json({ success: false, error: "Failed to process request due to a server error." }, { status: 500 });
  }
}
