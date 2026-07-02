/**
 * Mortgage calculator – pure calculation engine (1:1 with hypotecni.html).
 * No DOM; all inputs via state-like object.
 *
 * Parity (verified vs html/hypotecni.html):
 * - Scenario: mortgage, 6M property, 600k own (90% LTV → 5.4M úvěr), 30y, 5y fix, standard, new
 *   → same monthly payment and rate as HTML.
 * - Loan/auto: borrowingAmount = loan - own; rate = avg(loanRate) - 1.0.
 * - Consolidation: borrowingAmount = loan + extra; rate = avg(loanRate) - 0.5.
 * - state.fix is synced with fixation select (bugfix from HTML).
 * - Extra input has handlers (bugfix from HTML).
 */

import { BANKS_DATA } from "./mortgage.config";
import { MORTGAGE_MIN_RATE } from "./mortgage.constants";
import type { MortgageState, MortgageResult, BankOffer } from "./mortgage.types";
import type { BankEntry } from "./mortgage.types";

/** PMT formula: (P * r * (1+r)^n) / ((1+r)^n - 1); for r=0: P/n. */
export function computePMT(
  borrowingAmount: number,
  annualRatePercent: number,
  termYears: number
): number {
  const n = termYears * 12;
  if (borrowingAmount <= 0) return 0;
  const r = annualRatePercent / 100 / 12;
  if (r <= 0) return borrowingAmount / n;
  return (borrowingAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

/** LTV for mortgage: (propertyValue − own) / propertyValue. For auto: own/loan (akontace). */
export function getCalculatedLtv(state: MortgageState): number {
  if (state.product === "mortgage") {
    const propertyValue = state.loan;
    const borrowing = Math.max(0, propertyValue - state.own);
    if (propertyValue > 0) return Math.round((borrowing / propertyValue) * 100);
    return 0;
  }
  if (state.product === "loan" && state.loanType === "auto") {
    if (state.loan > 0) return Math.round((state.own / state.loan) * 100);
    return 0;
  }
  return 0;
}

/** Mortgage rate: base + penalty (LTV>91, american, investment, refi) + fix adjustment; min 4.19. */
export function computeMortgageRate(state: MortgageState, fixYears: number): number {
  return computeMortgageRateWithBanks(state, fixYears, BANKS_DATA);
}

export function computeMortgageRateWithBanks(
  state: MortgageState,
  fixYears: number,
  banks: BankEntry[]
): number {
  const sourceBanks = banks.length > 0 ? banks : BANKS_DATA;
  const base = Math.min(...sourceBanks.map((b) => b.baseRate));
  let penalty = 0;
  const calcLtv = getCalculatedLtv(state);
  if (calcLtv > 91) penalty += 1.5;
  if (state.mortgageType === "american") penalty += 1.5;
  if (state.mortgageType === "investment") penalty += 0.4;
  if (state.type === "refi") penalty -= 0.2;

  let finalRate = base + penalty;
  if (finalRate < MORTGAGE_MIN_RATE) finalRate = MORTGAGE_MIN_RATE;

  // Bank rates (static fallback and kurzy.cz) already reflect the selected fixation;
  // do not apply extra fix-length surcharges on top.
  return finalRate;
}

/** Loan rate: avg(bank.loanRate) + typeMod (auto -1, consolidation -0.5). */
export function computeLoanRate(state: MortgageState): number {
  return computeLoanRateWithBanks(state, BANKS_DATA);
}

export function computeLoanRateWithBanks(state: MortgageState, banks: BankEntry[]): number {
  const sourceBanks = banks.length > 0 ? banks : BANKS_DATA;
  const avgRate =
    sourceBanks.reduce((acc, b) => acc + (b.loanRate ?? 7.0), 0) / sourceBanks.length;
  let typeMod = 0;
  if (state.loanType === "auto") typeMod = -1.0;
  if (state.loanType === "consolidation") typeMod = -0.5;
  return avgRate + typeMod;
}

/** Borrowing amount: mortgage = property − own; auto = loan − own; consolidation = loan + extra. */
export function getBorrowingAmount(state: MortgageState): number {
  if (state.product === "mortgage") return Math.max(0, state.loan - state.own);
  if (state.loanType === "auto") return Math.max(0, state.loan - state.own);
  if (state.loanType === "consolidation") return state.loan + state.extra;
  return state.loan;
}

/** Full result for current state (display LTV, labels, warnings). */
export function calculateResult(
  state: MortgageState,
  banksOverride?: BankEntry[]
): MortgageResult {
  const bankData = banksOverride && banksOverride.length > 0 ? banksOverride : BANKS_DATA;
  const fixYears = state.fix;
  const calcLtv = getCalculatedLtv(state);
  const borrowingAmount = getBorrowingAmount(state);

  let finalRate = 0;
  let propertyValue = state.loan + state.own;
  let showLtvRow = false;
  let ltvLabel = "LTV";
  let showLtvWarning = false;
  let ltvWarningValue = 0;

  if (state.product === "mortgage") {
    finalRate = computeMortgageRateWithBanks(state, fixYears, bankData);
    propertyValue = state.loan;
    showLtvRow = true;
    ltvLabel = "LTV";
    showLtvWarning = calcLtv > 91;
    ltvWarningValue = calcLtv;
  } else {
    finalRate = computeLoanRateWithBanks(state, bankData);
    if (state.loanType === "auto") {
      propertyValue = borrowingAmount;
      showLtvRow = true;
      ltvLabel = "Akontace";
    }
  }

  const n = state.term * 12;
  const monthlyPayment = computePMT(borrowingAmount, finalRate, state.term);
  const totalPaid = monthlyPayment * n;

  return {
    monthlyPayment: Math.round(monthlyPayment),
    finalRate,
    totalPaid: Math.round(totalPaid),
    borrowingAmount,
    displayLtv: calcLtv,
    propertyValue,
    showLtvRow,
    ltvLabel,
    showLtvWarning,
    ltvWarningValue,
  };
}

/** Per-bank rate for mortgage (same penalty/fix logic as main). */
function getBankMortgageRate(
  state: MortgageState,
  baseRate: number,
  fixYears: number
): number {
  let penalty = 0;
  const calcLtv = getCalculatedLtv(state);
  if (calcLtv > 91) penalty += 1.5;
  if (state.mortgageType === "american") penalty += 1.5;
  if (state.mortgageType === "investment") penalty += 0.4;
  if (state.type === "refi") penalty -= 0.2;

  let rate = baseRate + penalty;
  if (rate < MORTGAGE_MIN_RATE) rate = MORTGAGE_MIN_RATE;
  return rate;
}

/** Sorted bank offers with rate and monthly payment. */
export function getOffers(state: MortgageState): BankOffer[] {
  return getOffersWithBanks(state, BANKS_DATA);
}

export function getOffersWithBanks(
  state: MortgageState,
  banksOverride?: BankEntry[]
): BankOffer[] {
  const borrowingAmount = getBorrowingAmount(state);
  const months = state.term * 12;
  const fixYears = state.fix;
  const bankData = banksOverride && banksOverride.length > 0 ? banksOverride : BANKS_DATA;

  const sorted = [...bankData].sort((a, b) => {
    if (state.product === "mortgage") return a.baseRate - b.baseRate;
    return (a.loanRate ?? 10) - (b.loanRate ?? 10);
  });

  return sorted.map((bank) => {
    let rate: number;
    if (state.product === "mortgage") {
      rate = getBankMortgageRate(state, bank.baseRate, fixYears);
    } else {
      let mod = 0;
      if (state.loanType === "auto") mod = -1.0;
      if (state.loanType === "consolidation") mod = -0.5;
      rate = (bank.loanRate ?? 6.9) + mod;
    }
    const r = rate / 100 / 12;
    const monthlyPayment =
      borrowingAmount > 0
        ? r > 0
          ? (borrowingAmount * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1)
          : borrowingAmount / months
        : 0;
    return {
      bank,
      rate,
      apr: bank.apr,
      monthlyPayment: Math.round(monthlyPayment),
    };
  });
}

/** Compute own from target LTV: own = propertyValue × (100 − LTV) / 100. */
export function ownFromLtvMortgage(propertyValue: number, ltv: number): number {
  if (ltv <= 0 || ltv >= 100) return 0;
  return Math.round((propertyValue * (100 - ltv)) / 100 / 1000) * 1000;
}

/** Compute own from akontace for auto: own = loan * (akontace%) / 100. */
export function ownFromLtvAuto(loan: number, akontacePercent: number): number {
  return Math.round((loan * (akontacePercent / 100)) / 1000) * 1000;
}
