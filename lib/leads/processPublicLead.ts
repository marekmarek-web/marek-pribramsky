import { sendLeadEmailResend } from "@/lib/email/sendLeadEmail";
import { payloadToLeadRow } from "@/lib/leads/mapPayload";
import { insertLeadRow } from "@/lib/leads/insertLead";
import { captureException } from "@/lib/observability";
import { isServiceRoleConfigured, isSupabaseConfigured } from "@/lib/supabase/env";
import type { CalculatorLeadBody } from "@/lib/validation/calculatorLeadSchema";

export type ProcessPublicLeadAttachment = { filename: string; content: Buffer };

export type ProcessPublicLeadResult = {
  leadId: string | null;
  emailSent: boolean;
};

/**
 * Uloží lead (pokud je nakonfigurovaná DB) a odešle jednu notifikaci přes Resend.
 * Pokud je lead v DB, ale e-mail selže, vrátí úspěch s `emailSent: false` (lead není ztracen).
 */
export async function processPublicLead(
  body: CalculatorLeadBody,
  opts?: {
    attachment?: ProcessPublicLeadAttachment;
    /** Pro logy Sentry / observability */
    telemetryStep?: string;
  },
): Promise<ProcessPublicLeadResult> {
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

  try {
    await sendLeadEmailResend(body, opts?.attachment, leadId ?? null);
    return { leadId: leadId ?? null, emailSent: true };
  } catch (e) {
    if (e instanceof Error && e.message === "RESEND_NOT_CONFIGURED") {
      throw e;
    }
    captureException(e, {
      step: opts?.telemetryStep ?? "processPublicLead",
      phase: "email",
      ...(leadId ? { leadId } : {}),
    });
    if (leadId) {
      return { leadId, emailSent: false };
    }
    throw e;
  }
}
