"use server";

import { z } from "zod";
import { processPublicLead } from "@/lib/leads/processPublicLead";
import type { CalculatorLeadBody } from "@/lib/validation/calculatorLeadSchema";

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

function careerDataToLeadBody(data: z.infer<typeof schema>): CalculatorLeadBody {
  const { email, phone } = parseWizardContact(data.contact);
  const meta: Record<string, string> = {};
  const cv = data.cvUrl?.trim();
  if (cv) meta.cv_url = cv.slice(0, 2000);
  const pos = data.position?.trim();
  if (pos) meta.position = pos.slice(0, 200);
  if (data.wizardAnswers && Object.keys(data.wizardAnswers).length > 0) {
    let j = JSON.stringify(data.wizardAnswers);
    const max = 12_000;
    if (j.length > max) j = j.slice(0, max) + "…";
    meta.wizard_json = j;
  }

  return {
    source: "career",
    name: data.name.trim(),
    email,
    phone: phone.trim() ? phone.trim() : undefined,
    consent: true,
    sourcePath: data.pageHref?.trim() || undefined,
    resultSummary: "Kariéra — zájem o spolupráci (náborový formulář)",
    note: data.message?.trim() ? data.message.trim().slice(0, 4000) : undefined,
    metadata: Object.keys(meta).length > 0 ? meta : undefined,
  };
}

export async function submitRecruitmentApplication(input: unknown): Promise<RecruitmentActionResult> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    const first = parsed.error.flatten().fieldErrors;
    const msg = Object.values(first).flat()[0] ?? "Zkontrolujte vyplnění formuláře.";
    return { ok: false, message: msg };
  }

  if (!process.env.RESEND_API_KEY?.trim()) {
    return {
      ok: false,
      message:
        "Odesílání není na serveru nakonfigurováno. Doplňte RESEND_API_KEY a RESEND_FROM (Vercel / .env).",
    };
  }

  try {
    await processPublicLead(careerDataToLeadBody(parsed.data), { telemetryStep: "recruitment" });
    return { ok: true };
  } catch (e) {
    console.error("[recruitment] processPublicLead:", e);
    const raw = e instanceof Error ? e.message : String(e);
    let hint = "";
    if (/domain|verify|not valid|validation|from address|sender/i.test(raw)) {
      hint =
        " V Resend ověřte doménu a na Vercelu nastavte RESEND_FROM (odesílatel z té domény). Výchozí onboarding@resend.dev obvykle nepošle na libovolný firemní e-mail.";
    } else if (/api key|unauthorized|invalid api|401/i.test(raw)) {
      hint = " Zkontrolujte RESEND_API_KEY na Vercelu (Production).";
    }
    return {
      ok: false,
      message: `Odeslání se nezdařilo.${hint ? ` ${hint}` : ""}`.trim(),
    };
  }
}
