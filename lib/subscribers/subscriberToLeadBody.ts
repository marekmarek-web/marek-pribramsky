import type { CalculatorLeadBody } from "@/lib/validation/calculatorLeadSchema";
import type { SubscriberBody } from "@/lib/validation/subscriberSchema";

/** Jednotný lead pro CRM + stejný Resend e-mail jako ostatní formuláře. */
export function subscriberBodyToLeadBody(
  body: SubscriberBody,
  subscriberId: string | null,
): CalculatorLeadBody {
  const meta: Record<string, string> = { ...(body.metadata ?? {}) };
  meta.subscriber_segment = body.interestSegment;
  meta.subscriber_source = body.source;
  if (body.consentTextVersion) meta.consent_text_version = body.consentTextVersion;
  if (subscriberId) meta.subscriber_id = subscriberId;
  if (body.relatedLeadId) meta.related_lead_id = body.relatedLeadId;

  return {
    source: "newsletter",
    name: body.name?.trim() || "Odběratel novinek",
    email: body.email.trim(),
    consent: body.consentMarketing,
    sourcePath: body.sourcePath,
    resultSummary: `Odběr novinek — ${body.interestSegment} (${body.source})`,
    metadata: meta,
    formOpenedAt: body.formOpenedAt,
  };
}
