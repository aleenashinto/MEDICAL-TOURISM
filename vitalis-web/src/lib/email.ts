/**
 * Vitalis Medical Tourism Platform - Transactional Email Service
 * Handles dispatch of OTPs, password reset links, and patient support notifications.
 */

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions): Promise<{ success: boolean; id?: string }> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn(`[EMAIL WARNING] RESEND_API_KEY is not set in environment. Simulated email dispatch to ${to}: ${subject}`);
    return { success: true, id: `simulated-${Date.now()}` };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Vitalis Health <noreply@vitalis.health>',
        to: [to],
        subject,
        html,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error('[EMAIL ERROR] Resend dispatch failed:', data);
      return { success: false };
    }

    return { success: true, id: data.id };
  } catch (error: any) {
    console.error('[EMAIL ERROR] Exception sending email:', error.message);
    return { success: false };
  }
}

export async function sendOtpEmail(to: string, code: string): Promise<boolean> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 16px;">
      <h2 style="color: #0F172A; text-align: center;">Vitalis Medical Tourism Platform</h2>
      <p>Hello,</p>
      <p>Your verification code for Vitalis account verification is:</p>
      <div style="background-color: #F1F5F9; padding: 16px; text-align: center; border-radius: 8px; font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #0284C7; margin: 20px 0;">
        ${code}
      </div>
      <p>This code is valid for 10 minutes. Please do not share this code with anyone.</p>
      <p style="color: #64748B; font-size: 12px; border-top: 1px solid #E2E8F0; padding-top: 12px;">Vitalis International Patient Desk — Kerala, India</p>
    </div>
  `;
  const res = await sendEmail({ to, subject: `Your Vitalis Verification Code: ${code}`, html });
  return res.success;
}

export async function sendPasswordResetEmail(to: string, resetLink: string): Promise<boolean> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 16px;">
      <h2 style="color: #0F172A; text-align: center;">Vitalis Password Reset Request</h2>
      <p>We received a request to reset your password for your Vitalis Medical Tourism account.</p>
      <p>Please click the button below to set a new password:</p>
      <div style="text-align: center; margin: 24px 0;">
        <a href="${resetLink}" style="background-color: #0284C7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password</a>
      </div>
      <p>If you did not request a password reset, you can safely ignore this email.</p>
      <p style="color: #64748B; font-size: 12px; border-top: 1px solid #E2E8F0; padding-top: 12px;">Vitalis Patient Security Desk</p>
    </div>
  `;
  const res = await sendEmail({ to, subject: 'Reset Your Vitalis Password', html });
  return res.success;
}

export async function sendTicketReplyNotification(to: string, ticketSubject: string): Promise<boolean> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 16px;">
      <h2 style="color: #0F172A; text-align: center;">Update on Support Ticket</h2>
      <p>A new response has been posted by the Vitalis Care Coordinator regarding your support ticket:</p>
      <blockquote style="background-color: #F8FAFC; border-left: 4px solid #0284C7; padding: 12px; font-weight: bold; margin: 16px 0;">
        ${ticketSubject}
      </blockquote>
      <p>Log in to your Vitalis Patient Portal to view the full response and continue the discussion.</p>
      <p style="color: #64748B; font-size: 12px; border-top: 1px solid #E2E8F0; padding-top: 12px;">Vitalis Patient Support Desk</p>
    </div>
  `;
  const res = await sendEmail({ to, subject: `Ticket Update: ${ticketSubject}`, html });
  return res.success;
}
