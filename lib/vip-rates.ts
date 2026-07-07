import type { VipRateOverride } from "@/lib/calculators/mortgage/rates";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { isServiceRoleConfigured } from "@/lib/supabase/env";

export type StoredVipRate = {
  product_type: "mortgage" | "loan";
  provider_id: string;
  nominal_rate: number;
  apr: number | null;
};

type DbVipRow = StoredVipRate;

export async function getUserVipRates(userId: string): Promise<
  Array<VipRateOverride & { productType: "mortgage" | "loan" }>
> {
  if (!isServiceRoleConfigured()) return [];

  try {
    const admin = createAdminSupabaseClient();
    const { data, error } = await admin
      .from("mortgage_vip_rates")
      .select("product_type, provider_id, nominal_rate, apr")
      .eq("user_id", userId);

    if (error || !data) return [];

    return (data as DbVipRow[]).map((row) => ({
      providerId: row.provider_id,
      nominalRate: Number(row.nominal_rate),
      apr: row.apr != null ? Number(row.apr) : undefined,
      productType: row.product_type,
    }));
  } catch {
    return [];
  }
}

export async function getUserVipRatesForProduct(
  userId: string,
  productType: "mortgage" | "loan",
): Promise<VipRateOverride[]> {
  const all = await getUserVipRates(userId);
  return all
    .filter((r) => r.productType === productType)
    .map(({ providerId, nominalRate, apr }) => ({ providerId, nominalRate, apr }));
}

export async function saveUserVipRates(
  userId: string,
  productType: "mortgage" | "loan",
  rates: VipRateOverride[],
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isServiceRoleConfigured()) {
    return { ok: false, error: "Supabase není nakonfigurováno." };
  }

  try {
    const admin = createAdminSupabaseClient();

    const { error: deleteError } = await admin
      .from("mortgage_vip_rates")
      .delete()
      .eq("user_id", userId)
      .eq("product_type", productType);

    if (deleteError) return { ok: false, error: deleteError.message };

    const rows = rates
      .filter((r) => Number.isFinite(r.nominalRate) && r.nominalRate > 0)
      .map((r) => ({
        user_id: userId,
        product_type: productType,
        provider_id: r.providerId,
        nominal_rate: r.nominalRate,
        apr: r.apr ?? null,
      }));

    if (rows.length === 0) return { ok: true };

    const { error: insertError } = await admin.from("mortgage_vip_rates").insert(rows);
    if (insertError) return { ok: false, error: insertError.message };

    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Neznámá chyba" };
  }
}

export async function listStoredVipRates(userId: string): Promise<StoredVipRate[]> {
  if (!isServiceRoleConfigured()) return [];

  try {
    const admin = createAdminSupabaseClient();
    const { data } = await admin
      .from("mortgage_vip_rates")
      .select("product_type, provider_id, nominal_rate, apr")
      .eq("user_id", userId)
      .order("provider_id");

    return (data ?? []) as StoredVipRate[];
  } catch {
    return [];
  }
}
