import { describe, expect, it } from "vitest";
import { runCalculations } from "../life.engine";
import { DEFAULT_STATE } from "../life.config";

function state(patch: Partial<typeof DEFAULT_STATE>) {
  return { ...DEFAULT_STATE, ...patch };
}

function invalidityPension(result: ReturnType<typeof runCalculations>) {
  return result.chartData.find((row) => row.label === "Invalidita (měs.)")?.stat ?? 0;
}

describe("life.engine", () => {
  it("computes D3 pension without cliff at 80k income boundary", () => {
    const at79 = invalidityPension(runCalculations(state({ netIncome: 79_999 })));
    const at80 = invalidityPension(runCalculations(state({ netIncome: 80_000 })));

    expect(Math.abs(at80 - at79)).toBeLessThan(1_000);
  });

  it("computes D3 pension without cliff at 100k income boundary", () => {
    const at99 = invalidityPension(runCalculations(state({ netIncome: 99_999 })));
    const at100 = invalidityPension(runCalculations(state({ netIncome: 100_000 })));

    expect(Math.abs(at100 - at99)).toBeLessThan(1_000);
  });

  it("returns zero death coverage when no dependents and no liabilities", () => {
    const r = runCalculations(
      state({ children: 0, hasSpouse: false, liabilities: 0 }),
    );
    expect(r.deathCoverage).toBe(0);
  });
});
