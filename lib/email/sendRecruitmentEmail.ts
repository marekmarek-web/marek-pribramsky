import { Resend } from "resend";

export type RecruitmentWizardAnswerValue = string | { choice: string; other?: string };

function formatAnswerLine(id: string, v: RecruitmentWizardAnswerValue): string {
  if (typeof v === "string") return `${id}: ${v}`;
  const parts = [v.choice];
  if (v.other?.trim()) parts.push(`(${v.other.trim()})`);
  return `${id}: ${parts.join(" ")}`;
}

export function buildRecruitmentEmailText(input: {
  name: string;
  emailFromContact: string;
  phoneFromContact: string;
  wizardAnswers: Record<string, RecruitmentWizardAnswerValue> | undefined;
  pageHref: string | null | undefined;
  receivedAt: string;
}): string {
  const lines = [
    "Nová přihláška / zájem o kariéru (náborový dotazník)",
    "---",
    `Čas: ${input.receivedAt}`,
    `Stránka: ${input.pageHref?.trim() || "—"}`,
    "---",
    `Jméno: ${input.name}`,
    `E-mail: ${input.emailFromContact}`,
    `Telefon: ${input.phoneFromContact}`,
    "---",
    "Odpovědi z dotazníku:",
  ];
  const ans = input.wizardAnswers ?? {};
  const keys = Object.keys(ans).sort();
  if (keys.length === 0) {
    lines.push("(žádné)");
  } else {
    for (const k of keys) {
      lines.push(formatAnswerLine(k, ans[k]!));
    }
  }
  return lines.join("\n");
}

export async function sendRecruitmentEmailResend(input: {
  name: string;
  emailFromContact: string;
  phoneFromContact: string;
  wizardAnswers: Record<string, RecruitmentWizardAnswerValue> | undefined;
  pageHref: string | null | undefined;
}): Promise<{ id?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_EMAIL_TO ?? "pribramsky@premiumbrokers.cz";
  const from = process.env.RESEND_FROM ?? "Premium Brokers <onboarding@resend.dev>";

  if (!apiKey) {
    throw new Error("RESEND_NOT_CONFIGURED");
  }

  const receivedAt = new Date().toISOString();
  const text = buildRecruitmentEmailText({ ...input, receivedAt });
  const resend = new Resend(apiKey);

  const { data, error } = await resend.emails.send({
    from,
    to: [to],
    subject: `Kariéra: nový zájemce — ${input.name.trim()}`,
    text,
  });

  if (error) {
    throw new Error(error.message || "Resend error");
  }

  return { id: data?.id };
}
