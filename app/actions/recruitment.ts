"use server";

import { z } from "zod";
import { sendRecruitmentEmailResend } from "@/lib/email/sendRecruitmentEmail";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { isServiceRoleConfigured } from "@/lib/supabase/env";

const wizardAnswersSchema = z
  .record(
    z.string(),
    z.union([z.string(), z.object({ choice: z.string(), other: z.string().optional() })])
  )
  .optional();

const schema = z
  .object({
    name: z.string().trim().min(1, "Jméno je povinné").max(200),
    contact: z.string().trim().min(1, "Kontakt je povinný").max(300),
    message: z.string().trim().max(5000).optional(),
    position: z.string().trim().max(200).optional(),
    cvUrl: z.string().trim().max(2000).optional(),
    wizardAnswers: wizardAnswersSchema,
    consent: z
      .boolean()
      .refine((v) => v === true, { message: "Souhlas se zpracováním údajů je povinný." }),
    pageHref: z.string().max(2000).optional(),
  })
  .superRefine((data, ctx) => {
    const u = data.cvUrl?.trim();
    if (!u) return;
    try {
      const parsedUrl = new URL(u);
      if (!/^https?:$/i.test(parsedUrl.protocol)) {
        throw new Error("not http(s)");
      }
    } catch {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Neplatný odkaz (URL).",
        path: ["cvUrl"],
      });
    }
  });

export type RecruitmentActionResult = { ok: true } | { ok: false; message: string };

/** Rozparsuje řetězec z wizardu `e-mail: …, tel: …` */
function parseWizardContact(contact: string): { email: string; phone: string } {
  const emailM = contact.match(/e-mail:\s*([^,]+)/i);
  const telM = contact.match(/tel:\s*(.+)$/i);
  return {
    email: emailM?.[1]?.trim() ?? "",
    phone: telM?.[1]?.trim() ?? "",
  };
}

export async function submitRecruitmentApplication(input: unknown): Promise<RecruitmentActionResult> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    const first = parsed.error.flatten().fieldErrors;
    const msg = Object.values(first).flat()[0] ?? "Zkontrolujte vyplnění formuláře.";
    return { ok: false, message: msg };
  }

  const hasResend = Boolean(process.env.RESEND_API_KEY?.trim());
  const hasDb = isServiceRoleConfigured();

  if (!hasResend && !hasDb) {
    return {
      ok: false,
      message:
        "Odesílání není na serveru nakonfigurováno. Doplňte RESEND_API_KEY (e-mail) a/nebo Supabase service role (databáze).",
    };
  }

  let emailOk = false;
  let dbOk = false;
  const errors: string[] = [];

  if (hasResend) {
    try {
      const { email, phone } = parseWizardContact(parsed.data.contact);
      await sendRecruitmentEmailResend({
        name: parsed.data.name,
        emailFromContact: email,
        phoneFromContact: phone,
        wizardAnswers: parsed.data.wizardAnswers ?? undefined,
        pageHref: parsed.data.pageHref,
      });
      emailOk = true;
    } catch (e) {
      console.error("[recruitment] Resend:", e);
      errors.push("E-mail se nepodařilo odeslat.");
    }
  }

  if (hasDb) {
    try {
      const admin = createAdminSupabaseClient();
      const payload = {
        name: parsed.data.name,
        contact: parsed.data.contact,
        message: parsed.data.message ?? null,
        position: parsed.data.position ?? null,
        cv_url: parsed.data.cvUrl?.trim() || null,
        wizard_answers: parsed.data.wizardAnswers ?? null,
        consent: true,
        page_url: parsed.data.pageHref ?? null,
      };
      const { error } = await admin.from("job_applications").insert(payload);
      if (error) {
        console.error(error);
        errors.push("Nepodařilo se uložit přihlášku do databáze.");
      } else {
        dbOk = true;
      }
    } catch (e) {
      console.error("[recruitment] Supabase:", e);
      errors.push("Nepodařilo se uložit přihlášku do databáze.");
    }
  }

  if (emailOk || dbOk) {
    return { ok: true };
  }

  return {
    ok: false,
    message: errors.join(" ") || "Odeslání se nezdařilo. Zkuste to prosím znovu.",
  };
}
