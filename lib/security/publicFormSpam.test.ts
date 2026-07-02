import { describe, expect, it } from "vitest";
import {
  checkPublicFormSpam,
  isFormTooFast,
  isHoneypotFilled,
} from "@/lib/security/publicFormSpam";

describe("publicFormSpam", () => {
  it("detects honeypot", () => {
    expect(isHoneypotFilled("https://spam.example")).toBe(true);
    expect(checkPublicFormSpam({ companyWebsite: "x" }).reason).toBe("honeypot");
  });

  it("detects too_fast submissions", () => {
    const openedAt = Date.now() - 500;
    expect(isFormTooFast(openedAt, 2000)).toBe(true);
    expect(checkPublicFormSpam({ formOpenedAt: openedAt }).reason).toBe("too_fast");
  });

  it("allows valid submissions", () => {
    expect(
      checkPublicFormSpam({
        companyWebsite: "",
        formOpenedAt: Date.now() - 10_000,
      }).ok,
    ).toBe(true);
  });
});
