"use client";

import { PrimaryTailoredCtaButton } from "@/components/ui/PrimaryTailoredCta";

/** Spodní padding stránky kalkulačky — sjednocený s výškou mobilního docku. */
export const CALCULATOR_MOBILE_PAGE_PADDING = "pb-36 lg:pb-0";

export interface CalculatorCompactDockPanelProps {
  primaryLabel: string;
  primaryValue: React.ReactNode;
  badge?: React.ReactNode;
  badgeSubtext?: React.ReactNode;
  summaryLeft?: React.ReactNode;
  summaryRight?: React.ReactNode;
  onCta?: () => void;
  ctaTestId?: string;
}

/**
 * Sjednocený kompaktní mobilní dock — stejná struktura u všech kalkulaček.
 */
export function CalculatorCompactDockPanel({
  primaryLabel,
  primaryValue,
  badge,
  badgeSubtext,
  summaryLeft,
  summaryRight,
  onCta,
  ctaTestId,
}: CalculatorCompactDockPanelProps) {
  return (
    <div className="bg-[#0d1f4e] px-4 py-3 text-white">
      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="text-[9px] font-semibold uppercase tracking-[0.1em] text-white/45 mb-0.5">
            {primaryLabel}
          </div>
          {primaryValue}
        </div>
        {badge != null || badgeSubtext != null ? (
          <div className="flex shrink-0 flex-col items-end gap-1 pb-0.5">
            {badge}
            {badgeSubtext != null ? (
              <div className="text-[10px] font-medium text-white/45 whitespace-nowrap">{badgeSubtext}</div>
            ) : null}
          </div>
        ) : null}
      </div>

      {summaryLeft != null || summaryRight != null ? (
        <div className="mt-2 flex items-center justify-between gap-2 border-t border-white/10 pt-2 text-[11px] text-white/45">
          {summaryLeft != null ? <span className="min-w-0">{summaryLeft}</span> : <span />}
          {summaryRight != null ? (
            <span className="font-semibold text-white/70 whitespace-nowrap shrink-0">{summaryRight}</span>
          ) : null}
        </div>
      ) : null}

      {onCta != null ? (
        <PrimaryTailoredCtaButton
          surface="onDarkNavy"
          className="mt-2.5 w-full !py-2.5 !text-sm"
          data-testid={ctaTestId}
          onClick={onCta}
        />
      ) : null}
    </div>
  );
}

export function CalculatorCompactDockBadge({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-[rgba(5,150,105,0.2)] border border-[rgba(5,150,105,0.3)] px-2 py-0.5 text-[10px] font-semibold text-[#34d399] whitespace-nowrap">
      {children}
    </div>
  );
}

/** Stejný chip pro desktop panel — větší padding, zarovnání k metrice. */
export function CalculatorPanelBadge({
  children,
  dot = false,
}: {
  children: React.ReactNode;
  dot?: boolean;
}) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(5,150,105,0.2)] border border-[rgba(5,150,105,0.35)] px-3 py-1 text-xs font-semibold text-[#34d399] whitespace-nowrap">
      {dot ? <span className="h-[5px] w-[5px] shrink-0 rounded-full bg-[#34d399]" aria-hidden /> : null}
      {children}
    </div>
  );
}
