import { SignJWT, jwtVerify } from 'jose';

const DEFAULT_SECRET = 'vitalis_secure_session_secret_key_32_chars_minimum_length';

function getSecretKey(): Uint8Array {
  const secret = process.env.MAIDES_SESSION_SECRET || DEFAULT_SECRET;
  const keyToUse = secret.length >= 32 ? secret : DEFAULT_SECRET;
  return new TextEncoder().encode(keyToUse);
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
