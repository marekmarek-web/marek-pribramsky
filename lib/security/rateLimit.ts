import { checkUpstashIpRateLimit } from "@/lib/security/rateLimitUpstash";
import {
  createIpRateLimiter as createInMemoryLimiter,
  getClientIp,
  getClientIpFromHeaders,
  type RateLimitResult,
} from "@/lib/security/rateLimitInMemory";

export type { RateLimitResult };
export { getClientIp, getClientIpFromHeaders };

type LimiterOpts = {
  windowMs: number;
  maxPerWindow: number;
  /** Prefix pro Upstash klíč (oddělení endpointů). */
  prefix?: string;
};

/**
 * Rate limit per IP — Upstash Redis (globální) s fallbackem na in-memory per instance.
 */
export function createIpRateLimiter(opts: LimiterOpts) {
  const prefix = opts.prefix ?? "public";
  const memoryCheck = createInMemoryLimiter(opts);

  return async function check(ip: string): Promise<RateLimitResult> {
    const upstash = await checkUpstashIpRateLimit(ip, { ...opts, prefix });
    if (upstash != null) return upstash;
    return memoryCheck(ip);
  };
}
