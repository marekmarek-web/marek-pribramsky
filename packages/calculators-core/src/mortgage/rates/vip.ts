import { BANKS_DATA } from "../mortgage.config";
import type { BankEntry } from "../mortgage.types";
import { ALLOWED_BANK_IDS, CANONICAL_BANK_META, detectCanonicalBankId } from "./matching";
import type { NormalizedOffer } from "./types";

export interface VipRateOverride {
  providerId: string;
  nominalRate: number;
  apr?: number;
  /** ISO datum (YYYY-MM-DD); null/undefined = bez expirace */
  validUntil?: string | null;
}

/** Je VIP override stále platný? (validUntil včetně daného dne) */
export function isVipOverrideActive(
  validUntil: string | null | undefined,
  now = new Date(),
): boolean {
  if (!validUntil) return true;
  const end = new Date(`${validUntil}T23:59:59.999`);
  if (Number.isNaN(end.getTime())) return true;
  return now <= end;
}

export function filterActiveVipOverrides(
  overrides: VipRateOverride[],
  now = new Date(),
): VipRateOverride[] {
  return overrides.filter((o) => isVipOverrideActive(o.validUntil, now));
}

/** Nejlepší tržní sazba (kurzy/static) pro každou banku v seznamu nabídek. */
export function bestMarketRateByBank(
  rankedOffers: NormalizedOffer[],
  productType: "mortgage" | "loan",
): Map<string, number> {
  const result = new Map<string, number>();
  for (const offer of rankedOffers) {
    if (offer.productType !== productType) continue;
    const canonicalId = detectCanonicalBankId(offer.providerId, offer.providerName);
    if (!canonicalId) continue;
    const existing = result.get(canonicalId);
    if (existing == null || offer.nominalRate < existing) {
      result.set(canonicalId, offer.nominalRate);
    }
  }
  return result;
}

/** Sloučí manuální VIP sazby do bank entries; aktivní override má přednost před trhem. */
export function applyVipOverridesToBankEntries(
  entries: BankEntry[],
  overrides: VipRateOverride[],
  marketRatesByBank: Map<string, number>,
  productType: "mortgage" | "loan",
): BankEntry[] {
  const activeOverrides = filterActiveVipOverrides(overrides);
  if (activeOverrides.length === 0) return entries;

  const logosById = new Map(BANKS_DATA.map((bank) => [bank.id, bank.logoUrl] as const));
  const overrideById = new Map(activeOverrides.map((o) => [o.providerId.toLowerCase(), o]));
  const byId = new Map(entries.map((e) => [e.id, { ...e }]));

  for (const bankId of ALLOWED_BANK_IDS) {
    const override = overrideById.get(bankId);
    if (!override) continue;

    const existing = byId.get(bankId);
    const marketRate =
      marketRatesByBank.get(bankId) ??
      existing?.marketRate ??
      (productType === "mortgage" ? existing?.baseRate : existing?.loanRate);

    byId.set(bankId, {
      id: bankId,
      name: CANONICAL_BANK_META[bankId].name,
      baseRate: productType === "mortgage" ? override.nominalRate : (existing?.baseRate ?? 99),
      loanRate: productType === "loan" ? override.nominalRate : (existing?.loanRate ?? 99),
      apr: override.apr ?? existing?.apr,
      logoUrl: logosById.get(bankId) ?? existing?.logoUrl ?? "",
      source: "override",
      sourceUrl: existing?.sourceUrl,
      fetchedAt: new Date().toISOString(),
      isVip: true,
      marketRate,
      validUntil: override.validUntil ?? undefined,
    });
  }

  return Array.from(byId.values()).sort((a, b) => {
    const aRate = productType === "mortgage" ? a.baseRate : a.loanRate;
    const bRate = productType === "mortgage" ? b.baseRate : b.loanRate;
    return aRate - bRate;
  });
}
