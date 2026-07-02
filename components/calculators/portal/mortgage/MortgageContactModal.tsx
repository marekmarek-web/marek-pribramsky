"use client";

import { CalculatorLeadModal } from "@/components/forms/CalculatorLeadModal";
import { getBorrowingAmount, getCalculatedLtv } from "@/lib/calculators/mortgage/mortgage.engine";
import type { MortgageState } from "@/lib/calculators/mortgage/mortgage.types";

export interface MortgageContactModalProps {
  open: boolean;
  onClose: () => void;
  bankName: string | null;
  state: MortgageState;
  onSubmitSuccess?: () => void;
}

export function MortgageContactModal({ open, onClose, bankName, state, onSubmitSuccess }: MortgageContactModalProps) {
  const ltv = getCalculatedLtv(state);
  const borrowing = getBorrowingAmount(state);
  const resultSummary = [
    `Produkt: ${state.product === "mortgage" ? "Hypotéka" : "Úvěr"}`,
    bankName ? `Banka / kontext: ${bankName}` : "Obecná poptávka (bez vybrané banky)",
    state.product === "mortgage"
      ? `Cena nemovitosti: ${state.loan.toLocaleString("cs-CZ")} Kč`
      : `Částka: ${state.loan.toLocaleString("cs-CZ")} Kč`,
    state.product === "mortgage"
      ? `Výše úvěru: ${borrowing.toLocaleString("cs-CZ")} Kč`
      : null,
    `Vlastní zdroje: ${state.own.toLocaleString("cs-CZ")} Kč`,
    `Doba: ${state.term} let`,
    `LTV / akontace: ${ltv} %`,
  ]
    .filter(Boolean)
    .join("\n");

  const metadata: Record<string, string> = {
    banka: bankName ?? "",
    typProduktu: state.product === "mortgage" ? "hypoteka" : "uver",
    typDetail: state.product === "mortgage" ? state.mortgageType : state.loanType,
    vyse: String(state.product === "mortgage" ? borrowing : state.loan),
    cenaNemovitosti: state.product === "mortgage" ? String(state.loan) : "",
    vlastni: String(state.own),
    splatnostLet: String(state.term),
    fixace: String(state.fix),
    ltv: String(ltv),
  };

  return (
    <CalculatorLeadModal
      open={open}
      onClose={onClose}
      calculatorType="mortgage"
      title="Probrat hypotéku a další kroky"
      subtitle={
        bankName
          ? `Kontext: ${bankName}. Ozvu se s tím, co dává smysl dál — bez tlaku na konkrétní produkt.`
          : "Obecná poptávka — srovnání variant a konzultace k vaší situaci."
      }
      resultSummary={resultSummary}
      metadata={metadata}
      onSubmitSuccess={onSubmitSuccess}
    />
  );
}
