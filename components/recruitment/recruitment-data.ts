export type BentoBenefitIcon = "trending" | "users" | "book" | "shield";

export type BentoBenefitAccent = "gold" | "navy" | "cyan";

export type RecruitmentBentoBenefit = {
  icon: BentoBenefitIcon;
  title: string;
  desc: string;
  theme: "light" | "dark";
  accent: BentoBenefitAccent;
  /** PB vodoznak jen u tmavé karty */
  showPbWatermark?: boolean;
};

export type ChoiceStep = {
  kind: "choice";
  id: string;
  question: string;
  options: { value: string; label: string }[];
};

export type ChoiceOtherStep = {
  kind: "choice-other";
  id: string;
  question: string;
  options: { value: string; label: string }[];
  otherLabel: string;
  otherOptionValue: string;
  /** Placeholder pro textové pole „Jiné“ (LP) */
  otherPlaceholder?: string;
};

export type WizardQuestionStep = ChoiceStep | ChoiceOtherStep;

/** Hero: portrét v `/img/FormularFoto.png`; `usePlaceholderPortrait` jen pro draft bez fotky. */
export const RECRUITMENT_HERO = {
  badgeLabel: "Pracuj po boku profesionála",
  titleBefore: "Pracuj ve světě financí na",
  titleGradient: "TOP úrovni",
  titleAfterLine: "s Markem Příbramským",
  subtitle:
    "Buduji tým lidí, kteří chtějí růst, vydělávat a budovat vlastní byznys ve financích a realitách.",
  subtitleEmphasis:
    "Nehledám každého – jen ty, kteří mají drive, charakter a chtějí na sobě makat.",
  ctaLabel: "MÁM ZÁJEM",
  /** Reálná fotka — zapněte místo placeholderu */
  imageSrc: "/img/FormularFoto.png",
  imageAlt: "Marek Příbramský — finance a tým Premium Brokers",
  usePlaceholderPortrait: false,
} as const;

export const RECRUITMENT_BENTO_BENEFITS: RecruitmentBentoBenefit[] = [
  {
    icon: "trending",
    title: "78 000 Kč",
    desc: "Taková je průměrná měsíční odměna v mém týmu. Žádné limity, jen tvé nasazení.",
    theme: "dark",
    accent: "gold",
  },
  {
    icon: "users",
    title: "Růstové prostředí",
    desc: "Moderní kanceláře po celé ČR a tým lidí, co tě potáhnou nahoru.",
    theme: "light",
    accent: "navy",
  },
  {
    icon: "book",
    title: "Plná podpora",
    desc: "Kompletní zaškolení, stabilní přísun leadů a praxe na reálných schůzkách.",
    theme: "light",
    accent: "cyan",
  },
  {
    icon: "shield",
    title: "Vlastní silný brand",
    desc: "Propojení světa financí a realit nám dává ještě silnější pozici na trhu a mnohem více obchodních příležitostí.",
    theme: "dark",
    accent: "cyan",
    showPbWatermark: true,
  },
];

/** Sekce „Proč do toho jít“ — nadpis nad týmovou fotkou a blokem výzvy */
export const RECRUITMENT_BENTO_INTRO = {
  title: "Proč do toho jít s námi",
} as const;

/** Týmová fotka — plné rozlišení z `tymovy marek.JPG` (4096×3072). */
export const RECRUITMENT_WHY_TEAM_PHOTO = {
  src: "/img/kariera/team-premium-brokers.jpg",
  alt: "Tým Premium Brokers — společná fotografie před kanceláří",
  width: 4096,
  height: 3072,
} as const;

/** Obsah viz inzerát „Hledáte novou výzvu?“ (nahrazuje dřívější dlouhý podnadpis) */
export const RECRUITMENT_CHALLENGE_CARD = {
  badge: "Hledáte novou výzvu?",
  intro:
    "Praxe v oblasti finančního poradenství netřeba. Vše vám rádi ukážeme a naučíme.",
  offers:
    "Nabízíme: Nadstandardní provizní systém, flexibilitu, pravidelné školení, teambuildingy, MultiSport kartu, spolupráci na IČO a mnoho dalšího.",
  requirements:
    "Bez čeho se ale neobejdete? Min. SŠ vzdělání s maturitou, čistého trestního rejstříku a obchodního potenciálu.",
  cta: "Pokud vás zajímá více, stačí se mi ozvat a rád s vámi proberu možnosti.",
  branchesLabel: "Pobočky:",
  branches: "Praha, Jihlava, Roudnice nad Labem, Litoměřice, Štětí, Lovosice",
} as const;

export const WIZARD_STEPS: WizardQuestionStep[] = [
  {
    kind: "choice",
    id: "q1",
    question: "Baví tě práce s lidmi, máš rád komunikaci?",
    options: [
      { value: "ano", label: "ANO" },
      { value: "ne", label: "NE" },
      { value: "napul", label: "Napůl" },
    ],
  },
  {
    kind: "choice",
    id: "q2",
    question: "Jaký jsi typ člověka?",
    options: [
      { value: "tahoun", label: "Tahoun" },
      { value: "stabilni", label: "Stabilní" },
      { value: "klidnejsi", label: "Klidnější" },
      { value: "nemusim_spolecnost", label: "Nemusím společnost" },
    ],
  },
  {
    kind: "choice",
    id: "q3",
    question: "Máš zkušenosti s obchodem nebo prací s lidmi?",
    options: [
      { value: "ano_aktivne", label: "Ano, aktivně prodávám / prodával jsem" },
      { value: "castecne", label: "Částečně (komunikace s klienty atd.)" },
      { value: "chci_se_naucit", label: "Nemám, ale chci se to naučit" },
    ],
  },
  {
    kind: "choice-other",
    id: "q4",
    question: "Co aktuálně děláš?",
    otherOptionValue: "jine",
    otherLabel: "Upřesnění",
    otherPlaceholder: "Prosím, rozveďte svou odpověď...",
    options: [
      { value: "zamestnani", label: "Zaměstnání" },
      { value: "podnikani", label: "Podnikání" },
      { value: "student", label: "Student" },
      { value: "jine", label: "Jiné" },
    ],
  },
  {
    kind: "choice",
    id: "q5",
    question: "Máš řidičský průkaz skup. B?",
    options: [
      { value: "ano", label: "Ano" },
      { value: "ne", label: "Ne" },
    ],
  },
  {
    kind: "choice-other",
    id: "q6",
    question: "Jaké je tvoje vzdělání?",
    otherOptionValue: "jine",
    otherLabel: "Upřesnění",
    otherPlaceholder: "Uveďte prosím jaké...",
    options: [
      { value: "maturita", label: "Maturita" },
      { value: "vyucni", label: "Výuční list" },
      { value: "vs", label: "VŠ" },
      { value: "jine", label: "Jiné" },
    ],
  },
];

export const CONTACT_STEP_COPY = {
  title: "Jsem rád, že jste došli až sem.",
  subtitle: "Nechte mi na sebe kontakt a já se vám osobně ozvu.",
} as const;

export const WIZARD_SUCCESS_COPY = {
  title: "Mám to u sebe!",
  body: "Děkuji za odpovědi. Brzy si je projdu a do 24 hodin se vám ozvu pro domluvení dalšího postupu.",
} as const;
