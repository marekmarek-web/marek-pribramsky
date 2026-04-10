import type { CalculatorLeadBody } from "@/lib/validation/calculatorLeadSchema";

export type PostLeadResult =
  | { ok: true }
  | { ok: false; error: string; message?: string };

export async function postLeadJson(body: CalculatorLeadBody): Promise<PostLeadResult> {
  const res = await fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await res.json().catch(() => ({}))) as PostLeadResult & { error?: string };

  if (res.ok && data && typeof data === "object" && "ok" in data && data.ok === true) {
    return { ok: true };
  }

  const err = typeof data.error === "string" ? data.error : "send_failed";
  return { ok: false, error: err };
}

export async function postLeadFormData(fd: FormData): Promise<PostLeadResult> {
  const res = await fetch("/api/leads", {
    method: "POST",
    body: fd,
  });
  const data = (await res.json().catch(() => ({}))) as PostLeadResult & { error?: string };

  if (res.ok && data && typeof data === "object" && "ok" in data && data.ok === true) {
    return { ok: true };
  }

  const err = typeof data.error === "string" ? data.error : "send_failed";
  return { ok: false, error: err };
}
