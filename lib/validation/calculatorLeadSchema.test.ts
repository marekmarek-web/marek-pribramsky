import { describe, expect, it } from "vitest";
import { calculatorLeadBodySchema } from "./calculatorLeadSchema";

describe("calculatorLeadBodySchema", () => {
  it("accepts minimal calculator lead with email", () => {
    const out = calculatorLeadBodySchema.safeParse({
      source: "calculator",
      calculatorType: "pension",
      name: "Jan",
      email: "jan@example.com",
      consent: true,
      formOpenedAt: Date.now() - 10_000,
    });
    expect(out.success).toBe(true);
  });

  it("accepts phone-only when 9+ digits", () => {
    const out = calculatorLeadBodySchema.safeParse({
      source: "contact_page",
      name: "Jan",
      email: "",
      phone: "+420 601 234 567",
      consent: true,
    });
    expect(out.success).toBe(true);
  });

  it("rejects when neither email nor phone is valid", () => {
    const out = calculatorLeadBodySchema.safeParse({
      source: "calculator",
      name: "Jan",
      email: "",
      phone: "123",
    });
    expect(out.success).toBe(false);
  });

  it("rejects empty name", () => {
    const out = calculatorLeadBodySchema.safeParse({
      source: "calculator",
      name: "   ",
      email: "a@b.cz",
      consent: true,
    });
    expect(out.success).toBe(false);
  });

  it("rejects inquiry lead without consent", () => {
    const out = calculatorLeadBodySchema.safeParse({
      source: "contact_page",
      name: "Jan",
      email: "jan@example.com",
    });
    expect(out.success).toBe(false);
  });
});
