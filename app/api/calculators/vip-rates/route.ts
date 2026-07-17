import { NextResponse } from "next/server";
import { getEditorSessionOrNull } from "@/lib/admin/get-editor-session";
import { getUserVipRatesForProduct } from "@/lib/vip-rates";
import { createIpRateLimiter, getClientIp } from "@/lib/security/rateLimit";

export const dynamic = "force-dynamic";

const checkRate = createIpRateLimiter({
  windowMs: 60_000,
  maxPerWindow: 90,
  prefix: "calc-vip-rates",
});

/**
 * Privátní VIP sazby přihlášeného editora.
 * Nikdy nesmí sdílet CDN cache s veřejnými tržními sazbami z kurzy.cz.
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

  const session = await getEditorSessionOrNull();
  if (!session) {
    return NextResponse.json(
      { ok: true, type: productType, vipActive: false, vipOverrides: [] },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  }

  const vipOverrides = await getUserVipRatesForProduct(session.user.id, productType);

  return NextResponse.json(
    {
      ok: true,
      type: productType,
      vipActive: vipOverrides.length > 0,
      vipOverrides,
    },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
