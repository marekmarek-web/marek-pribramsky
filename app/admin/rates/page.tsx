import Link from "next/link";
import { requireEditor } from "@/lib/admin/require-editor";
import {
  ALLOWED_BANK_IDS,
  getLoanRates,
  getMortgageRates,
  normalizedOffersToBankEntries,
  rankOffersByScenario,
} from "@/lib/calculators/mortgage/rates";
import { listStoredVipRates } from "@/lib/vip-rates";
import { ClearVipRatesButton, VipRatesForm } from "@/components/admin/VipRatesForm";

type Props = { searchParams: Promise<{ saved?: string; cleared?: string; error?: string; tab?: string }> };

function marketRatesForProduct(
  offers: Awaited<ReturnType<typeof getMortgageRates>>,
  productType: "mortgage" | "loan",
) {
  const scenario = {
    productType,
    subtype: productType === "mortgage" ? "standard" : "consumer",
    amount: productType === "mortgage" ? 5_400_000 : 200_000,
    termMonths: productType === "mortgage" ? 360 : 60,
    ltvOrAkontace: productType === "mortgage" ? 90 : 0,
    fixationYears: productType === "mortgage" ? 5 : undefined,
    mode: "new" as const,
  };
  const ranked = rankOffersByScenario(offers, scenario);
  const entries = normalizedOffersToBankEntries(ranked, productType);
  const byId = new Map(entries.map((e) => [e.id, e]));

  return ALLOWED_BANK_IDS.flatMap((id) => {
    const rate = productType === "mortgage" ? byId.get(id)?.baseRate : byId.get(id)?.loanRate;
    if (rate == null || rate >= 50) return [];
    return [{ providerId: id, nominalRate: rate }];
  });
}

export default async function AdminRatesPage({ searchParams }: Props) {
  const sp = await searchParams;
  const { user } = await requireEditor();
  const activeTab = sp.tab === "loan" ? "loan" : "mortgage";

  const [mortgageOffers, loanOffers, stored] = await Promise.all([
    getMortgageRates(),
    getLoanRates(),
    listStoredVipRates(user.id),
  ]);

  const mortgageMarket = marketRatesForProduct(mortgageOffers, "mortgage");
  const loanMarket = marketRatesForProduct(loanOffers, "loan");

  const mortgageSaved = stored.filter((r) => r.product_type === "mortgage");
  const loanSaved = stored.filter((r) => r.product_type === "loan");

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-brand-text">VIP sazby kalkulačky</h1>
          <p className="text-sm text-brand-muted mt-1">
            Vlastní sazby pro hypotéky a úvěry — zobrazí se v kalkulačce po přihlášení.
          </p>
        </div>
        <Link href="/admin" className="text-sm font-semibold text-brand-navy hover:text-brand-cyan">
          ← Přehled
        </Link>
      </div>

      {sp.saved ? (
        <p className="mb-6 text-sm rounded-xl bg-brand-cyan/10 text-brand-navy px-4 py-3">Uloženo.</p>
      ) : null}
      {sp.cleared ? (
        <p className="mb-6 text-sm rounded-xl bg-brand-cyan/10 text-brand-navy px-4 py-3">
          Vlastní sazby smazány.
        </p>
      ) : null}
      {sp.error ? (
        <p className="mb-6 text-sm rounded-xl bg-red-50 text-red-700 px-4 py-3">
          {decodeURIComponent(sp.error)}
        </p>
      ) : null}

      <div className="flex gap-2 mb-8">
        <Link
          href="/admin/rates?tab=mortgage"
          className={`rounded-xl px-4 py-2 text-sm font-bold ${
            activeTab === "mortgage"
              ? "bg-brand-navy text-white"
              : "bg-slate-100 text-brand-navy hover:bg-slate-200"
          }`}
        >
          Hypotéky
        </Link>
        <Link
          href="/admin/rates?tab=loan"
          className={`rounded-xl px-4 py-2 text-sm font-bold ${
            activeTab === "loan"
              ? "bg-brand-navy text-white"
              : "bg-slate-100 text-brand-navy hover:bg-slate-200"
          }`}
        >
          Úvěry
        </Link>
        <Link
          href="/hypotecnikalkulacka"
          className="ml-auto rounded-xl px-4 py-2 text-sm font-semibold text-brand-cyan hover:bg-brand-cyan/10"
        >
          Otevřít kalkulačku →
        </Link>
      </div>

      {activeTab === "mortgage" ? (
        <div className="space-y-4">
          <VipRatesForm productType="mortgage" marketRates={mortgageMarket} savedRates={mortgageSaved} />
          <ClearVipRatesButton productType="mortgage" />
        </div>
      ) : (
        <div className="space-y-4">
          <VipRatesForm productType="loan" marketRates={loanMarket} savedRates={loanSaved} />
          <ClearVipRatesButton productType="loan" />
        </div>
      )}
    </div>
  );
}
