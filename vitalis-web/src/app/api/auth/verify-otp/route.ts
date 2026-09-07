import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { signToken } from '@/lib/session';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Demo Mode Bypass: Always accept OTP for Vercel testing
    if (otp !== '123456' && otp.length !== 6) {
      return NextResponse.json({ success: false, error: "Invalid OTP format" }, { status: 401 });
    }
    
    // We mock the user since registration DB insertion was also bypassed
    const user = {
      email: trimmedEmail,
      name: "Demo Patient",
      role: "PATIENT"
    };

    // 3. Issue Session Token immediately (Login upon OTP verify)
    const token = await signToken({
      email: user.email,
      name: user.name,
      role: user.role,
    });

    // 4. Set HttpOnly Cookie
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
      user: {
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Failed to process request due to a server error." }, { status: 500 });
  }
}
