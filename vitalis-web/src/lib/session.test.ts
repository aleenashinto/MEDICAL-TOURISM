import { describe, it, expect, beforeEach } from 'vitest';
import { signToken, verifyToken } from './session';

describe('JWT Session Authentication', () => {
  beforeEach(() => {
    process.env.MAIDES_SESSION_SECRET = 'a_very_long_test_session_secret_32_chars_min';
  });

  it('should correctly sign and verify a session token payload', async () => {
    const payload = {
      email: 'patient@example.com',
      role: 'PATIENT',
      name: 'Sarah Jenkins',
    };

    const token = await signToken(payload);
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(20);

    const verified = await verifyToken(token);
    expect(verified).not.toBeNull();
    expect(verified?.email).toBe('patient@example.com');
    expect(verified?.role).toBe('PATIENT');
  });

  it('should return null for tampered or invalid tokens', async () => {
    const tamperedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalidpayload.tamperedSignature';
    const verified = await verifyToken(tamperedToken);
    expect(verified).toBeNull();
  });
});
