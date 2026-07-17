import { NextResponse } from "next/server";
import {
  getLoanRates,
  getMortgageRates,
  kurzyRatesEdgeCacheSMaxAgeSeconds,
} from "@/lib/calculators/mortgage/rates";
import { createIpRateLimiter, getClientIp } from "@/lib/security/rateLimit";

export const dynamic = "force-dynamic";

/** Omezí scrape veřejného endpointu (stále best-effort na serverless). */
const checkRate = createIpRateLimiter({
  windowMs: 60_000,
  maxPerWindow: 90,
  prefix: "calc-rates",
});

/**
 * Veřejné tržní sazby (kurzy.cz / static).
 * VIP sazby jsou záměrně oddělené v `/api/calculators/vip-rates` —
 * dříve `public` CDN cache vracela anonymní odpověď bez VIP a přepisovala
 * manuální sazby z nastavení tržními hodnotami z kurzy.cz.
 */
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

  const sMax = kurzyRatesEdgeCacheSMaxAgeSeconds();

  return NextResponse.json(
    {
      ok: true,
      rates,
      type: productType,
      // VIP patří jen do privátního endpointu — nikdy do veřejné CDN cache.
      vipActive: false,
      vipOverrides: [],
    },
    {
      headers: {
        // Pouze tržní sazby — bezpečné pro krátkou edge cache.
        "Cache-Control": `public, max-age=0, s-maxage=${sMax}, stale-while-revalidate=600`,
      },
    },
  );
}
