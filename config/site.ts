export const siteConfig = {
  name: "Marek Příbramský",
  titleTemplate: "%s | Marek Příbramský – Premium Brokers",
  defaultDescription:
    "Finanční plánování pro rodiny a firmy: investice, hypotéka, pojištění a penze — srozumitelně a bez nátlaku na produkt.",
  contactEmail: "pribramsky@premiumbrokers.cz",
  phoneDisplay: "+420 728 480 423",
  phoneTel: "+420728480423",
} as const;

export type NavItem = { label: string; href: string; external?: boolean };

/** Sekce úvodní stránky + Blog — mezi „Spolupráce“ a „Blog“ vkládá SiteHeader dropdown Nástroje (canonical root index.html). */
export const mainNav: NavItem[] = [
  { label: "O mně", href: "/#proc-ja" },
  { label: "Služby", href: "/#sluzby" },
  { label: "Spolupráce", href: "/#spoluprace" },
  { label: "Blog", href: "/blog" },
  { label: "Kariéra", href: "/kariera" },
  { label: "Kontakt", href: "/#kontakt" },
];

/** Mobilní drawer — pořadí a položky jako v index.html (bez rozbalení jednotlivých kalkulaček). */
export const mobileMenuLinks: NavItem[] = [
  { label: "O mně", href: "/#proc-ja" },
  { label: "Služby", href: "/#sluzby" },
  { label: "Spolupráce", href: "/#spoluprace" },
  { label: "Kalkulačky", href: "/kalkulacky" },
  { label: "Blog", href: "/blog" },
  { label: "Kariéra", href: "/kariera" },
  { label: "Kontakt", href: "/#kontakt" },
];

export type ToolLink = { href: string; title: string; description: string };

export const toolsDropdown: ToolLink[] = [
  {
    href: "/hypotecnikalkulacka",
    title: "Hypoteční kalkulačka",
    description: "Orientační splátka a náklady",
  },
  {
    href: "/investicnikalkulacka",
    title: "Investiční kalkulačka",
    description: "Projekce v čase — vstup do konzultace",
  },
  {
    href: "/zivotnikalkulacka",
    title: "Kalkulačka životního pojištění",
    description: "Odhad potřebného krytí",
  },
  {
    href: "/penzijnikalkulacka",
    title: "Penzijní kalkulačka",
    description: "Příspěvky a mezera k cíli",
  },
];

/** Rychlé odkazy v patičce — shodně s root index.html (canonical). */
export const footerQuickLinks: NavItem[] = [
  { label: "Služby", href: "/#sluzby" },
  { label: "Pobočky", href: "/#pobocky" },
  { label: "Blog", href: "/blog" },
  { label: "Spolupráce", href: "/spoluprace" },
  { label: "Kariéra", href: "/kariera" },
  { label: "Kontakt", href: "/#kontakt" },
];

export const footerToolLinks: NavItem[] = [
  { label: "Kalkulačky", href: "/kalkulacky" },
  { label: "Hypoteční kalkulačka", href: "/hypotecnikalkulacka" },
  { label: "Investiční kalkulačka", href: "/investicnikalkulacka" },
  { label: "Životní pojištění", href: "/zivotnikalkulacka" },
  { label: "Penzijní kalkulačka", href: "/penzijnikalkulacka" },
];

export type Branch = { city: string; lines: string[]; muted?: boolean };

export const branches: Branch[] = [
  { city: "Roudnice nad Labem", lines: ["Nám. Jana z Dražic 99, 413\u00A001"] },
  { city: "Štětí", lines: ["U Tržnice 701, 411\u00A008"] },
  { city: "Litoměřice", lines: ["5. května 10, 412\u00A001"] },
  { city: "Praha", lines: ["Žatecká 55/14, 110\u00A000"] },
  {
    city: "Lovosice",
    lines: ["Žižkova 28/922, 410\u00A002 Lovosice"],
  },
];

export const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/PremiumBrokersRCE",
    icon: "fb" as const,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/marek.pribramsky",
    icon: "ig" as const,
  },
  {
    label: "LinkedIn",
    href: "https://cz.linkedin.com/in/marek-pribramsky",
    icon: "li" as const,
  },
];
