import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";
import type { AuthTokenPayload, UserRole } from "@maides/types";

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(
  payload: { sub: string; email: string; role: UserRole },
  secret: string,
  expiresIn: string = "7d"
): string {
  return jwt.sign(payload, secret, { expiresIn } as SignOptions);
}

export function verifyToken(token: string, secret: string): AuthTokenPayload {
  return jwt.verify(token, secret) as AuthTokenPayload;
}
