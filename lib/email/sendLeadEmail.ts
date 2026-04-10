import { Resend } from "resend";
import type { CalculatorLeadBody } from "@/lib/validation/calculatorLeadSchema";

function formatMetadata(metadata: Record<string, string> | undefined): string {
  if (!metadata || Object.keys(metadata).length === 0) return "—";
  return Object.entries(metadata)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
}

export function buildLeadEmailText(payload: CalculatorLeadBody, receivedAt: string): string {
  const lines = [
    `Nový lead z webu`,
    `---`,
    `Čas: ${receivedAt}`,
    `Zdroj: ${payload.source}`,
    payload.calculatorType ? `Kalkulačka: ${payload.calculatorType}` : null,
    payload.lifeIntent ? `Typ (životní): ${payload.lifeIntent}` : null,
    payload.interest ? `Zájem: ${payload.interest}` : null,
    payload.topic ? `Téma: ${payload.topic}` : null,
    `Stránka: ${payload.sourcePath ?? "—"}`,
    `---`,
    `Jméno: ${payload.name}`,
    `E-mail: ${payload.email}`,
    payload.phone ? `Telefon: ${payload.phone}` : null,
    payload.consent != null ? `Souhlas GDPR: ${payload.consent ? "ano" : "ne"}` : null,
    `---`,
    `Shrnutí výsledku / kontext:`,
    payload.resultSummary?.trim() || "—",
    `---`,
    `Poznámka:`,
    payload.note?.trim() || "—",
    `---`,
    `Metadata:`,
    formatMetadata(payload.metadata),
  ];
  return lines.filter((x) => x != null).join("\n");
}

export function getLeadEmailSubject(payload: CalculatorLeadBody): string {
  if (payload.calculatorType === "pension") return "Lead: Penzijní kalkulačka";
  if (payload.calculatorType === "life") return `Lead: Životní pojištění (${payload.lifeIntent ?? "obecné"})`;
  if (payload.calculatorType === "mortgage") return "Lead: Hypotéka / úvěr";
  if (payload.calculatorType === "investment") return "Lead: Investiční kalkulačka";
  if (payload.source === "footer_quick") return "Lead: Rychlý kontakt (footer)";
  if (payload.source === "homepage_consultation") return "Lead: Nezávazná konzultace (úvodní strana)";
  if (payload.source === "contact_page") return "Lead: Kontaktní stránka";
  return "Lead: Web Premium Brokers";
}

export async function sendLeadEmailResend(
  payload: CalculatorLeadBody,
  attachment?: { filename: string; content: Buffer },
): Promise<{ id?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_EMAIL_TO ?? "pribramsky@premiumbrokers.cz";
  const from = process.env.RESEND_FROM ?? "Premium Brokers <onboarding@resend.dev>";

  if (!apiKey) {
    throw new Error("RESEND_NOT_CONFIGURED");
  }

  const resend = new Resend(apiKey);
  const receivedAt = new Date().toISOString();
  const text = buildLeadEmailText(payload, receivedAt);
  let textWithFile = text;
  if (attachment) {
    textWithFile += `\n\n---\nPříloha: ${attachment.filename} (${attachment.content.length} B)`;
  }
  const subject = getLeadEmailSubject(payload);

  const { data, error } = await resend.emails.send({
    from,
    to: [to],
    subject,
    text: textWithFile,
    attachments: attachment
      ? [
          {
            filename: attachment.filename,
            content: attachment.content,
          },
        ]
      : undefined,
  });

  if (error) {
    throw new Error(error.message || "Resend error");
  }

  return { id: data?.id };
}
