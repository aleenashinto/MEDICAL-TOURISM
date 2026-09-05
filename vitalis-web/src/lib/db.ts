// Simple in-memory database for demo purposes.
// In a real application, this would be a real database connection (PostgreSQL, MongoDB, etc.)

// Define a global type so it persists across Next.js hot-reloads in development
declare global {
  var __maides_users: Array<{email: string, password: string, name: string, role: string, isVerified: boolean, otp?: string, otpExpires?: number}> | undefined;
  var __maides_reset_tokens: Map<string, {email: string, expires: number}> | undefined;
}

if (!global.__maides_users) {
  global.__maides_users = [
    {
      email: "sarah.jenkins@example.com",
      password: "Password123", // In a real app, this MUST be hashed
      name: "Sarah Jenkins",
      role: "PATIENT",
      isVerified: true
    }
  ];
}

if (!global.__maides_reset_tokens) {
  global.__maides_reset_tokens = new Map();
}

export const db = {
  users: {
    find: (email: string) => {
      return global.__maides_users?.find(u => u.email.toLowerCase() === email.toLowerCase());
    },
    add: (user: {email: string, password: string, name: string, role: string, isVerified: boolean, otp?: string, otpExpires?: number}) => {
      if (!global.__maides_users) global.__maides_users = [];
      global.__maides_users.push(user);
    },
    updatePassword: (email: string, newPasswordHash: string) => {
       const user = global.__maides_users?.find(u => u.email.toLowerCase() === email.toLowerCase());
       if (user) {
         user.password = newPasswordHash;
       }
    },
    verifyOtp: (email: string, inputOtp: string): boolean => {
       const user = global.__maides_users?.find(u => u.email.toLowerCase() === email.toLowerCase());
       if (!user || !user.otp || !user.otpExpires) return false;
       
       if (Date.now() > user.otpExpires) {
         // OTP expired
         return false;
       }
       
       if (user.otp === inputOtp) {
         user.isVerified = true;
         user.otp = undefined;
         user.otpExpires = undefined;
         return true;
       }
       return false;
    }
  },
  resetTokens: {
    create: (email: string): string => {
      // 1. Cryptographically secure random token
      const array = new Uint8Array(32);
      crypto.getRandomValues(array);
      const token = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
      
      // 2. Token expires in 15 minutes
      const expires = Date.now() + 15 * 60 * 1000;
      global.__maides_reset_tokens?.set(token, { email, expires });
      return token;
    },
    consume: (token: string): string | null => {
      const data = global.__maides_reset_tokens?.get(token);
      if (!data) return null;
      if (Date.now() > data.expires) {
        global.__maides_reset_tokens?.delete(token);
        return null; // expired
      }
      // Single-use token: invalidate it immediately
      global.__maides_reset_tokens?.delete(token);
      return data.email;
    }
  }
};
