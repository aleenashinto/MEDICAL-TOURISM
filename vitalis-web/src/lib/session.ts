import { SignJWT, jwtVerify } from 'jose';

const secretKey = process.env.MAIDES_SESSION_SECRET;

function getSecretKey(): Uint8Array {
  if (!secretKey || secretKey.length < 32) {
    throw new Error("MAIDES_SESSION_SECRET environment variable is missing or less than 32 characters long. Please set it in your environment.");
  }
  return new TextEncoder().encode(secretKey);
}

export async function signToken(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(getSecretKey());
}

export async function verifyToken(input: string) {
  try {
    const { payload } = await jwtVerify(input, getSecretKey(), {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    return null;
  }
}
