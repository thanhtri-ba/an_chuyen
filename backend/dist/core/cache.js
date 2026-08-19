"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCached = getCached;
exports.invalidateCache = invalidateCache;
const node_cache_1 = __importDefault(require("node-cache"));
const async_lock_1 = __importDefault(require("async-lock"));
const cache = new node_cache_1.default({ stdTTL: 300 }); // 5 minutes default TTL
const lock = new async_lock_1.default();
/**
 * Mutex-locked cache loader.
 * Prevents cache stampede: only one request populates the cache on miss.
 * All other concurrent requests for the same key wait for the first to complete.
 */
async function getCached(key, loader, ttl = 300) {
    const cached = cache.get(key);
    if (cached !== undefined)
        return cached;
    return lock.acquire(key, async () => {
        // Double-check inside lock (another request may have already populated it)
        const existing = cache.get(key);
        if (existing !== undefined)
            return existing;
        const data = await loader();
        cache.set(key, data, ttl);
        return data;
    });
}
/**
 * Manually invalidate a cache key (e.g., after a write mutation).
 */
function invalidateCache(key) {
    cache.del(key);
}
