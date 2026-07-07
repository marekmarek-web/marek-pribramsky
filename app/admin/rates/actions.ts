"use server";

import { requireEditor } from "@/lib/admin/require-editor";
import { ALLOWED_BANK_IDS } from "@/lib/calculators/mortgage/rates";
import { saveUserVipRates } from "@/lib/vip-rates";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const VALID_BANK_IDS = new Set<string>(ALLOWED_BANK_IDS);

function parseRate(raw: FormDataEntryValue | null): number | null {
  if (raw == null) return null;
  const s = String(raw).trim().replace(",", ".");
  if (!s) return null;
  const n = Number(s);
  if (!Number.isFinite(n) || n <= 0 || n > 30) return null;
  return Math.round(n * 100) / 100;
}

export async function saveVipRatesAction(formData: FormData) {
  const { user } = await requireEditor();
  const productType = formData.get("product_type") === "loan" ? "loan" : "mortgage";

  const rates = ALLOWED_BANK_IDS.flatMap((bankId) => {
    const nominalRate = parseRate(formData.get(`rate_${bankId}`));
    if (nominalRate == null) return [];
    const apr = parseRate(formData.get(`apr_${bankId}`));
    return [{ providerId: bankId, nominalRate, apr: apr ?? undefined }];
  }).filter((r) => VALID_BANK_IDS.has(r.providerId));

  const result = await saveUserVipRates(user.id, productType, rates);
  if (!result.ok) {
    redirect(`/admin/rates?error=${encodeURIComponent(result.error)}`);
  }

  revalidatePath("/hypotecnikalkulacka");
  revalidatePath("/admin/rates");
  redirect(`/admin/rates?saved=1&tab=${productType}`);
}

export async function clearVipRatesAction(formData: FormData) {
  const { user } = await requireEditor();
  const productType = formData.get("product_type") === "loan" ? "loan" : "mortgage";

  const result = await saveUserVipRates(user.id, productType, []);
  if (!result.ok) {
    redirect(`/admin/rates?error=${encodeURIComponent(result.error)}`);
  }

  revalidatePath("/hypotecnikalkulacka");
  revalidatePath("/admin/rates");
  redirect(`/admin/rates?cleared=1&tab=${productType}`);
}
