import NodeCache from "node-cache";
import AsyncLock from "async-lock";

const cache = new NodeCache({ stdTTL: 300 }); // 5 minutes default TTL
const lock = new AsyncLock();

/**
 * Mutex-locked cache loader.
 * Prevents cache stampede: only one request populates the cache on miss.
 * All other concurrent requests for the same key wait for the first to complete.
 */
export async function getCached<T>(
  key: string,
  loader: () => Promise<T>,
  ttl = 300
): Promise<T> {
  const cached = cache.get<T>(key);
  if (cached !== undefined) return cached;

  return lock.acquire<T>(key, async () => {
    // Double-check inside lock (another request may have already populated it)
    const existing = cache.get<T>(key);
    if (existing !== undefined) return existing;

    const data = await loader();
    cache.set(key, data, ttl);
    return data;
  });
}

/**
 * Manually invalidate a cache key (e.g., after a write mutation).
 */
export function invalidateCache(key: string): void {
  cache.del(key);
}
