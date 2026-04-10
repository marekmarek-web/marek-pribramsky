import { z } from "zod";

export const calculatorTypeSchema = z.enum(["pension", "life", "mortgage", "investment"]);

export const leadSourceSchema = z.enum([
  "calculator",
  "footer_quick",
  "homepage_consultation",
  "contact_page",
]);

export const lifeIntentSchema = z.enum(["general", "proposal", "check"]);

/** JSON body for POST /api/leads */
export const calculatorLeadBodySchema = z.object({
  source: leadSourceSchema,
  calculatorType: calculatorTypeSchema.optional(),
  lifeIntent: lifeIntentSchema.optional(),
  name: z.string().trim().min(1, "Vyplňte jméno.").max(120),
  email: z.string().trim().email("Neplatný e-mail."),
  phone: z.string().trim().max(40).optional(),
  note: z.string().trim().max(4000).optional(),
  sourcePath: z.string().max(500).optional(),
  resultSummary: z.string().max(8000).optional(),
  metadata: z.record(z.string(), z.string()).optional(),
  /** Honeypot — must be empty */
  companyWebsite: z.string().max(120).optional(),
  /** Client timestamp when modal/form opened (anti-bot) */
  formOpenedAt: z.number().optional(),
  /** Footer / homepage: interest or topic key */
  interest: z.string().max(80).optional(),
  topic: z.string().max(80).optional(),
  consent: z.boolean().optional(),
});

export type CalculatorLeadBody = z.infer<typeof calculatorLeadBodySchema>;
