import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rateLimit';
import { signToken } from '@/lib/session';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { compare, hash } from 'bcryptjs';

// Legacy hash function for lazy migration
async function legacyHashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function POST(request: Request) {
  let email, password, role;
  try {
    const body = await request.json();
    email = body.email;
    password = body.password;
    role = body.role;

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password are required" }, { status: 400 });
    }

    const rateCheck = await checkRateLimit(`login:${email.toString().toLowerCase().trim()}`, 10, 900);
    if (!rateCheck.success) {
      return NextResponse.json({ success: false, error: "Too many failed login attempts. Please try again in 15 minutes." }, { status: 429 });
    }

    let userRole = role;
    let userName = "";
    let userFirstName = "";
    let userLastName = "";

    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    if (role === 'ADMIN') {
      if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
        return NextResponse.json({ success: false, error: "Admin credentials not configured on the server." }, { status: 500 });
      }

      const cleanEmail = email?.trim().toLowerCase();
      const cleanPassword = password?.trim();
      
      const matchesEnv = cleanEmail === ADMIN_EMAIL.toLowerCase() && cleanPassword === ADMIN_PASSWORD;

      if (matchesEnv) {
        userFirstName = "System";
        userLastName = "Administrator";
        userName = "System Administrator";
      } else {
        return NextResponse.json({ success: false, error: "Invalid administrator credentials." }, { status: 401 });
      }
    } else {
      const cleanEmail = email?.trim().toLowerCase();
      
      const user = await prisma.user.findUnique({
        where: { email: cleanEmail },
        include: { patient: true }
      });
      
      if (!user) {
        return NextResponse.json({ success: false, error: "Account not found. Please register first." }, { status: 404 });
      }

      // Password Verification with Lazy Migration
      let isValidPassword = false;
      const isBcryptHash = user.password.startsWith('$2a$') || user.password.startsWith('$2b$');

      if (isBcryptHash) {
        isValidPassword = await compare(password, user.password);
      } else {
        // Fallback to legacy SHA-256 or plaintext for migration
        const oldHash = await legacyHashPassword(password);
        if (user.password === oldHash || user.password === password) {
          isValidPassword = true;
          // Lazy migrate to bcrypt
          const newBcryptHash = await hash(password, 10);
          await prisma.user.update({
            where: { id: user.id },
            data: { password: newBcryptHash }
          });
        }
      }
      
      if (!isValidPassword) {
        return NextResponse.json({ success: false, error: "Invalid credentials." }, { status: 401 });
      }

      if (!user.isVerified) {
         // Optionally, you might want to send a new OTP here, or just inform them they need to verify
         return NextResponse.json({ success: false, error: "Account not verified. Please verify your email first.", unverified: true }, { status: 403 });
      }

      userFirstName = user.patient?.firstName || "";
      userLastName = user.patient?.lastName || "";
      userName = user.patient ? `${user.patient.firstName} ${user.patient.lastName}`.trim() : "";
    }

    const sessionPayload = { email, role: userRole, name: userName, firstName: userFirstName, lastName: userLastName };
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
    console.error("Login error:", error.message);
    return NextResponse.json({ success: false, error: "Authentication failed due to a server error." }, { status: 500 });
  }
}


