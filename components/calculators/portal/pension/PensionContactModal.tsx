"use client";

import { CalculatorLeadModal } from "@/components/forms/CalculatorLeadModal";
import { formatCurrency } from "@/lib/calculators/pension/formatters";
import type { PensionResult, PensionState } from "@/lib/calculators/pension/pension.types";

export interface PensionContactModalProps {
  open: boolean;
  onClose: () => void;
  state: PensionState;
  result: PensionResult;
  onSubmitSuccess?: () => void;
}

export function PensionContactModal({ open, onClose, state, result, onSubmitSuccess }: PensionContactModalProps) {
  const resultSummary = [
    `Odhad starobního důchodu: ${formatCurrency(result.estimatedPension)} Kč/měs.`,
    `Měsíční mezera k cíli: ${formatCurrency(result.monthlyGap)} Kč`,
    `Doporučená měsíční investice: ${formatCurrency(Math.round(result.monthlyInvestment))} Kč`,
    `Cílový majetek (orientačně): ${(result.targetCapital / 1_000_000).toFixed(1)} mil. Kč`,
  ].join("\n");

  const metadata: Record<string, string> = {
    vek: String(state.age),
    vekOdchodu: String(state.retireAge),
    mzda: String(state.salary),
    renta: String(state.rent),
    scenar: state.scenario,
  };

  return (
    <CalculatorLeadModal
      open={open}
      onClose={onClose}
      calculatorType="pension"
      title="Chci tento plán nastavit"
      subtitle="Nechte mi kontakt — ozvu se a probereme další postup."
      resultSummary={resultSummary}
      metadata={metadata}
      onSubmitSuccess={onSubmitSuccess}
    />
  );
}
