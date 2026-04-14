/** Jednotná taxonomie — DB + aplikace (snake_case v SQL). */

export const LEAD_SOURCE_TYPES = [
  "homepage",
  "footer",
  "contact",
  "calculator",
  "article",
  "service_page",
  "career",
  "newsletter",
] as const;
export type LeadSourceType = (typeof LEAD_SOURCE_TYPES)[number];

export const LEAD_CATEGORIES = [
  "general",
  "consultation",
  "pension",
  "life",
  "mortgage",
  "investment",
  "insurance",
  "real_estate",
] as const;
export type LeadCategory = (typeof LEAD_CATEGORIES)[number];

export const LEAD_STATUSES = [
  "new",
  "contacted",
  "qualified",
  "waiting",
  "closed_won",
  "closed_lost",
  "archived",
] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: "Nový",
  contacted: "Kontaktováno",
  qualified: "Kvalifikováno",
  waiting: "Čeká",
  closed_won: "Uzavřeno — vyhráno",
  closed_lost: "Uzavřeno — ztraceno",
  archived: "Archiv",
};

export const LEAD_SOURCE_TYPE_LABELS: Record<LeadSourceType, string> = {
  homepage: "Homepage",
  footer: "Patička",
  contact: "Kontakt",
  calculator: "Kalkulačka",
  article: "Článek",
  service_page: "Služba",
  career: "Kariéra",
  newsletter: "Odběr novinek",
};

export const LEAD_CATEGORY_LABELS: Record<LeadCategory, string> = {
  general: "Obecné",
  consultation: "Konzultace",
  pension: "Penze / důchod",
  life: "Životní pojištění",
  mortgage: "Hypotéka",
  investment: "Investice",
  insurance: "Pojištění",
  real_estate: "Reality",
};
