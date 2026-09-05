import { NextResponse } from 'next/server';
import { signToken } from '@/lib/session';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

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
    const { email, password, role } = body;

    let userRole = role;
    let userName = "";

    // Admin credentials could also be fetched from the DB, but ENV is common
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@vitalis.health";
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "secure_admin_placeholder_change_in_prod";

    if (role === 'ADMIN') {
      if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
        userName = "System Administrator";
      } else {
        return NextResponse.json({ success: false, error: "Invalid administrator credentials." }, { status: 401 });
      }
    } else {
      // Patient Login using Prisma
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() },
        include: { patient: true }
      });
      
      if (!user) {
        return NextResponse.json({ success: false, error: "Account not found. Please register first." }, { status: 404 });
      }

      const inputHash = await hashPassword(password);
      
      if (user.password !== inputHash && user.password !== password) {
        return NextResponse.json({ success: false, error: "Invalid credentials." }, { status: 401 });
      }

      userName = user.patient ? ${user.patient.firstName}  : "Patient";
    }

    const sessionPayload = { email, role: userRole, name: userName };
    const sessionToken = await signToken(sessionPayload);
    
    const cookieStore = await cookies();
    cookieStore.set('maides_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60 // 30 days
    });

    return NextResponse.json({ success: true, user: sessionPayload });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Authentication failed" }, { status: 500 });
  }
}
