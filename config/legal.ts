/**
 * Jednotný zdroj právních a regulatorních textů (footer, formuláře, disclaimery).
 * Premium Brokers s.r.o. ≠ vázaný zástupce BEplan; regulované služby vykonává konkrétní fyzická osoba v síti BEplan.
 */

const regulatoryDisclaimerFullParagraphs = [
  "Premium Brokers s.r.o., IČO: 07795467, není vázaným zástupcem BEplan finanční plánování s.r.o., IČO: 05779944. Společnost Premium Brokers s.r.o. je zastoupena Ing. Markem Příbramským, jednatelem.",
  "Ing. Marek Příbramský, IČO: 02024870, je vázaným zástupcem samostatného zprostředkovatele BEplan finanční plánování s.r.o., IČO: 05779944.",
  "Premium Brokers s.r.o. svým jménem nevykonává regulované finanční služby; poskytuje servisní a provozní zázemí spolupracujícím podnikajícím fyzickým osobám.",
  "Registrované produktové a partnerské vazby se vztahují ke konkrétním registrovaným fyzickým osobám, nikoli přímo ke společnosti Premium Brokers s.r.o.",
  "Činnost vázaného zástupce v registru zprostředkovatele probíhá v rámci: pojištění (zákon č. 170/2018 Sb.), spotřebitelské úvěry (zákon č. 257/2016 Sb.), investiční služby a produkty (zákon č. 256/2004 Sb.), doplňkové penzijní spoření (zákon č. 427/2011 Sb.).",
] as const;

export const legalConfig = {
  premiumBrokersLegalName: "Premium Brokers s.r.o.",
  premiumBrokersIco: "07795467",
  personalName: "Ing. Marek Příbramský",
  personalIco: "02024870",
  partnerLegalName: "BEplan finanční plánování s.r.o.",
  partnerIco: "05779944",
  regulatoryDisclaimerFullParagraphs,
  /** Kompletní text jedním blokem (např. meta, export). */
  regulatoryDisclaimerFull: regulatoryDisclaimerFullParagraphs.join(" "),
  regulatoryDisclaimerShort:
    "Premium Brokers s.r.o. (IČO 07795467) není vázaným zástupcem BEplan. Ing. Marek Příbramský (IČO 02024870) je vázaným zástupcem BEplan finanční plánování s.r.o. (IČO 05779944). Premium Brokers nevykonává regulované služby vlastním jménem; jde o servisní a provozní zázemí pro spolupracující OSVČ. Registrace VZ: pojištění (170/2018 Sb.), spotřebitelské úvěry (257/2016 Sb.), investiční služby (256/2004 Sb.), penzijní spoření (427/2011 Sb.).",
  regulatoryDisclaimerShortParagraphs: [
    "Premium Brokers s.r.o., IČO: 07795467, není vázaným zástupcem BEplan finanční plánování s.r.o., IČO: 05779944. Společnost Premium Brokers s.r.o. je zastoupena Ing. Markem Příbramským, jednatelem.",
    "Ing. Marek Příbramský, IČO: 02024870, je vázaným zástupcem samostatného zprostředkovatele BEplan finanční plánování s.r.o., IČO: 05779944.",
    "Premium Brokers s.r.o. svým jménem nevykonává regulované finanční služby; poskytuje servisní a provozní zázemí spolupracujícím podnikajícím fyzickým osobám. Partneři a produktové vazby se vztahují ke konkrétním registrovaným fyzickým osobám, nikoli přímo ke společnosti Premium Brokers s.r.o.",
    "Činnost vázaného zástupce: pojištění (zákon č. 170/2018 Sb.), spotřebitelské úvěry (zákon č. 257/2016 Sb.), investiční služby a produkty (zákon č. 256/2004 Sb.), doplňkové penzijní spoření (zákon č. 427/2011 Sb.).",
  ],
  partnerPrivacyUrl: "https://www.beplan.cz/ochrana-osobnich-udaju/",
  credit: {
    label: "M2DigitalAgency",
    href: "https://www.m2digitalagency.cz/",
  },
} as const;
