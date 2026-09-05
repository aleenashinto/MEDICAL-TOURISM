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

    // 1. Check if user exists
    const user = db.users.find(trimmedEmail);
    if (!user) {
      return NextResponse.json({ success: false, error: "Account not found" }, { status: 404 });
    }

    // 2. Verify OTP
    const isValid = db.users.verifyOtp(trimmedEmail, otp);
    
    if (!isValid) {
      return NextResponse.json({ success: false, error: "Invalid or expired OTP" }, { status: 401 });
    }

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
