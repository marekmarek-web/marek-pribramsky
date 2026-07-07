import { NextResponse } from "next/server";
import {
  getLoanRates,
  getMortgageRates,
  kurzyRatesEdgeCacheSMaxAgeSeconds,
} from "@/lib/calculators/mortgage/rates";
import { getEditorSessionOrNull } from "@/lib/admin/get-editor-session";
import { getUserVipRatesForProduct } from "@/lib/vip-rates";
import { createIpRateLimiter, getClientIp } from "@/lib/security/rateLimit";

export const dynamic = "force-dynamic";

/** Omezí scrape veřejného endpointu (stále best-effort na serverless). */
const checkRate = createIpRateLimiter({
  windowMs: 60_000,
  maxPerWindow: 90,
  prefix: "calc-rates",
});

export async function GET(request: Request) {
  const ip = getClientIp(request);
  const limited = await checkRate(ip);
  if (!limited.ok) {
    return NextResponse.json(
      { ok: false, error: "rate_limit" },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } },
    );
  }

  const url = new URL(request.url);
  const type = url.searchParams.get("type");
  const productType = type === "loan" ? "loan" : "mortgage";

  const rates = productType === "loan" ? await getLoanRates() : await getMortgageRates();

  const session = await getEditorSessionOrNull();
  let vipOverrides: Awaited<ReturnType<typeof getUserVipRatesForProduct>> = [];
  if (session) {
    vipOverrides = await getUserVipRatesForProduct(session.user.id, productType);
  }

  const sMax = kurzyRatesEdgeCacheSMaxAgeSeconds();

  return NextResponse.json(
    {
      ok: true,
      rates,
      type: productType,
      vipActive: vipOverrides.length > 0,
      vipOverrides,
    },
    {
      headers: {
        // Browser revalidates immediately; CDN edge cache stays short vs scrape TTL.
        "Cache-Control": `public, max-age=0, s-maxage=${sMax}, stale-while-revalidate=600`,
      },
    },
  );
}
