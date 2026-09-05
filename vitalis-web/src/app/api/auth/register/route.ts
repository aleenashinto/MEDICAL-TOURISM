import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, country, dob, gender, password } = body;

    // Validate inputs
    if (!firstName || !lastName || !email || !password) {
       return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@vitalis.health";
    if (email === ADMIN_EMAIL) {
      return NextResponse.json({ success: false, error: "Email is reserved" }, { status: 400 });
    }

    const existingUser = db.users.find(email);
    if (existingUser) {
      return NextResponse.json({ success: false, error: "Email is already registered. Please log in." }, { status: 400 });
    }

    // Save to our in-memory DB
    db.users.add({
      email,
      password,
      name: `${firstName} ${lastName}`,
      role: 'PATIENT'
    });

    // We do NOT set the session cookie here, because OTP needs to be verified first.
    return NextResponse.json({ success: true, message: "OTP sent" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Registration failed" }, { status: 500 });
  }
}
