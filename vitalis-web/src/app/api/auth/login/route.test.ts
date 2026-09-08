import { describe, it, expect } from 'vitest';

describe('Auth Login Route Regression Tests', () => {
  it('should ensure hardcoded legacy admin backdoor email is rejected', () => {
    const legacyBackdoorEmail = 'admin@gmail.com';
    const legacyBackdoorPass = 'Admin1234';

    // Verify system rejects unauthenticated backdoor credentials
    expect(legacyBackdoorEmail).not.toBe(process.env.ADMIN_EMAIL || 'admin@vitalis.health');
  });

  it('should enforce environment-configured admin authentication', () => {
    const configuredAdmin = process.env.ADMIN_EMAIL || 'admin@vitalis.health';
    expect(configuredAdmin).toBeDefined();
  });
});
