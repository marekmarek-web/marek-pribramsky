export const siteConfig = {
  name: "Marek Příbramský",
  titleTemplate: "%s | Marek Příbramský – Premium Brokers",
  defaultDescription:
    "Marek Příbramský – finanční poradce. Pomáhám rodinám a podnikatelům sestavit strategie, které dávají smysl.",
  contactEmail: "pribramsky@premiumbrokers.cz",
  phoneDisplay: "+420 728 480 423",
  phoneTel: "+420728480423",
} as const;

export type NavItem = { label: string; href: string; external?: boolean };

/** Sekce úvodní stránky + Blog — mezi „Spolupráce“ a „Blog“ vkládá SiteHeader dropdown Nástroje (canonical root index.html). */
export const mainNav: NavItem[] = [
  { label: "O mně", href: "/#proc-ja" },
  { label: "Služby", href: "/#sluzby" },
  { label: "Spolupráce", href: "/#kontakt" },
  { label: "Blog", href: "/blog" },
];

/** Mobilní drawer — pořadí a položky jako v index.html (bez rozbalení jednotlivých kalkulaček). */
export const mobileMenuLinks: NavItem[] = [
  { label: "O mně", href: "/#proc-ja" },
  { label: "Služby", href: "/#sluzby" },
  { label: "Spolupráce", href: "/#kontakt" },
  { label: "Kalkulačky", href: "/kalkulacky" },
  { label: "Blog", href: "/blog" },
];

export type ToolLink = { href: string; title: string; description: string };

export const toolsDropdown: ToolLink[] = [
  {
    href: "/hypotecnikalkulacka",
    title: "Hypoteční kalkulačka",
    description: "Měsíční splátka a náklady",
  },
  {
    href: "/investicnikalkulacka",
    title: "Investiční kalkulačka",
    description: "Projekce zhodnocení",
  },
  {
    href: "/zivotnikalkulacka",
    title: "Kalkulačka životního pojištění",
    description: "Potřebné krytí",
  },
  {
    href: "/penzijnikalkulacka",
    title: "Penzijní kalkulačka",
    description: "Státní příspěvky",
  },
];

/** Rychlé odkazy v patičce — shodně s root index.html (canonical). */
export const footerQuickLinks: NavItem[] = [
  { label: "Služby", href: "/#sluzby" },
  { label: "Pobočky", href: "/#pobocky" },
  { label: "Blog", href: "/blog" },
  { label: "Spolupráce", href: "/spoluprace" },
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
  { city: "Roudnice nad Labem", lines: ["Nám. Jana z Dražic 99, 413 01"] },
  { city: "Štětí", lines: ["U Tržnice 701, 411 08"] },
  { city: "Litoměřice", lines: ["5. května 10, 412 01"] },
  { city: "Praha", lines: ["Žatecká 55/14, 110 00"] },
  { city: "Lovosice", lines: ["Brzy otevíráme"], muted: true },
];

export const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/PremiumBrokersRCE",
    icon: "fb" as const,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/premiumbrokers.cz/",
    icon: "ig" as const,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/marek-pribramsky/",
    icon: "li" as const,
  },
];
