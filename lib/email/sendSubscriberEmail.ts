import { Resend } from "resend";
import { getSiteUrl } from "@/lib/seo/page-meta";
import type { SubscriberBody } from "@/lib/validation/subscriberSchema";

function formatMetadata(metadata: Record<string, string> | undefined): string {
  if (!metadata || Object.keys(metadata).length === 0) return "—";
  return Object.entries(metadata)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
}

export function buildSubscriberEmailText(
  body: SubscriberBody,
  receivedAt: string,
  opts?: { subscriberId?: string | null; adminUrl?: string },
): string {
  const admin = opts?.adminUrl ?? (opts?.subscriberId ? `${getSiteUrl()}/admin/subscribers` : "—");
  const lines = [
    "Nový odběratel novinek (web)",
    "---",
    `Čas: ${receivedAt}`,
    opts?.subscriberId ? `ID odběratele (DB): ${opts.subscriberId}` : null,
    `Admin (seznam): ${admin}`,
    "---",
    `E-mail: ${body.email.trim()}`,
    body.name?.trim() ? `Jméno: ${body.name.trim()}` : null,
    `Zdroj: ${body.source}`,
    `Segment: ${body.interestSegment ?? "general_updates"}`,
    `Stránka: ${body.sourcePath ?? "—"}`,
    body.relatedLeadId ? `Související lead (ID): ${body.relatedLeadId}` : null,
    `Verze souhlasu: ${body.consentTextVersion ?? "—"}`,
    "---",
    `Metadata:`,
    formatMetadata(body.metadata),
  ];
  return lines.filter((x) => x != null).join("\n");
}

export async function sendSubscriberEmailResend(
  body: SubscriberBody,
  subscriberId?: string | null,
): Promise<{ id?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_EMAIL_TO ?? "pribramsky@premiumbrokers.cz";
  const from = process.env.RESEND_FROM ?? "Premium Brokers <onboarding@resend.dev>";

  if (!apiKey) {
    throw new Error("RESEND_NOT_CONFIGURED");
  }

  const resend = new Resend(apiKey);
  const receivedAt = new Date().toISOString();
  const text = buildSubscriberEmailText(body, receivedAt, { subscriberId: subscriberId ?? undefined });
  const subject = `Odběr novinek: ${body.email.trim().slice(0, 48)}`;

  const { data, error } = await resend.emails.send({
    from,
    to: [to],
    subject,
    text,
  });

  if (error) {
    throw new Error(error.message || "Resend error");
  }

  return { id: data?.id };
}
