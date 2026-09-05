import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

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
    
    // Explicitly destructure ONLY the fields we allow. Prevent mass assignment (Phase 8).
    const { token, password } = body;

    if (!token || !password) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ success: false, error: "Password must be at least 8 characters" }, { status: 400 });
    }

    // 1. Consume token (single-use, expires in 15 mins)
    const email = db.resetTokens.consume(token);

    if (!email) {
       // Token is invalid, expired, or already used
       return NextResponse.json({ success: false, error: "Invalid or expired reset token" }, { status: 400 });
    }

    // 2. Hash the new password
    const hashedPassword = await hashPassword(password);

    // 3. Update the user's password in the database
    db.users.updatePassword(email, hashedPassword);

    // 4. Session Invalidation (Phase 10)
    // Since our JWTs are stateless, to truly invalidate old sessions we'd need a token blacklist,
    // or we'd increment a `tokenVersion` field on the user in the database.
    // For this architecture, we instruct the browser to delete the current session cookie.
    // When they log in with the new password, they get a fresh cookie.
    
    const response = NextResponse.json({ success: true, message: "Password updated successfully" });
    
    // Invalidate old session on the client
    response.cookies.set('maides_session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0
    });

    return response;

  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Failed to reset password due to a server error." }, { status: 500 });
  }
}
