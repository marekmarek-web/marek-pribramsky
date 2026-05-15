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

/** Kotva sekce s dotazníkem — sdílená hero / sticky CTA / konverzní karty */
export const RECRUITMENT_QUIZ_SECTION_ID = "dotaznik-sekce" as const;

/** Id sekce „Jak spolupráce funguje“ */
export const RECRUITMENT_HOW_IT_WORKS_ID = "jak-spoluprace-funguje" as const;

/** Hero — portrét v `/img/FormularFoto.png`; `usePlaceholderPortrait` jen pro draft bez fotky. */
export const RECRUITMENT_HERO = {
  badgeLabel: "Premium Brokers · nábor do týmu",
  headline:
    "Staň se finančním poradcem v týmu, kde dostaneš leady, zaškolení a reálnou podporu",
  subheadline:
    "Hledám nové lidi do týmu v Praze, Ústeckém kraji a okolí. Praxe není nutná — důležitý je drive, komunikace a chuť budovat vlastní byznys.",
  ctaPrimary: "Zjistit, jestli se hodím",
  ctaMicrocopy: "Krátký dotazník na 2 minuty · bez CV · ozvu se osobně",
  secondaryLinkLabel: "Jak spolupráce funguje",
  secondaryScrollTargetId: RECRUITMENT_HOW_IT_WORKS_ID,
  imageSrc: "/img/FormularFoto.png",
  imageAlt: "Marek Příbramský — finance a tým Premium Brokers",
  usePlaceholderPortrait: false,
} as const;

/** Konverzní karta pod hero (above the fold) */
export const RECRUITMENT_CONVERSION_CARD = {
  title: "Ověř si za 2 minuty, jestli dává spolupráce smysl",
  bullets: [
    "6 krátkých otázek",
    "bez nahrávání životopisu",
    "vhodné i bez praxe ve financích",
    "osobně se ti ozvu",
  ],
  cta: "Spustit krátký dotazník",
} as const;

export type RecruitmentHowStep = { title: string; body: string };

export const RECRUITMENT_HOW_IT_WORKS = {
  title: "Jak spolupráce funguje",
  steps: [
    {
      title: "Krátce zjistíme, jestli si sedneme",
      body: "Projdeme tvůj kontext a očekávání — nejdřív lidsky, ne papírově.",
    },
    {
      title: "Ukážu ti systém práce, odměňování a podporu",
      body: "Transparentně si řekneme, jak to u nás funguje a co od tebe budu čekat já i tým.",
    },
    {
      title: "Dostaneš zaškolení a praxi na reálných schůzkách",
      body: "Nenechám tě „viset“ — máš proces, mentoring a prostor se naučit to v praxi.",
    },
    {
      title: "Postupně buduješ vlastní klientelu a příjem",
      body: "Cílem je dlouhodobě stabilní výsledek — bez zbytečných umělých stropů.",
    },
  ] satisfies RecruitmentHowStep[],
} as const;

export const RECRUITMENT_TRUST_PILLS = [
  "Praxe není nutná",
  "Bez životopisu",
  "Ozvu se osobně",
  "Finance + reality + týmové zázemí",
  "Pobočky: Praha, Jihlava, Roudnice nad Labem, Litoměřice, Štětí, Lovosice",
] as const;

export const RECRUITMENT_BENEFITS_SECTION = {
  title: "Co u nás získáš",
  subtitle:
    "Konkrétní systém podpory a obchodu — ne „motivační omáčka“. Výsledky závisí na tobě, aktivitě a zapracování.",
} as const;

export const RECRUITMENT_BENTO_BENEFITS: RecruitmentBentoBenefit[] = [
  {
    icon: "trending",
    title: "Leady a obchodní příležitosti",
    desc: "Přístup k leadům a šancím domlouvat si schůzky — aby sis nemusel všechno tahat úplně od nuly.",
    theme: "light",
    accent: "cyan",
  },
  {
    icon: "book",
    title: "Zaškolení i bez praxe",
    desc: "Postupy, školení a „hands-on“ doprovázení — i když ve financích teprve začínáš.",
    theme: "light",
    accent: "cyan",
  },
  {
    icon: "users",
    title: "Tým a osobní vedení",
    desc: "Nejsi na to sám — máš zázemí lidí, kteří ti pomůžou zvednout úroveň komunikace i obchodu.",
    theme: "light",
    accent: "navy",
  },
  {
    icon: "shield",
    title: "Finance + reality = silnější pozice",
    desc: "Propojení financí a realit ti dává širší příležitosti a silnější vyjednávací pozici vůči klientům.",
    theme: "dark",
    accent: "cyan",
    showPbWatermark: true,
  },
  {
    icon: "trending",
    title: "78 000 Kč",
    desc: "Průměrná měsíční odměna v mém týmu (orientační údaj). Výsledek závisí na aktivitě, obchodních schopnostech a fázi zapracování — není to garantovaný příjem.",
    theme: "dark",
    accent: "gold",
  },
];

/** Sekce nad týmovou fotkou */
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

/** Blok výzvy pod týmovou fotkou */
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

export const RECRUITMENT_FOR_WHO = {
  sectionTitle: "Pro koho to je — a komu ne",
  forTitle: "Pro tebe, pokud:",
  againstTitle: "Není pro tebe, pokud:",
  forBullets: [
    "rád komunikuješ s lidmi",
    "chceš pracovat na sobě",
    "zajímá tě obchod, finance nebo reality",
    "chceš budovat dlouhodobý byznys",
    "nečekáš výsledky bez aktivity",
  ],
  againstBullets: [
    "hledáš jistý příjem bez výkonu",
    "nechceš volat, scházet se a komunikovat",
    "nechceš se učit nové věci",
    "čekáš rychlé peníze bez disciplíny",
  ],
  cta: "Chci zjistit, jestli se hodím",
} as const;

export const RECRUITMENT_QUIZ_HEADER = {
  title: "Krátké ověření spolupráce",
  intro:
    "Vyplnění zabere přibližně 2 minuty. Nejde o závaznou přihlášku — jen zjistíme, jestli dává smysl si zavolat.",
} as const;

export const RECRUITMENT_STICKY_CTA = {
  label: "Zjistit, jestli se hodím",
} as const;

export const WIZARD_STEPS: WizardQuestionStep[] = [
  {
    kind: "choice",
    id: "q_interest",
    question: "Co tě na spolupráci nejvíc zajímá?",
    options: [
      { value: "vydelek", label: "Chci lépe vydělávat" },
      { value: "zmena_oboru", label: "Chci změnit obor" },
      { value: "fin_lepsi_zazemi", label: "Už jsem ve financích a chci lepší zázemí" },
      { value: "nezavazne", label: "Chci si jen nezávazně zjistit možnosti" },
    ],
  },
  {
    kind: "choice",
    id: "q_sales",
    question: "Máš zkušenost s obchodem nebo komunikací s klienty?",
    options: [
      { value: "ano", label: "Ano" },
      { value: "trochu", label: "Trochu" },
      { value: "ne_ucit", label: "Ne, ale chci se to naučit" },
    ],
  },
  {
    kind: "choice",
    id: "q_time",
    question: "Kolik času tomu reálně chceš dát?",
    options: [
      { value: "naplno", label: "Naplno" },
      { value: "pri_praci", label: "Při práci" },
      { value: "nevim", label: "Zatím nevím" },
    ],
  },
  {
    kind: "choice",
    id: "q_region",
    question: "V jakém regionu působíš?",
    options: [
      { value: "praha", label: "Praha" },
      { value: "ustecky", label: "Ústecký kraj" },
      { value: "vysocina", label: "Vysočina" },
      { value: "jiny", label: "Jiný region" },
    ],
  },
  {
    kind: "choice",
    id: "q_priority",
    question: "Co je pro tebe nejdůležitější?",
    options: [
      { value: "prijem", label: "Vyšší příjem" },
      { value: "svoboda", label: "Svoboda" },
      { value: "tym", label: "Tým" },
      { value: "knowhow", label: "Know-how" },
      { value: "znacka", label: "Silná značka" },
      { value: "rust", label: "Dlouhodobý růst" },
    ],
  },
  {
    kind: "choice",
    id: "q_start_timing",
    question: "Jak brzo bys ideálně začal?",
    options: [
      { value: "hned", label: "Co nejdřív" },
      { value: "tydny", label: "Během pár týdnů" },
      { value: "informace", label: "Teď jen informace, bez tlaku" },
    ],
  },
];

export const CONTACT_STEP_COPY = {
  title: "Poslední krok: kontakt",
  subtitle: "Napiš mi, jak se jmenuješ a jak tě mám ozvat — poznámku vyplň jen pokud chceš.",
} as const;

export const WIZARD_SUCCESS_COPY = {
  title: "Díky, mám to.",
  body: "Ozvu se ti osobně a pokud bude dávat smysl si sednout, krátce probereme možnosti spolupráce.",
} as const;

export const WIZARD_SUBMIT_LABEL = "Odeslat a domluvit první kontakt";
