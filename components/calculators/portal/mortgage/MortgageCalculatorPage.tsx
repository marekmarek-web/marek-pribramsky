"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { CalculatorEngagement } from "@/components/analytics/CalculatorEngagement";
import { AnalyticsEvents } from "@/lib/analytics/events";
import { track } from "@/lib/analytics/track";
import { CalculatorGoogleReviewBadge } from "../core/CalculatorGoogleReviewBadge";
import { CalculatorMarketingHero } from "../core/CalculatorMarketingHero";
import { CalculatorPageShell } from "../core/CalculatorPageShell";
import { CalculatorMobileResultDock } from "../core/CalculatorMobileResultDock";
import { CALCULATOR_MOBILE_PAGE_PADDING } from "../core/CalculatorCompactDockPanel";
import { MortgageContactModal } from "./MortgageContactModal";
import { MortgageHeroTopControls } from "./MortgageHeroTopControls";
import { MortgageInputPanel } from "./MortgageInputPanel";
import { MortgageResultsPanel } from "./MortgageResultsPanel";
import { MortgageBankOffers } from "./MortgageBankOffers";

const MortgageAmortSection = dynamic(
  () => import("./MortgageAmortSection").then((m) => m.MortgageAmortSection),
  { loading: () => <div className="h-48 animate-pulse rounded-lg bg-slate-50" aria-hidden /> },
);
import {
  BANKS_DATA,
  DEFAULT_STATE,
  LIMITS,
} from "@/lib/calculators/mortgage/mortgage.config";
import {
  calculateResult,
  getBorrowingAmount,
  getCalculatedLtv,
  getOffersWithBanks,
} from "@/lib/calculators/mortgage/mortgage.engine";
import type { MortgageState } from "@/lib/calculators/mortgage/mortgage.types";
import type { BankEntry } from "@/lib/calculators/mortgage/mortgage.types";
import type { NormalizedOffer, VipRateOverride } from "@/lib/calculators/mortgage/rates";
import {
  ALLOWED_BANK_IDS,
  applyVipOverridesToBankEntries,
  bestMarketRateByBank,
  normalizedOffersToBankEntries,
  rankOffersByScenario,
} from "@/lib/calculators/mortgage/rates";

export function MortgageCalculatorPage() {
  const [state, setState] = useState<MortgageState>({
    ...DEFAULT_STATE,
    product: "mortgage",
    mortgageType: "standard",
    loanType: "consumer",
    loan: LIMITS.mortgage.default,
    own: 600_000,
    extra: 0,
    term: 30,
    fix: 5,
    type: "new",
    ltvLock: 90,
  });
  const [liveRates, setLiveRates] = useState<NormalizedOffer[] | null>(null);
  const [vipOverrides, setVipOverrides] = useState<VipRateOverride[]>([]);
  const [vipActive, setVipActive] = useState(false);
  const [leadOpen, setLeadOpen] = useState(false);
  const [leadBankName, setLeadBankName] = useState<string | null>(null);
  const defaultAllowedBanks = useMemo(
    () => BANKS_DATA.filter((bank) => ALLOWED_BANK_IDS.includes(bank.id as (typeof ALLOWED_BANK_IDS)[number])),
    []
  );

  useEffect(() => {
    const ctrl = new AbortController();
    // Při změně produktu ihned zruš předchozí VIP, ať se nesmíchají hypotéky/úvěry.
    setVipOverrides([]);
    setVipActive(false);

    (async () => {
      try {
        // Tržní sazby (veřejné) a VIP (privátní) musí jít odděleně —
        // dříve CDN cache na /rates vracela odpověď bez VIP a přepsala manuální sazby.
        const [ratesResponse, vipResponse] = await Promise.all([
          fetch(`/api/calculators/rates?type=${state.product}`, {
            method: "GET",
            cache: "no-store",
            signal: ctrl.signal,
          }),
          fetch(`/api/calculators/vip-rates?type=${state.product}`, {
            method: "GET",
            cache: "no-store",
            credentials: "include",
            signal: ctrl.signal,
          }),
        ]);

        if (ctrl.signal.aborted) return;

        if (ratesResponse.ok) {
          const ratesPayload = (await ratesResponse.json()) as {
            ok: boolean;
            rates?: NormalizedOffer[];
          };
          if (ratesPayload.ok && Array.isArray(ratesPayload.rates)) {
            setLiveRates(ratesPayload.rates);
          }
        }

        if (vipResponse.ok) {
          const vipPayload = (await vipResponse.json()) as {
            ok: boolean;
            vipOverrides?: VipRateOverride[];
            vipActive?: boolean;
          };
          if (vipPayload.ok) {
            setVipOverrides(Array.isArray(vipPayload.vipOverrides) ? vipPayload.vipOverrides : []);
            setVipActive(Boolean(vipPayload.vipActive));
          }
        }
      } catch {
        // static fallback — tržní sazby; VIP se neaplikují
      }
    })();
    return () => ctrl.abort();
  }, [state.product]);

  const rankedBanks = useMemo<BankEntry[] | undefined>(() => {
    if (!liveRates || liveRates.length === 0) {
      // I bez live kurzy.cz musí manuální VIP přepsat statický fallback.
      if (vipOverrides.length === 0) return defaultAllowedBanks;
      const marketByBank = new Map(
        defaultAllowedBanks.map((b) => [
          b.id,
          state.product === "mortgage" ? b.baseRate : (b.loanRate ?? b.baseRate),
        ]),
      );
      return applyVipOverridesToBankEntries(
        defaultAllowedBanks,
        vipOverrides,
        marketByBank,
        state.product,
      );
    }
    const scenario = {
      productType: state.product,
      subtype: state.product === "mortgage" ? state.mortgageType : state.loanType,
      amount: getBorrowingAmount(state),
      termMonths: state.term * 12,
      ltvOrAkontace: getCalculatedLtv(state),
      fixationYears: state.product === "mortgage" ? state.fix : undefined,
      mode: state.type,
    } as const;
    const ranked = rankOffersByScenario(liveRates, scenario);
    // Tržní mapa výhradně z kurzy/static — nikdy z VIP override.
    const marketByBank = bestMarketRateByBank(ranked, state.product);
    let normalized = normalizedOffersToBankEntries(ranked, state.product);
    if (vipOverrides.length > 0) {
      // Manuální VIP má vždy přednost před kurzy.cz.
      normalized = applyVipOverridesToBankEntries(
        normalized,
        vipOverrides,
        marketByBank,
        state.product,
      );
    }
    return normalized.length > 0 ? normalized : defaultAllowedBanks;
  }, [liveRates, state, defaultAllowedBanks, vipOverrides]);

  const result = useMemo(() => calculateResult(state, rankedBanks), [state, rankedBanks]);
  const offers = useMemo(() => getOffersWithBanks(state, rankedBanks), [state, rankedBanks]);
  const ratesMeta = rankedBanks?.[0];

  const openLead = (bank: string | null) => {
    track(AnalyticsEvents.calculatorCtaClick, {
      calculator: "mortgage",
      bank: bank ? bank.slice(0, 40) : "consult",
    });
    setLeadBankName(bank);
    setLeadOpen(true);
  };

  return (
    <>
    <CalculatorEngagement calculator="mortgage" />
    <div className={`pt-0 ${CALCULATOR_MOBILE_PAGE_PADDING}`}>
      <CalculatorPageShell>
        <CalculatorMarketingHero badge={<CalculatorGoogleReviewBadge />}>
          <h1 className="mb-4 text-3xl font-extrabold leading-tight text-brand-navy md:text-5xl">
            Kalkulačka hypoték a úvěrů
            <br />
            <span className="text-brand-navy">Srovnání bez kontaktu</span>
          </h1>
          <p className="mb-8 max-w-2xl text-lg leading-relaxed text-slate-600">
            <strong className="text-brand-navy">Hypotéka bez telefonního čísla</strong> a nutnosti registrace.
            Spočítejte si splátku pro nové bydlení, auto či konsolidaci úvěrů. Přesně, rychle a zcela anonymně.
          </p>
          <MortgageHeroTopControls
            product={state.product}
            type={state.type}
            onProductChange={(product) =>
              setState((s) => ({
                ...s,
                product,
                ...(product === "mortgage"
                  ? { loan: LIMITS.mortgage.default, own: 600_000, term: 30, fix: 5, type: "new" as const, ltvLock: 90 as number | null }
                  : { loan: LIMITS.loan.default, own: 0, term: 12, type: "new" as const, ltvLock: null }),
              }))
            }
            onTypeChange={(type) => setState((s) => ({ ...s, type }))}
          />
        </CalculatorMarketingHero>

        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[1fr_360px]">
          <MortgageInputPanel
            hideProductAndTabs
            state={state}
            onStateChange={setState}
            onProductChange={(product) =>
              setState((s) => ({
                ...s,
                product,
                ...(product === "mortgage"
                  ? { loan: LIMITS.mortgage.default, own: 600_000, term: 30, fix: 5, type: "new" as const, ltvLock: 90 as number | null }
                  : { loan: LIMITS.loan.default, own: 0, term: 12, type: "new" as const, ltvLock: null }),
              }))
            }
            onTypeChange={(type) => setState((s) => ({ ...s, type }))}
          />
          <div className="hidden lg:block sticky top-6">
            <MortgageResultsPanel result={result} onCtaConsult={() => openLead(null)} />
          </div>
        </div>

        {/* Amortization analysis */}
        {state.product === "mortgage" && (
          <MortgageAmortSection
            borrowingAmount={result.borrowingAmount}
            annualRate={result.finalRate}
            termYears={state.term}
          />
        )}

        <div className="mt-4 rounded-[20px] border-[1.5px] border-[#e2e8f0] bg-white p-5 shadow-sm sm:p-6 md:p-7">
          <MortgageBankOffers
            offers={offers}
            fetchedAt={ratesMeta?.fetchedAt}
            source={ratesMeta?.source}
            sourceUrl={ratesMeta?.sourceUrl}
            vipActive={vipActive}
            onRequestOffer={(bankName) => openLead(bankName)}
          />
        </div>
      </CalculatorPageShell>

      <CalculatorMobileResultDock>
        <MortgageResultsPanel compact result={result} onCtaConsult={() => openLead(null)} />
      </CalculatorMobileResultDock>
    </div>
    <MortgageContactModal
      open={leadOpen}
      onClose={() => setLeadOpen(false)}
      bankName={leadBankName}
      state={state}
    />
    </>
  );
}
