"use client";

import { CalculatorLeadModal } from "@/components/forms/CalculatorLeadModal";
import { formatCurrency } from "@/lib/calculators/life/formatters";
import type { LifeResult, LifeState } from "@/lib/calculators/life/life.types";

export type LifeModalType = "general" | "proposal" | "check";

export interface LifeContactModalProps {
  open: boolean;
  onClose: () => void;
  type: LifeModalType;
  state: LifeState;
  result: LifeResult;
  onSubmitSuccess?: () => void;
}

const TITLES: Record<LifeModalType, string> = {
  general: "Mám zájem o nabídku",
  proposal: "Získejte nezávazný návrh",
  check: "Kontrola smlouvy",
};

const SUBTITLES: Record<LifeModalType, string> = {
  general: "Nechte mi kontakt, ozvu se vám.",
  proposal: "Na základě vašich údajů připravím návrh.",
  check: "Nahrajte smlouvu (volitelně) a ozvu se s termínem kontroly.",
};

const INTENT_MAP: Record<LifeModalType, "general" | "proposal" | "check"> = {
  general: "general",
  proposal: "proposal",
  check: "check",
};

export function LifeContactModal({ open, onClose, type, state, result, onSubmitSuccess }: LifeContactModalProps) {
  const resultSummary = [
    `Krytí smrt: ${formatCurrency(result.deathCoverage)} Kč`,
    `Invalidita III+II: ${formatCurrency(result.capitalD3)} Kč`,
    `PN (denní potřeba): ${formatCurrency(result.pnDailyNeed)} Kč`,
    `Trvalé následky (základ): ${formatCurrency(result.tnBase)} Kč`,
  ].join("\n");

  const metadata: Record<string, string> = {
    vek: String(state.age),
    prijem: String(state.netIncome),
    vydaje: String(state.expenses),
    zavazky: String(state.liabilities),
    rezervy: String(state.reserves),
    deti: String(state.children),
    manzelstvi: state.hasSpouse ? "ano" : "ne",
    modalTyp: type,
  };

  return (
    <CalculatorLeadModal
      open={open}
      onClose={onClose}
      calculatorType="life"
      title={TITLES[type]}
      subtitle={SUBTITLES[type]}
      resultSummary={resultSummary}
      metadata={metadata}
      lifeIntent={INTENT_MAP[type]}
      showAttachment={type === "check"}
      onSubmitSuccess={onSubmitSuccess}
    />
  );
}
