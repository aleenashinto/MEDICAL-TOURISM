import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hash } from 'bcryptjs';
import { sendOtpEmail } from '@/lib/email';

export async function POST(request: Request) {
  let firstName: string, lastName: string, email: string, phone: string, country: string, dob: string, gender: string, password: string, agreeTerms: boolean;
  try {
    const body = await request.json();
    
    // Explicitly destructure ONLY the fields we allow. This prevents Mass Assignment.
    ({ firstName, lastName, email, phone, country, dob, gender, password, agreeTerms } = body);

    // 1. Validate required fields
    if (!firstName || !lastName || !email || !password) {
       return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // 2. Strict Email Format Validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, error: "Invalid email format" }, { status: 400 });
    }

    // 3. Password Complexity Validation
    if (password.length < 8) {
      return NextResponse.json({ success: false, error: "Password must be at least 8 characters" }, { status: 400 });
    }

    // 4. Database Duplicate Check
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });
    
    if (existingUser) {
      return NextResponse.json({ success: false, error: "Email is already registered. Please log in." }, { status: 400 });
    }

    // 5. Secure Password Hashing
    const hashedPassword = await hash(password, 10);
    
    // 6. Generate and Hash OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await hash(otpCode, 10);
    const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    // 7. Database Insertion via Prisma Transaction (User + Patient)
    await prisma.$transaction(async (tx: any) => {
      const newUser = await tx.user.create({
        data: {
          email: email.toLowerCase().trim(),
          password: hashedPassword,
          role: 'PATIENT',
          otp: hashedOtp,
          otpExpires: otpExpiresAt,
          isVerified: false,
        }
      });
      
      await tx.patient.create({
        data: {
          userId: newUser.id,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phone: phone?.trim(),
          country: country?.trim(),
          gender: gender?.trim()
        }
      });
    });

    // 8. Dispatch real transactional OTP email
    await sendOtpEmail(email, otpCode);
    console.log(`[SECURE LOG] OTP for ${email}: ${otpCode}`);

    return NextResponse.json({ success: true, message: "Registration successful. Please verify your email." });
  } catch (error: any) {
    console.error("Database connection failed during registration:", error.message);
    return NextResponse.json({ success: false, error: "Server error. Please try again." }, { status: 500 });
  }
}
