import { Resend } from "resend";
import { inferLeadCategory } from "@/lib/leads/mapPayload";
import type { CalculatorLeadBody } from "@/lib/validation/calculatorLeadSchema";
import { getSiteUrl } from "@/lib/seo/page-meta";

function formatMetadata(metadata: Record<string, string> | undefined): string {
  if (!metadata || Object.keys(metadata).length === 0) return "—";
  return Object.entries(metadata)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
}

export function buildLeadEmailText(
  payload: CalculatorLeadBody,
  receivedAt: string,
  opts?: { leadId?: string | null; adminUrl?: string; adminSubscribersUrl?: string },
): string {
  const base = getSiteUrl();
  const admin = opts?.adminUrl ?? (opts?.leadId ? `${base}/admin/leads/${opts.leadId}` : "—");
  const subscribersAdmin =
    opts?.adminSubscribersUrl ?? (base ? `${base}/admin/subscribers` : "—");
  const lines = [
    payload.source === "newsletter" ? `Nový záznam: odběr novinek (lead + subscribers)` : `Nový lead z webu`,
    `---`,
    `Čas: ${receivedAt}`,
    opts?.leadId ? `ID leadu (DB): ${opts.leadId}` : null,
    `Admin (detail leadu): ${admin}`,
    payload.source === "newsletter" ? `Admin (odběratelé): ${subscribersAdmin}` : null,
    `---`,
    `Zdroj (CRM): ${payload.source}`,
    `Kategorie (odhad): ${inferLeadCategory(payload)}`,
    payload.calculatorType ? `Kalkulačka: ${payload.calculatorType}` : null,
    payload.lifeIntent ? `Typ (životní): ${payload.lifeIntent}` : null,
    payload.interest ? `Zájem / filtr: ${payload.interest}` : null,
    payload.topic ? `Téma: ${payload.topic}` : null,
    `Stránka: ${payload.sourcePath ?? "—"}`,
    `---`,
    `Jméno: ${payload.name}`,
    payload.email?.trim() ? `E-mail: ${payload.email.trim()}` : `E-mail: — (jen telefon)`,
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

export function getLeadEmailSubject(payload: CalculatorLeadBody, leadId?: string | null): string {
  const short = leadId ? ` [${leadId.slice(0, 8)}]` : "";
  if (payload.calculatorType === "pension") return `Lead: Penzijní kalkulačka${short}`;
  if (payload.calculatorType === "life") return `Lead: Životní pojištění (${payload.lifeIntent ?? "obecné"})${short}`;
  if (payload.calculatorType === "mortgage") return `Lead: Hypotéka / úvěr${short}`;
  if (payload.calculatorType === "investment") return `Lead: Investiční kalkulačka${short}`;
  if (payload.source === "footer_quick") return `Lead: Patička (rychlý kontakt)${short}`;
  if (payload.source === "homepage_consultation") return `Lead: Konzultace (úvodní strana)${short}`;
  if (payload.source === "contact_page") return `Lead: Kontaktní stránka${short}`;
  if (payload.source === "article_cta") return `Lead: Článek / blog${short}`;
  if (payload.source === "career") return `Lead: Kariéra / nábor${short}`;
  if (payload.source === "newsletter") return `Lead: Odběr novinek${short}`;
  return `Lead: Web Premium Brokers${short}`;
}

export async function sendLeadEmailResend(
  payload: CalculatorLeadBody,
  attachment?: { filename: string; content: Buffer },
  leadId?: string | null,
): Promise<{ id?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_EMAIL_TO ?? "pribramsky@premiumbrokers.cz";
  const from = process.env.RESEND_FROM ?? "Premium Brokers <onboarding@resend.dev>";

  if (!apiKey) {
    throw new Error("RESEND_NOT_CONFIGURED");
  }

  const resend = new Resend(apiKey);
  const receivedAt = new Date().toISOString();
  const base = getSiteUrl();
  const adminUrl = leadId && base ? `${base}/admin/leads/${leadId}` : undefined;
  const adminSubscribersUrl = base ? `${base}/admin/subscribers` : undefined;
  const text = buildLeadEmailText(payload, receivedAt, {
    leadId: leadId ?? undefined,
    adminUrl,
    adminSubscribersUrl: payload.source === "newsletter" ? adminSubscribersUrl : undefined,
  });
  let textWithFile = text;
  if (attachment) {
    textWithFile += `\n\n---\nPříloha: ${attachment.filename} (${attachment.content.length} B)`;
  }
  const subject = getLeadEmailSubject(payload, leadId);

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
