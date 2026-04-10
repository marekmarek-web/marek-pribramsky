import { NextResponse } from "next/server";
import { calculatorLeadBodySchema } from "@/lib/validation/calculatorLeadSchema";
import { sendLeadEmailResend } from "@/lib/email/sendLeadEmail";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 25;
const buckets = new Map<string, number[]>();

function getClientIp(req: Request): string {
  const xf = req.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0]?.trim() || "unknown";
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}

function rateLimitOk(ip: string): boolean {
  const now = Date.now();
  const arr = (buckets.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  arr.push(now);
  buckets.set(ip, arr);
  return arr.length <= MAX_PER_WINDOW;
}

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
  if (!rateLimitOk(ip)) {
    return NextResponse.json({ ok: false, error: "rate_limit" }, { status: 429 });
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
      const allowed = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
      if (file.type && !allowed.includes(file.type)) {
        return NextResponse.json({ ok: false, error: "file_type" }, { status: 400 });
      }
      const buf = Buffer.from(await file.arrayBuffer());
      attachment = { filename: file.name || "attachment", content: buf };
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
      return NextResponse.json({ ok: false, error: "validation", issues: parsed.error.flatten() }, { status: 400 });
    }

    if (parsed.data.companyWebsite) {
      return NextResponse.json({ ok: true });
    }
    if (parsed.data.formOpenedAt != null && Date.now() - parsed.data.formOpenedAt < 2000) {
      return NextResponse.json({ ok: false, error: "too_fast" }, { status: 400 });
    }

    try {
      await sendLeadEmailResend(parsed.data, attachment);
      return NextResponse.json({ ok: true });
    } catch (e) {
      if (e instanceof Error && e.message === "RESEND_NOT_CONFIGURED") {
        return NextResponse.json({ ok: false, error: "email_not_configured" }, { status: 503 });
      }
      console.error(e);
      return NextResponse.json({ ok: false, error: "send_failed" }, { status: 500 });
    }
  }

  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = calculatorLeadBodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "validation", issues: parsed.error.flatten() }, { status: 400 });
  }

  const body = parsed.data;

  if (body.companyWebsite) {
    return NextResponse.json({ ok: true });
  }
  if (body.formOpenedAt != null && Date.now() - body.formOpenedAt < 2000) {
    return NextResponse.json({ ok: false, error: "too_fast" }, { status: 400 });
  }

  try {
    await sendLeadEmailResend(body);
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof Error && e.message === "RESEND_NOT_CONFIGURED") {
      return NextResponse.json({ ok: false, error: "email_not_configured" }, { status: 503 });
    }
    console.error(e);
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 500 });
  }
}
