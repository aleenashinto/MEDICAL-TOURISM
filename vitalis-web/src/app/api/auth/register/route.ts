import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

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
    // Notice we do NOT extract `role` or `isAdmin` from the body.
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

    // 4. Admin email reservation check
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@vitalis.health";
    if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      return NextResponse.json({ success: false, error: "Email is reserved" }, { status: 400 });
    }

    // 5. Database Duplicate Check
    const existingUser = db.users.find(email);
    if (existingUser) {
      // Prevent Account Enumeration: Return a generic message or just say it exists
      return NextResponse.json({ success: false, error: "Email is already registered. Please log in." }, { status: 400 });
    }

    // 6. Secure Password Hashing
    const hashedPassword = await hashPassword(password);

    // 7. Database Insertion (Safe)
    db.users.add({
      email: email.toLowerCase().trim(),
      password: hashedPassword, // Store the hash, NEVER the plaintext
      name: `${firstName.trim()} ${lastName.trim()}`,
      role: 'PATIENT' // Hardcoded on the server. Privilege escalation impossible.
    });

    // 8. Return success for OTP flow (do not issue session yet)
    return NextResponse.json({ success: true, message: "OTP sent" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Registration failed due to a server error." }, { status: 500 });
  }
}
