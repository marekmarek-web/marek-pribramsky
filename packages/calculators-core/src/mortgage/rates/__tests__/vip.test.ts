import { describe, expect, it } from "vitest";
import { BANKS_DATA } from "../../mortgage.config";
import type { BankEntry } from "../../mortgage.types";
import { applyVipOverridesToBankEntries } from "../vip";

describe("applyVipOverridesToBankEntries", () => {
  const baseEntries: BankEntry[] = BANKS_DATA.map((b) => ({
    ...b,
    marketRate: b.baseRate,
  }));

  it("marks override lower than market as VIP", () => {
    const market = new Map([["kb", 5.19]]);
    const result = applyVipOverridesToBankEntries(
      baseEntries,
      [{ providerId: "kb", nominalRate: 4.49 }],
      market,
      "mortgage",
    );
    const kb = result.find((e) => e.id === "kb");
    expect(kb?.baseRate).toBe(4.49);
    expect(kb?.isVip).toBe(true);
    expect(kb?.marketRate).toBe(5.19);
    expect(kb?.source).toBe("override");
  });

  it("does not mark override equal or higher than market as VIP", () => {
    const market = new Map([["kb", 5.19]]);
    const result = applyVipOverridesToBankEntries(
      baseEntries,
      [{ providerId: "kb", nominalRate: 5.5 }],
      market,
      "mortgage",
    );
    const kb = result.find((e) => e.id === "kb");
    expect(kb?.isVip).toBe(false);
  });

  it("returns entries unchanged when no overrides", () => {
    const result = applyVipOverridesToBankEntries(baseEntries, [], new Map(), "mortgage");
    expect(result).toEqual(baseEntries);
  });
});
