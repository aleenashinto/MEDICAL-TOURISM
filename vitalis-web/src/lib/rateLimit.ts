/**
 * Vitalis Rate Limiter
 * Protects auth and sensitive API endpoints against brute force and abuse.
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const memoryStore = new Map<string, RateLimitRecord>();

export async function checkRateLimit(
  key: string,
  maxAttempts: number = 10,
  windowSeconds: number = 900 // 15 minutes default
): Promise<{ success: boolean; remaining: number; resetTimeMs: number }> {
  const now = Date.now();
  const record = memoryStore.get(key);

  if (!record || record.resetTime < now) {
    const resetTimeMs = now + windowSeconds * 1000;
    memoryStore.set(key, { count: 1, resetTime: resetTimeMs });
    return { success: true, remaining: maxAttempts - 1, resetTimeMs };
  }

  if (record.count >= maxAttempts) {
    return { success: false, remaining: 0, resetTimeMs: record.resetTime };
  }

  record.count += 1;
  memoryStore.set(key, record);
  return { success: true, remaining: maxAttempts - record.count, resetTimeMs: record.resetTime };
}
