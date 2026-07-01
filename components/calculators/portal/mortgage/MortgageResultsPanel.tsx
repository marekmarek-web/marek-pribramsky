"use client";

import { formatCurrency, formatRate } from "@/lib/calculators/mortgage/formatters";
import { PrimaryTailoredCtaButton } from "@/components/ui/PrimaryTailoredCta";
import type { MortgageResult } from "@/lib/calculators/mortgage/mortgage.types";

export interface MortgageResultsPanelProps {
  result: MortgageResult;
  /** Obecná konzultace / nabídka bez výběru banky z karty */
  onCtaConsult?: () => void;
}

const CIRC = 2 * Math.PI * 36;

function CurrencyAmount({
  value,
  size = "md",
  prefix,
}: {
  value: number;
  size?: "md" | "lg" | "sm";
  prefix?: string;
}) {
  const sizeClass =
    size === "lg"
      ? "text-[2.25rem] sm:text-[2.5rem] font-extrabold"
      : size === "sm"
        ? "text-sm font-bold"
        : "text-[15px] font-bold";

  return (
    <span
      className={`inline-flex flex-nowrap items-baseline gap-x-1 leading-none whitespace-nowrap ${sizeClass} text-white`}
    >
      {prefix ? <span className="text-white/70">{prefix}</span> : null}
      <span>{formatCurrency(value)}</span>
      <span
        className={
          size === "lg"
            ? "text-base font-medium text-white/50 shrink-0"
            : "text-[11px] font-semibold text-white/40 shrink-0"
        }
      >
        Kč
      </span>
    </span>
  );
}

export function MortgageResultsPanel({ result, onCtaConsult }: MortgageResultsPanelProps) {
  const principal = result.borrowingAmount;
  const totalInterest = Math.max(0, result.totalPaid - principal);
  const total = principal + totalInterest;
  const interestLen = total > 0 ? (totalInterest / total) * CIRC : 0;
  const principalLen = total > 0 ? (principal / total) * CIRC : 0;

  return (
    <div className="relative overflow-hidden rounded-[20px] bg-[#0d1f4e] p-5 sm:p-6 text-white shadow-[0_16px_48px_rgba(13,31,78,0.14),0_4px_12px_rgba(13,31,78,0.06)]">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute w-[180px] h-[180px] rounded-full"
          style={{
            top: "-50px",
            left: "-50px",
            background: "radial-gradient(circle, rgba(37,99,235,0.22) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute w-[140px] h-[140px] rounded-full"
          style={{
            bottom: "-40px",
            right: "-40px",
            background: "radial-gradient(circle, rgba(5,150,105,0.16) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col gap-5">
        {/* Monthly payment hero */}
        <div>
          <div className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.12em] text-white/50 mb-2">
            Odhadovaná měsíční splátka
          </div>
          <CurrencyAmount value={result.monthlyPayment} size="lg" />
          <div className="mt-3 inline-flex items-center gap-1.5 bg-[rgba(5,150,105,0.2)] border border-[rgba(5,150,105,0.35)] rounded-full px-3 py-1 text-xs font-semibold text-[#34d399] whitespace-nowrap">
            <span className="w-[5px] h-[5px] rounded-full bg-[#34d399] animate-pulse shrink-0" />
            Úrok od {formatRate(result.finalRate)} p.a.
          </div>
        </div>

        {/* Cost breakdown */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/35 mb-3">
            Struktura celkových nákladů
          </div>

          <div className="flex items-center gap-4">
            <div className="relative shrink-0 w-[88px] h-[88px] sm:w-24 sm:h-24">
              <svg width="96" height="96" viewBox="0 0 96 96" className="w-full h-full" aria-hidden="true">
                <circle cx="48" cy="48" r="36" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="11" />
                <circle
                  cx="48"
                  cy="48"
                  r="36"
                  fill="none"
                  stroke="#34D399"
                  strokeWidth="11"
                  strokeDasharray={`${interestLen.toFixed(2)} ${CIRC.toFixed(2)}`}
                  strokeDashoffset="0"
                  strokeLinecap="butt"
                  transform="rotate(-90 48 48)"
                  style={{ transition: "stroke-dasharray 0.5s ease" }}
                />
                <circle
                  cx="48"
                  cy="48"
                  r="36"
                  fill="none"
                  stroke="#60A5FA"
                  strokeWidth="11"
                  strokeDasharray={`${principalLen.toFixed(2)} ${CIRC.toFixed(2)}`}
                  strokeDashoffset={`${(-interestLen).toFixed(2)}`}
                  strokeLinecap="butt"
                  transform="rotate(-90 48 48)"
                  style={{ transition: "stroke-dasharray 0.5s ease, stroke-dashoffset 0.5s ease" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[9px] font-semibold uppercase tracking-[0.08em] text-white/35">LTV</span>
                <span className="text-sm font-bold text-white leading-none">{result.displayLtv} %</span>
              </div>
            </div>

            <div className="min-w-0 flex-1 flex flex-col gap-3.5">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-[7px] h-[7px] rounded-full bg-[#60A5FA] shrink-0" />
                  <span className="text-[11px] text-white/50">Jistina</span>
                </div>
                <CurrencyAmount value={principal} size="md" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-[7px] h-[7px] rounded-full bg-[#34D399] shrink-0" />
                  <span className="text-[11px] text-white/50">Celkem úroky</span>
                </div>
                <CurrencyAmount value={totalInterest} size="md" prefix="+" />
              </div>
            </div>
          </div>
        </div>

        {/* Total */}
        <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-4">
          <span className="text-xs text-white/50 shrink-0">Celkem zaplatíte bance</span>
          <CurrencyAmount value={result.totalPaid} size="sm" />
        </div>

        {onCtaConsult != null ? (
          <PrimaryTailoredCtaButton surface="onDarkNavy" className="w-full" onClick={onCtaConsult} />
        ) : null}
      </div>
    </div>
  );
}
