import { describe, expect, it } from "vitest";
import { BANKS_DATA } from "../../mortgage.config";
import type { BankEntry } from "../../mortgage.types";
import {
  applyVipOverridesToBankEntries,
  filterActiveVipOverrides,
  isVipOverrideActive,
} from "../vip";

describe("isVipOverrideActive", () => {
  it("returns true when validUntil is null or undefined", () => {
    expect(isVipOverrideActive(null)).toBe(true);
    expect(isVipOverrideActive(undefined)).toBe(true);
  });

  it("returns true on the last valid day", () => {
    const now = new Date("2026-07-11T10:00:00");
    expect(isVipOverrideActive("2026-07-11", now)).toBe(true);
  });

  it("returns false after validUntil day", () => {
    const now = new Date("2026-07-12T00:00:01");
    expect(isVipOverrideActive("2026-07-11", now)).toBe(false);
  });
});

describe("filterActiveVipOverrides", () => {
  it("removes expired overrides", () => {
    const now = new Date("2026-07-12T00:00:01");
    const result = filterActiveVipOverrides(
      [
        { providerId: "kb", nominalRate: 4.5, validUntil: "2026-07-11" },
        { providerId: "cs", nominalRate: 4.8, validUntil: "2026-12-31" },
        { providerId: "rb", nominalRate: 5.0 },
      ],
      now,
    );
    expect(result.map((r) => r.providerId)).toEqual(["cs", "rb"]);
  });
});

describe("applyVipOverridesToBankEntries", () => {
  const baseEntries: BankEntry[] = BANKS_DATA.map((b) => ({
    ...b,
    marketRate: b.baseRate,
  }));

  it("marks active override as VIP regardless of market rate", () => {
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

  it("marks override higher than market as VIP too", () => {
    const market = new Map([["kb", 5.19]]);
    const result = applyVipOverridesToBankEntries(
      baseEntries,
      [{ providerId: "kb", nominalRate: 5.5 }],
      market,
      "mortgage",
    );
    const kb = result.find((e) => e.id === "kb");
    expect(kb?.baseRate).toBe(5.5);
    expect(kb?.isVip).toBe(true);
  });

  it("ignores expired overrides", () => {
    const market = new Map([["kb", 5.19]]);
    const result = applyVipOverridesToBankEntries(
      baseEntries,
      [{ providerId: "kb", nominalRate: 4.49, validUntil: "2020-01-01" }],
      market,
      "mortgage",
    );
    const kb = result.find((e) => e.id === "kb");
    expect(kb?.isVip).toBeFalsy();
    expect(kb?.baseRate).not.toBe(4.49);
  });

  it("returns entries unchanged when no overrides", () => {
    const result = applyVipOverridesToBankEntries(baseEntries, [], new Map(), "mortgage");
    expect(result).toEqual(baseEntries);
  });

  it("never lets market/kurzy rate overwrite an active VIP override", () => {
    const marketFromKurzy = new Map([
      ["kb", 5.34],
      ["rb", 5.04],
    ]);
    const result = applyVipOverridesToBankEntries(
      baseEntries.map((e) =>
        e.id === "kb" ? { ...e, baseRate: 5.34, marketRate: 5.34, source: "kurzy-cz" as const } : e,
      ),
      [{ providerId: "kb", nominalRate: 4.89 }],
      marketFromKurzy,
      "mortgage",
    );
    const kb = result.find((e) => e.id === "kb");
    expect(kb?.baseRate).toBe(4.89);
    expect(kb?.isVip).toBe(true);
    expect(kb?.marketRate).toBe(5.34);
    expect(kb?.source).toBe("override");
  });
});
