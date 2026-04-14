import { NextResponse } from "next/server";
import { processPublicLead } from "@/lib/leads/processPublicLead";
import { captureException } from "@/lib/observability";
import { jsonValidationError } from "@/lib/security/publicApiJson";
import { createIpRateLimiter, getClientIp } from "@/lib/security/rateLimitInMemory";
import { isServiceRoleConfigured, isSupabaseConfigured } from "@/lib/supabase/env";
import { upsertSubscriberFromBody } from "@/lib/subscribers/insertSubscriber";
import { subscriberBodyToLeadBody } from "@/lib/subscribers/subscriberToLeadBody";
import { subscriberBodySchema } from "@/lib/validation/subscriberSchema";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 15;
const checkRate = createIpRateLimiter({ windowMs: WINDOW_MS, maxPerWindow: MAX_PER_WINDOW });
const MAX_JSON_BYTES = 64 * 1024;

async function persistSubscriber(parsed: ReturnType<typeof subscriberBodySchema.parse>): Promise<string | undefined> {
  if (!isSupabaseConfigured() || !isServiceRoleConfigured()) {
    return undefined;
  }
  try {
    const out = await upsertSubscriberFromBody(parsed);
    return out.id;
  } catch (e) {
    captureException(e, { route: "POST /api/subscribers", step: "insert" });
    return undefined;
  }
}

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const limited = checkRate(ip);
  if (!limited.ok) {
    return NextResponse.json(
      { ok: false, error: "rate_limit" },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } },
    );
  }

  const contentLength = req.headers.get("content-length");
  if (contentLength && Number(contentLength) > MAX_JSON_BYTES) {
    return NextResponse.json({ ok: false, error: "payload_too_large" }, { status: 413 });
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = subscriberBodySchema.safeParse(raw);
  if (!parsed.success) {
    return jsonValidationError(parsed.error);
  }

  const body = parsed.data;
  if (body.companyWebsite) {
    return NextResponse.json({ ok: true, subscriberId: null });
  }
  if (body.formOpenedAt != null && Date.now() - body.formOpenedAt < 1500) {
    return NextResponse.json({ ok: false, error: "too_fast" }, { status: 400 });
  }

  const subscriberId = await persistSubscriber(body);

  try {
    const leadBody = subscriberBodyToLeadBody(body, subscriberId ?? null);
    const { leadId } = await processPublicLead(leadBody, { telemetryStep: "POST /api/subscribers" });
    return NextResponse.json(
      { ok: true, subscriberId: subscriberId ?? null, leadId: leadId ?? null },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (e) {
    if (e instanceof Error && e.message === "RESEND_NOT_CONFIGURED") {
      return NextResponse.json({ ok: false, error: "email_not_configured" }, { status: 503 });
    }
    captureException(e, { route: "POST /api/subscribers", kind: "processPublicLead" });
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 500 });
  }
}
