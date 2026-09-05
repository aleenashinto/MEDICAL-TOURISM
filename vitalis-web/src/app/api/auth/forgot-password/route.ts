import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, error: "Invalid email format" }, { status: 400 });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // 1. Check if user exists
    const user = db.users.find(trimmedEmail);
    
    let token = null;

    if (user) {
      // 2. Generate secure token only if user exists
      token = db.resetTokens.create(trimmedEmail);
      
      // In a real application, you would send the email here using an SMTP service like Resend or SendGrid.
      // e.g. await sendEmail(user.email, `https://medical-tourism.com/auth/reset-password?token=${token}`);
      console.log(`[SECURE LOG] Reset token generated for ${trimmedEmail}: ${token}`);
    }

    // 3. Prevent account enumeration by always returning the exact same generic response
    // regardless of whether the user exists or not.
    // For demo purposes ONLY we will return the token in the response so the user can click it in the UI.
    // IN PRODUCTION: NEVER RETURN THIS TOKEN IN THE API RESPONSE.
    return NextResponse.json({ 
      success: true, 
      message: "If an account exists, a recovery link has been sent.",
      demo_token: token // DEMO ONLY - REMOVE IN PROD
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Failed to process request due to a server error." }, { status: 500 });
  }
}
