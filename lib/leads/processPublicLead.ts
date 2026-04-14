import { sendLeadEmailResend } from "@/lib/email/sendLeadEmail";
import { payloadToLeadRow } from "@/lib/leads/mapPayload";
import { insertLeadRow } from "@/lib/leads/insertLead";
import { captureException } from "@/lib/observability";
import { isServiceRoleConfigured, isSupabaseConfigured } from "@/lib/supabase/env";
import type { CalculatorLeadBody } from "@/lib/validation/calculatorLeadSchema";

export type ProcessPublicLeadAttachment = { filename: string; content: Buffer };

/**
 * Uloží lead (pokud je nakonfigurovaná DB) a odešle jednu notifikaci přes Resend.
 * Stejné chování jako dříve v POST /api/leads po validaci těla.
 */
export async function processPublicLead(
  body: CalculatorLeadBody,
  opts?: {
    attachment?: ProcessPublicLeadAttachment;
    /** Pro logy Sentry / observability */
    telemetryStep?: string;
  },
): Promise<{ leadId: string | null }> {
  let leadId: string | undefined;
  if (isSupabaseConfigured() && isServiceRoleConfigured()) {
    try {
      const row = payloadToLeadRow(body, { attachmentFilename: opts?.attachment?.filename ?? null });
      const out = await insertLeadRow(row);
      leadId = out.id;
    } catch (e) {
      captureException(e, { step: opts?.telemetryStep ?? "processPublicLead", phase: "insert" });
    }
  }

  await sendLeadEmailResend(body, opts?.attachment, leadId ?? null);
  return { leadId: leadId ?? null };
}
