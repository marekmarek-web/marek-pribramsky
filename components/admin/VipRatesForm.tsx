"use client";

import { useState } from "react";
import {
  clearVipRatesAction,
  saveVipRatesAction,
} from "@/app/admin/rates/actions";
import {
  ALLOWED_BANK_IDS,
  CANONICAL_BANK_META,
} from "@/lib/calculators/mortgage/rates/matching";
import { isVipOverrideActive } from "@/lib/calculators/mortgage/rates";

type ProductType = "mortgage" | "loan";

type MarketRate = {
  providerId: string;
  nominalRate: number;
};

type SavedRate = {
  provider_id: string;
  nominal_rate: number;
  apr: number | null;
  valid_until: string | null;
};

export function VipRatesForm({
  productType,
  marketRates,
  savedRates,
}: {
  productType: ProductType;
  marketRates: MarketRate[];
  savedRates: SavedRate[];
}) {
  const marketByBank = new Map(marketRates.map((r) => [r.providerId, r.nominalRate]));
  const savedByBank = new Map(savedRates.map((r) => [r.provider_id, r]));

  const [preview, setPreview] = useState<Record<string, string>>({});
  const [validUntilPreview, setValidUntilPreview] = useState<Record<string, string>>({});

  const label = productType === "mortgage" ? "hypotéky" : "úvěry";

  return (
    <form action={saveVipRatesAction} className="space-y-6">
      <input type="hidden" name="product_type" value={productType} />

      <p className="text-sm text-brand-muted leading-relaxed">
        Zadejte vlastní VIP obchodník sazby pro {label}. Aktivní VIP sazba má přednost před
        denním refreshem kurzy.cz a v kalkulačce se označí{" "}
        <span className="inline-flex items-center rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-950 text-[9px] font-black uppercase tracking-widest px-2 py-0.5">
          VIP
        </span>{" "}
        badge. Volitelně nastavte datum platnosti — po vypršení se znovu použije tržní sazba.
        Prázdné pole sazby = použije se tržní sazba.
      </p>

      <div className="overflow-x-auto rounded-xl border border-brand-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-left text-xs uppercase tracking-wider text-brand-muted">
              <th className="px-4 py-3 font-bold">Banka</th>
              <th className="px-4 py-3 font-bold">Kurzy.cz</th>
              <th className="px-4 py-3 font-bold">Vaše sazba (%)</th>
              <th className="px-4 py-3 font-bold">RPSN (%)</th>
              <th className="px-4 py-3 font-bold">Platí do</th>
              <th className="px-4 py-3 font-bold">Stav</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border">
            {ALLOWED_BANK_IDS.map((bankId) => {
              const saved = savedByBank.get(bankId);
              const market = marketByBank.get(bankId);
              const inputVal = preview[bankId] ?? (saved ? String(saved.nominal_rate) : "");
              const validUntilVal =
                validUntilPreview[bankId] ??
                (saved?.valid_until ? saved.valid_until.slice(0, 10) : "");
              const parsed = inputVal.trim() ? Number(inputVal.replace(",", ".")) : null;
              const hasRate = parsed != null && Number.isFinite(parsed);
              const isActiveVip =
                hasRate && isVipOverrideActive(validUntilVal || saved?.valid_until);
              const isExpired =
                hasRate &&
                !isVipOverrideActive(validUntilVal || saved?.valid_until) &&
                Boolean(validUntilVal || saved?.valid_until);

              return (
                <tr key={bankId} className="hover:bg-slate-50/80">
                  <td className="px-4 py-3 font-semibold text-brand-text">
                    {CANONICAL_BANK_META[bankId].name}
                  </td>
                  <td className="px-4 py-3 text-brand-muted tabular-nums">
                    {market != null ? `${market.toFixed(2)} %` : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      inputMode="decimal"
                      name={`rate_${bankId}`}
                      defaultValue={saved ? String(saved.nominal_rate) : ""}
                      placeholder={market != null ? market.toFixed(2) : "4.50"}
                      onChange={(e) =>
                        setPreview((p) => ({ ...p, [bankId]: e.target.value }))
                      }
                      className="w-24 px-3 py-2 rounded-lg border border-brand-border focus:ring-2 focus:ring-brand-cyan focus:border-transparent tabular-nums"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      inputMode="decimal"
                      name={`apr_${bankId}`}
                      defaultValue={saved?.apr != null ? String(saved.apr) : ""}
                      placeholder="—"
                      className="w-24 px-3 py-2 rounded-lg border border-brand-border focus:ring-2 focus:ring-brand-cyan focus:border-transparent tabular-nums"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="date"
                      name={`valid_until_${bankId}`}
                      defaultValue={saved?.valid_until ? saved.valid_until.slice(0, 10) : ""}
                      onChange={(e) =>
                        setValidUntilPreview((p) => ({ ...p, [bankId]: e.target.value }))
                      }
                      className="px-3 py-2 rounded-lg border border-brand-border focus:ring-2 focus:ring-brand-cyan focus:border-transparent text-sm"
                      title="Prázdné = platí do ruční změny"
                    />
                  </td>
                  <td className="px-4 py-3">
                    {isActiveVip ? (
                      <span className="inline-flex items-center rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-950 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 shadow-sm">
                        VIP
                      </span>
                    ) : isExpired ? (
                      <span className="text-xs font-semibold text-red-600">Expirovaná</span>
                    ) : hasRate ? (
                      <span className="text-xs text-brand-muted">Vlastní</span>
                    ) : (
                      <span className="text-xs text-brand-muted">Tržní</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          className="py-3 px-6 rounded-xl bg-brand-navy text-white font-bold hover:bg-brand-navy/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan focus-visible:ring-offset-2"
        >
          Uložit VIP sazby ({label})
        </button>
      </div>
    </form>
  );
}

export function ClearVipRatesButton({ productType }: { productType: ProductType }) {
  const label = productType === "mortgage" ? "hypotéky" : "úvěry";
  return (
    <form action={clearVipRatesAction}>
      <input type="hidden" name="product_type" value={productType} />
      <button
        type="submit"
        className="py-3 px-6 rounded-xl border border-brand-border text-brand-navy font-semibold hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan focus-visible:ring-offset-2"
      >
        Smazat vlastní sazby ({label})
      </button>
    </form>
  );
}
