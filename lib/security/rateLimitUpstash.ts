import type { RateLimitResult } from "@/lib/security/rateLimitInMemory";

function isUpstashConfigured(): boolean {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL?.trim() && process.env.UPSTASH_REDIS_REST_TOKEN?.trim(),
  );
}

/**
 * Fixed-window rate limit přes Upstash Redis REST API (globální na serverless).
 * Vrací null, pokud Upstash není nakonfigurovaný — volající použije in-memory fallback.
 */
export async function checkUpstashIpRateLimit(
  ip: string,
  opts: { windowMs: number; maxPerWindow: number; prefix: string },
): Promise<RateLimitResult | null> {
  if (!isUpstashConfigured()) return null;

  const baseUrl = process.env.UPSTASH_REDIS_REST_URL!.replace(/\/$/, "");
  const token = process.env.UPSTASH_REDIS_REST_TOKEN!;
  const windowSec = Math.max(1, Math.ceil(opts.windowMs / 1000));
  const key = `rl:${opts.prefix}:${ip}`;

  try {
    const res = await fetch(`${baseUrl}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify([
        ["INCR", key],
        ["TTL", key],
      ]),
      cache: "no-store",
    });

    if (!res.ok) return null;

    const pipeline = (await res.json()) as { result?: unknown }[];
    const count = Number(pipeline[0]?.result ?? 0);
    const ttl = Number(pipeline[1]?.result ?? -2);

    if (count === 1 || ttl < 0) {
      await fetch(`${baseUrl}/expire/${encodeURIComponent(key)}/${windowSec}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
    }

    if (count > opts.maxPerWindow) {
      const retryAfterSec = ttl > 0 ? ttl : windowSec;
      return { ok: false, retryAfterSec: Math.max(1, retryAfterSec) };
    }

    return { ok: true };
  } catch {
    return null;
  }
}
