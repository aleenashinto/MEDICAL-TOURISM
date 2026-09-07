import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { signToken } from '@/lib/session';
import { cookies } from 'next/headers';
import { compare } from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const trimmedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: trimmedEmail },
      include: { patient: true }
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "Account not found." }, { status: 404 });
    }

    // Rate Limiting Check
    if (user.otpLockedUntil && new Date() < user.otpLockedUntil) {
      const waitTime = Math.ceil((user.otpLockedUntil.getTime() - Date.now()) / 60000);
      return NextResponse.json({ success: false, error: `Account locked due to too many failed attempts. Try again in ${waitTime} minutes.` }, { status: 429 });
    }

    if (!user.otp || !user.otpExpires) {
      return NextResponse.json({ success: false, error: "Invalid or expired OTP." }, { status: 401 });
    }

    if (new Date() > user.otpExpires) {
      return NextResponse.json({ success: false, error: "OTP has expired. Please request a new one." }, { status: 401 });
    }

    // Verify OTP Hash
    const isValidOtp = await compare(otp, user.otp);

    if (!isValidOtp) {
      const attempts = user.otpAttempts + 1;
      let lockUntil = null;
      if (attempts >= 5) {
        lockUntil = new Date(Date.now() + 15 * 60 * 1000); // lock for 15 mins
      }
      await prisma.user.update({
        where: { id: user.id },
        data: { 
          otpAttempts: attempts,
          otpLockedUntil: lockUntil
        }
      });
      return NextResponse.json({ success: false, error: "Invalid OTP" }, { status: 401 });
    }

    // Clear OTP upon success
    await prisma.user.update({
      where: { id: user.id },
      data: {
        otp: null,
        otpExpires: null,
        isVerified: true,
        otpAttempts: 0,
        otpLockedUntil: null
      }
    });

    const userName = user.patient ? `${user.patient.firstName} ${user.patient.lastName}`.trim() : "User";
    const userFirstName = user.patient?.firstName || "User";
    const userLastName = user.patient?.lastName || "";

    const sessionPayload = {
      email: user.email,
      name: userName,
      firstName: userFirstName,
      lastName: userLastName,
      role: user.role,
    };
    
    // Issue Session Token immediately
    const token = await signToken(sessionPayload);

    // Set HttpOnly Cookie
    const cookieStore = await cookies();
    cookieStore.set('maides_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return NextResponse.json({
      success: true,
      message: "Email verified successfully.",
      user: sessionPayload
    });

  } catch (error: any) {
    console.error("OTP verification error:", error.message);
    return NextResponse.json({ success: false, error: "Failed to process request due to a server error." }, { status: 500 });
  }
}
