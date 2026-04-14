export type PersonaId = "rodina" | "podnikatel" | "firma";

export type PersonaContent = {
  id: PersonaId;
  tabLabel: string;
  headline: string;
  description: string;
  benefits: string[];
  scenarios: string[];
  ctaLabel: string;
  ctaHref: string;
};

export const personaContent: PersonaContent[] = [
  {
    id: "rodina",
    tabLabel: "Rodiny a jednotlivci",
    headline: "Klidný plán pro domácnost — od rezerv po bydlení",
    description:
      "Společně sjednotíme rezervy, spoření pro děti, bydlení a ochranu příjmu. Jedna srozumitelná mapa místo deseti nesouvisejících smluv.",
    benefits: [
      "Rezerva a pojistky nastavené podle reality (ne podle katalogu)",
      "Hypotéka a investice v souladu s cíli rodiny",
      "Přehledné čtvrtletní kontroly — víte, kde stojíte",
    ],
    scenarios: ["Nový přírůstek do rodiny", "Změna bydlení / rekonstrukce", "Spoření na vzdělání dětí"],
    ctaLabel: "Domluvit konzultaci k rodinnému plánu",
    ctaHref: "/#kontakt",
  },
  {
    id: "podnikatel",
    tabLabel: "Podnikatelé",
    headline: "Oddělené firemní a osobní finance bez chaosu",
    description:
      "Peníze z podnikání umí rychle zmizet v provozu. Nastavíme výplatu, daňově efektivní rezervy a soukromé portfolio, které dává smysl vedle firmy.",
    benefits: [
      "Výběr zisku a rezervy OSVČ / s.r.o. bez zbytečných rizik",
      "Osobní investice mimo „mix“ s firemním účtem",
      "Jasný rámec pro majetek podnikatele i rodiny",
    ],
    scenarios: ["Růst tržeb a nutnost reinvestic", "Plánovaný výběr zisku", "Příprava na odchod z firmy"],
    ctaLabel: "Probrat finance podnikatele",
    ctaHref: "/#kontakt",
  },
  {
    id: "firma",
    tabLabel: "Firmy",
    headline: "Benefity a krytí, které drží tým i firmu",
    description:
      "Od daňově uznatelných benefitů přes penzijní a pojistné krytí až po ochranu managementu a majetku — srozumitelně pro vlastníky i HR.",
    benefits: [
      "Návrh benefitů podle rozpočtu a kultury firmy",
      "Pojištění odpovědnosti a majetku bez duplicit",
      "Propojení s osobními plány klíčových lidí",
    ],
    scenarios: ["Nástup nových zaměstnanců", "Restrukturalizace", "Expanze a nové provozy"],
    ctaLabel: "Domluvit audit benefitů",
    ctaHref: "/#kontakt",
  },
];

export type ServiceItem = {
  id: string;
  title: string;
  subtitle: string;
  iconD: string;
  detail: string;
  ctaHref: string;
  ctaLabel: string;
};

export const serviceItems: ServiceItem[] = [
  {
    id: "invest",
    title: "Investiční plánování",
    subtitle: "Ochrana a zhodnocení kapitálu",
    iconD:
      "M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z",
    detail:
      "Portfolio na míru s důrazem na nízké náklady, diverzifikaci a dlouhý horizont — ETF, fondy a jasná pravidla rebalancování.",
    ctaHref: "/investicnikalkulacka",
    ctaLabel: "Spočítejte si investice",
  },
  {
    id: "hypo",
    title: "Hypoteční úvěr",
    subtitle: "Financování bydlení chytře",
    iconD: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    detail:
      "Nastavení hypotéky tak, aby odpovídala cashflow a cílům — fix/varianta, refinancování, čerpání pro bydlení nebo investici.",
    ctaHref: "/hypotecnikalkulacka",
    ctaLabel: "Spočítat splátku a náklady",
  },
  {
    id: "pojisteni",
    title: "Zabezpečení rizik",
    subtitle: "Životní i majetkové pojištění",
    iconD:
      "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    detail:
      "Audit smluv: odstranění duplicit, správné limity a výluky — aby krytí fungovalo v situaci, kdy ho opravdu potřebujete.",
    ctaHref: "/#kontakt",
    ctaLabel: "Nastavení pojištění",
  },
  {
    id: "uvery",
    title: "Úvěry a konsolidace",
    subtitle: "Optimalizace dluhů",
    iconD:
      "M2.25 18.75v-1.5m0 1.5v-1.5m0 0h3.75m-3.75 0h3.75m-3.75 0h-3.75m0 0h-3.75m0 0V15m0 0v1.5m0-1.5V15m0 3h3.75m-3.75 0h3.75m-3.75 0H18M9 10.5h.008v.008H9V10.5zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    detail:
      "Sloučení více úvěrů do přehledné struktury, nižší splátka kde to dává smysl, a plán zbavení se dluhů bez „kouzelných“ produktů.",
    ctaHref: "/#kontakt",
    ctaLabel: "Projednat konsolidaci",
  },
  {
    id: "penze",
    title: "Doplňkové penzijní spoření",
    subtitle: "Státní příspěvky",
    iconD:
      "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5",
    detail:
      "Nastavení příspěvků a strategie fondů tak, abyste využili stát i daňové úlevy — v souladu s vaším horizontem.",
    ctaHref: "/penzijnikalkulacka",
    ctaLabel: "Spočítat penzi a příspěvky",
  },
  {
    id: "reality",
    title: "Realitní služby",
    subtitle: "Prodej, nákup a pronájem",
    iconD:
      "M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z",
    detail:
      "Komplexní servis u transakce nemovitosti — od odhadu a prezentace po právní a finanční návaznost včetně hypotéky.",
    ctaHref: "/#kontakt",
    ctaLabel: "Probrat realitní záměr",
  },
];

export type TimelineEntry = {
  year: string;
  img: string;
  title: string;
  text: string;
  yearClass?: string;
  /** Tailwind object-position utilities — per-photo crop */
  imagePositionClass: string;
};

export const timelineEntries: TimelineEntry[] = [
  {
    year: "2013",
    img: "/img/2013.jpg",
    title: "První kroky v OVB",
    text: "Během studia 5. ročníku na ekonomické VŠ jsem začal pracovat v OVB Allfinanz a.s.",
    imagePositionClass: "object-[center_45%] sm:object-[center_42%]",
  },
  {
    year: "2015",
    img: "/img/2015.png",
    title: "Přestup do FINGO",
    text: "Pochopení, že existují lepší možnosti – přestup do F&P Consulting s.r.o. (dnešní FINGO).",
    imagePositionClass: "object-[center_50%] sm:object-[center_46%]",
  },
  {
    year: "2016",
    img: "/img/2016.jpg",
    title: "Fulltime v Broker Trust",
    text: "Ukončení zaměstnání a plný přechod do světa financí. Získávání nezávislosti.",
    imagePositionClass: "object-[center_44%] sm:object-[center_40%]",
  },
  {
    year: "2019",
    img: "/img/2019.jpg",
    title: "Založení Premium Brokers",
    text: "Vlastní firma s vizí prémiového a férového přístupu ke klientům.",
    imagePositionClass: "object-[50%_48%] sm:object-[48%_44%]",
  },
  {
    year: "2021",
    img: "/img/2021.jpg",
    title: "Nové pobočky",
    text: "Otevření nových poboček v Litoměřicích, Štětí a Praze k současné Roudnické.",
    imagePositionClass: "object-[center_48%] sm:object-[center_44%]",
  },
  {
    year: "2024",
    img: "/img/2024.jpg",
    title: "Premium Brokers Reality",
    text: "Založení realitní kanceláře Premium Brokers Reality s.r.o.",
    imagePositionClass: "object-[center_48%] sm:object-[center_42%]",
  },
  {
    year: "2026",
    img: "/img/2026.jpg",
    title: "Lovosice a tým",
    text: "Lovosice, silný tým a komplexní péče pod jednou střechou.",
    yearClass: "text-brand-cyan",
    imagePositionClass: "object-[center_46%] sm:object-[center_40%]",
  },
];
