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
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[9px] font-semibold uppercase tracking-[0.1em] text-white/45 mb-0.5">
            {primaryLabel}
          </div>
          {primaryValue}
        </div>
        {badge != null || badgeSubtext != null ? (
          <div className="shrink-0 text-right">
            {badge}
            {badgeSubtext != null ? (
              <div className="mt-1 text-[10px] text-white/40">{badgeSubtext}</div>
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
