import type { CalculatorLeadBody } from "@/lib/validation/calculatorLeadSchema";
import type { LeadCategory, LeadSourceType } from "@/lib/leads/domain";
import { normalizeEmail, normalizePhone } from "@/lib/leads/normalize";

/** Mapování legacy `source` z formulářů na CRM source_type + raw_source. */
export function mapSourcePayloadToTypes(
  source: CalculatorLeadBody["source"],
): { sourceType: LeadSourceType; rawSource: string } {
  switch (source) {
    case "calculator":
      return { sourceType: "calculator", rawSource: "calculator" };
    case "footer_quick":
      return { sourceType: "footer", rawSource: "footer_quick" };
    case "homepage_consultation":
      return { sourceType: "homepage", rawSource: "homepage_consultation" };
    case "contact_page":
      return { sourceType: "contact", rawSource: "contact_page" };
    case "article_cta":
      return { sourceType: "article", rawSource: "article_cta" };
    case "career":
      return { sourceType: "career", rawSource: "career" };
    case "newsletter":
      return { sourceType: "newsletter", rawSource: "newsletter" };
    default: {
      const _exhaustive: never = source;
      return { sourceType: "homepage", rawSource: String(_exhaustive) };
    }
  }
}

export function inferLeadCategory(body: CalculatorLeadBody): LeadCategory {
  if (body.calculatorType === "pension") return "pension";
  if (body.calculatorType === "life") return "life";
  if (body.calculatorType === "mortgage") return "mortgage";
  if (body.calculatorType === "investment") return "investment";

  if (body.source === "contact_page") return "consultation";
  if (body.source === "article_cta") return "consultation";
  if (body.source === "career") return "general";
  if (body.source === "newsletter") return "general";

  if (body.topic) {
    const t = body.topic.toLowerCase();
    if (t.includes("invest")) return "investment";
    if (t.includes("hypot")) return "mortgage";
    if (t.includes("smlouv") || t.includes("pojist")) return "insurance";
    if (t.includes("firem")) return "general";
  }

  if (body.interest) {
    const i = body.interest.toLowerCase();
    if (i.includes("invest")) return "investment";
    if (i.includes("hypot")) return "mortgage";
    if (i.includes("pojist")) return "insurance";
    if (i.includes("duchod") || i.includes("penz")) return "pension";
    if (i.includes("realit") || i.includes("reality")) return "real_estate";
  }

  return "general";
}

export type LeadInsertRow = {
  name: string;
  email: string;
  phone: string | null;
  phone_normalized: string | null;
  note: string | null;
  source_type: LeadSourceType;
  raw_source: string;
  source_path: string | null;
  lead_category: LeadCategory;
  calculator_type: string | null;
  life_intent: string | null;
  result_summary: string | null;
  metadata: Record<string, unknown>;
  topic: string | null;
  interest: string | null;
  consent: boolean | null;
  attachment_filename: string | null;
  duplicate_of_id: string | null;
  possible_duplicate: boolean;
  needs_follow_up: boolean;
};

export function payloadToLeadRow(body: CalculatorLeadBody, opts: { attachmentFilename?: string | null }): LeadInsertRow {
  const { sourceType, rawSource } = mapSourcePayloadToTypes(body.source);
  const email = normalizeEmail(body.email ?? "");
  const phone = body.phone?.trim() ? body.phone.trim() : null;
  const phoneNorm = normalizePhone(phone);
  const phoneNormStore = phoneNorm.replace(/\D/g, "").length >= 9 ? phoneNorm : null;

  return {
    name: body.name.trim(),
    email,
    phone,
    phone_normalized: phoneNormStore,
    note: body.note?.trim() || null,
    source_type: sourceType,
    raw_source: rawSource,
    source_path: body.sourcePath?.trim() || null,
    lead_category: inferLeadCategory(body),
    calculator_type: body.calculatorType ?? null,
    life_intent: body.lifeIntent ?? null,
    result_summary: body.resultSummary?.trim() || null,
    metadata: (body.metadata ?? {}) as Record<string, unknown>,
    topic: body.topic?.trim() || null,
    interest: body.interest?.trim() || null,
    consent: body.consent ?? null,
    attachment_filename: opts.attachmentFilename ?? null,
    duplicate_of_id: null,
    possible_duplicate: false,
    needs_follow_up: true,
  };
}
