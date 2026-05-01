import { describe, expect, it } from "vitest";
import { DEFAULT_STATE, BANKS_DATA, LIMITS } from "@/lib/calculators/mortgage/mortgage.config";
import { calculateResult, getCalculatedLtv } from "@/lib/calculators/mortgage/mortgage.engine";
import type { MortgageState } from "@/lib/calculators/mortgage/mortgage.types";
import { INVESTMENT_PROFILES } from "@/lib/calculators/investment/investment.config";
import { computeProjection } from "@/lib/calculators/investment/investment.engine";
import { DEFAULT_STATE as PENSION_DEFAULT } from "@/lib/calculators/pension/pension.config";
import { runCalculations as runPension } from "@/lib/calculators/pension/pension.engine";

describe("mortgage engine (CRM parity, static banks)", () => {
  it("default-like scenario: 6M loan, 600k own, 30y, fix 5y, standard, new", () => {
    const state: MortgageState = {
      ...DEFAULT_STATE,
      product: "mortgage",
      mortgageType: "standard",
      loanType: "consumer",
      loan: LIMITS.mortgage.default,
      own: 600_000,
      term: 30,
      fix: 5,
      type: "new",
      ltvLock: 90,
    };
    expect(getCalculatedLtv(state)).toBe(91);
    const r = calculateResult(state, BANKS_DATA);
    expect(r.monthlyPayment).toBeGreaterThan(29_000);
    expect(r.monthlyPayment).toBeLessThan(30_100);
    expect(r.finalRate).toBeCloseTo(4.29, 2);
  });
});

describe("investment projection (CRM parity)", () => {
  it("vyvážený 7 %, 100k + 5k/m × 10 let", () => {
    const profile = INVESTMENT_PROFILES[1]!;
    const out = computeProjection({
      initial: 100_000,
      monthly: 5000,
      years: 10,
      profile,
    });
    expect(Math.round(out.totalBalance)).toBe(1_066_390);
    expect(Math.round(out.totalInvested)).toBe(700_000);
  });
});

describe("pension (CRM parity)", () => {
  it("default state from penzijni kalkulačka", () => {
    const r = runPension({ ...PENSION_DEFAULT });
    expect(r.estimatedPension).toBe(14_364);
    expect(r.monthlyGap).toBe(20_636);
    expect(Math.round(r.monthlyInvestment)).toBe(5232);
    expect(Math.round(r.targetCapital)).toBe(4_276_489);
  });
});
