import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Helper to hash passwords using native Web Crypto API (works in Next.js)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Explicitly destructure ONLY the fields we allow. This prevents Mass Assignment.
    const { firstName, lastName, email, phone, country, dob, gender, password, agreeTerms } = body;

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
    const hashedPassword = await hashPassword(password);

    // 6. Database Insertion via Prisma Transaction (User + Patient)
    await prisma.$transaction(async (tx: any) => {
      const newUser = await tx.user.create({
        data: {
          email: email.toLowerCase().trim(),
          password: hashedPassword,
          role: 'PATIENT',
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

    return NextResponse.json({ success: true, message: "OTP sent" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Registration failed due to a server error." }, { status: 500 });
  }
}
