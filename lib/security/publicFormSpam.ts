/** Minimální prodleva od otevření formuláře (anti-bot). */
export const DEFAULT_MIN_FORM_MS = 2000;

export type PublicFormSpamInput = {
  companyWebsite?: string | null;
  formOpenedAt?: number | null;
};

export type PublicFormSpamResult =
  | { ok: true }
  | { ok: false; reason: "honeypot" }
  | { ok: false; reason: "too_fast" };

export function isHoneypotFilled(companyWebsite?: string | null): boolean {
  return Boolean(companyWebsite?.trim());
}

export function isFormTooFast(
  formOpenedAt: number | null | undefined,
  minElapsedMs = DEFAULT_MIN_FORM_MS,
): boolean {
  if (formOpenedAt == null || !Number.isFinite(formOpenedAt)) return false;
  return Date.now() - formOpenedAt < minElapsedMs;
}

/** Sjednocená kontrola honeypotu a časovače pro veřejné formuláře. */
export function checkPublicFormSpam(
  input: PublicFormSpamInput,
  opts?: { minElapsedMs?: number },
): PublicFormSpamResult {
  if (isHoneypotFilled(input.companyWebsite)) {
    return { ok: false, reason: "honeypot" };
  }
  if (isFormTooFast(input.formOpenedAt, opts?.minElapsedMs ?? DEFAULT_MIN_FORM_MS)) {
    return { ok: false, reason: "too_fast" };
  }
  return { ok: true };
}
