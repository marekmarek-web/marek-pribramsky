import { NextResponse } from "next/server";
import { processPublicLead } from "@/lib/leads/processPublicLead";
import { captureException } from "@/lib/observability";
import { jsonValidationError } from "@/lib/security/publicApiJson";
import { createIpRateLimiter, getClientIp } from "@/lib/security/rateLimitInMemory";
import { isAllowedPublicAttachment, sanitizeUploadFilename } from "@/lib/security/uploadFilename";
import {
  type CalculatorLeadBody,
  calculatorLeadBodySchema,
} from "@/lib/validation/calculatorLeadSchema";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 20;
const checkRate = createIpRateLimiter({ windowMs: WINDOW_MS, maxPerWindow: MAX_PER_WINDOW });
/** Ochrana proti obřím JSON payloadům (DoS). */
const MAX_JSON_BYTES = 512 * 1024;

function parseMetadata(raw: string | null): Record<string, string> | undefined {
  if (!raw?.trim()) return undefined;
  try {
    const o = JSON.parse(raw) as unknown;
    if (o && typeof o === "object" && !Array.isArray(o)) {
      const out: Record<string, string> = {};
      for (const [k, v] of Object.entries(o)) {
        if (typeof v === "string") out[k] = v;
        else out[k] = String(v);
      }
      return out;
    }
  } catch {
    /* ignore */
  }
  return undefined;
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

  const contentType = req.headers.get("content-type") ?? "";

  let raw: unknown;

  if (contentType.includes("multipart/form-data")) {
    const fd = await req.formData();
    const file = fd.get("attachment");
    let attachment:
      | {
          filename: string;
          content: Buffer;
        }
      | undefined;

    if (file instanceof File && file.size > 0) {
      if (file.size > 3_500_000) {
        return NextResponse.json({ ok: false, error: "file_too_large" }, { status: 400 });
      }
      const rawName = file.name || "attachment";
      const safeName = sanitizeUploadFilename(rawName);
      if (!isAllowedPublicAttachment(file, safeName)) {
        return NextResponse.json({ ok: false, error: "file_type" }, { status: 400 });
      }
      const buf = Buffer.from(await file.arrayBuffer());
      attachment = { filename: safeName, content: buf };
    }

    const metaRaw = fd.get("metadataJson");
    raw = {
      source: String(fd.get("source") ?? "calculator"),
      calculatorType: fd.get("calculatorType") != null ? String(fd.get("calculatorType")) : undefined,
      lifeIntent: fd.get("lifeIntent") != null ? String(fd.get("lifeIntent")) : undefined,
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: fd.get("phone") != null && String(fd.get("phone")).trim() ? String(fd.get("phone")) : undefined,
      note: fd.get("note") != null ? String(fd.get("note")) : undefined,
      sourcePath: fd.get("sourcePath") != null ? String(fd.get("sourcePath")) : undefined,
      resultSummary: fd.get("resultSummary") != null ? String(fd.get("resultSummary")) : undefined,
      metadata: parseMetadata(typeof metaRaw === "string" ? metaRaw : null),
      companyWebsite: fd.get("companyWebsite") != null ? String(fd.get("companyWebsite")) : undefined,
      formOpenedAt:
        fd.get("formOpenedAt") != null && String(fd.get("formOpenedAt")).length > 0
          ? Number(fd.get("formOpenedAt"))
          : undefined,
    };

    const parsed = calculatorLeadBodySchema.safeParse(raw);
    if (!parsed.success) {
      return jsonValidationError(parsed.error);
    }

    if (parsed.data.companyWebsite) {
      return NextResponse.json({ ok: true });
    }
    if (parsed.data.formOpenedAt != null && Date.now() - parsed.data.formOpenedAt < 2000) {
      return NextResponse.json({ ok: false, error: "too_fast" }, { status: 400 });
    }

    try {
      const { leadId } = await processPublicLead(parsed.data, {
        attachment,
        telemetryStep: "POST /api/leads multipart",
      });
      return NextResponse.json(
        { ok: true, leadId: leadId ?? null },
        { headers: { "Cache-Control": "no-store" } },
      );
    } catch (e) {
      if (e instanceof Error && e.message === "RESEND_NOT_CONFIGURED") {
        return NextResponse.json({ ok: false, error: "email_not_configured" }, { status: 503 });
      }
      captureException(e, { route: "POST /api/leads", kind: "multipart" });
      return NextResponse.json({ ok: false, error: "send_failed" }, { status: 500 });
    }
  }

  const contentLength = req.headers.get("content-length");
  if (contentLength && Number(contentLength) > MAX_JSON_BYTES) {
    return NextResponse.json({ ok: false, error: "payload_too_large" }, { status: 413 });
  }

  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = calculatorLeadBodySchema.safeParse(raw);
  if (!parsed.success) {
    return jsonValidationError(parsed.error);
  }

  const body: CalculatorLeadBody = parsed.data;

  if (body.companyWebsite) {
    return NextResponse.json({ ok: true });
  }
  if (body.formOpenedAt != null && Date.now() - body.formOpenedAt < 2000) {
    return NextResponse.json({ ok: false, error: "too_fast" }, { status: 400 });
  }

  try {
    const { leadId } = await processPublicLead(body, { telemetryStep: "POST /api/leads json" });
    return NextResponse.json(
      { ok: true, leadId: leadId ?? null },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (e) {
    if (e instanceof Error && e.message === "RESEND_NOT_CONFIGURED") {
      return NextResponse.json({ ok: false, error: "email_not_configured" }, { status: 503 });
    }
    captureException(e, { route: "POST /api/leads", kind: "json" });
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 500 });
  }
}
