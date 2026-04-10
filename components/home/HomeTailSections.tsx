import Image from "next/image";
import { Suspense } from "react";
import { LeadConsultationForm } from "@/components/forms/LeadConsultationForm";
import { HomeBlogSection, HomeBlogSectionFallback } from "@/components/home/HomeBlogSection";
import { timelineEntries } from "@/components/home/home-data";
import { PersonaSwitcher } from "@/components/home/PersonaSwitcher";
import { ReviewsMarquee } from "@/components/home/ReviewsMarquee";
import { ServicesAccordion } from "@/components/home/ServicesAccordion";

/** Sekce #proc-ja až #kontakt z kořenového `index.html`. */
export function HomeTailSections() {
  return (
    <>
      <section id="proc-ja" className="persona-section relative overflow-hidden py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28">
        <div className="persona-section-bg" aria-hidden />
        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center lg:mb-14">
            <h2 className="section-title mb-4 font-bold text-brand-text">Pro koho</h2>
            <p className="section-desc mx-auto text-lg leading-relaxed text-brand-muted">
              Vyberte profil — zobrazí se konkrétní přínosy, situace a další krok.
            </p>
          </div>
          <PersonaSwitcher />
        </div>
      </section>

      <SluzbySection />

      <MojeCestaSection />

      <PobockySection />

      <ReferenceSection />

      <Suspense fallback={<HomeBlogSectionFallback />}>
        <HomeBlogSection />
      </Suspense>

      <FaqSection />

      <KontaktSection />
    </>
  );
}

function SluzbySection() {
  return (
    <section id="sluzby" className="sluzby-section-bg relative overflow-visible py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32">
      <div className="absolute inset-0 z-[1] bg-black/78" aria-hidden />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="animate-fade-in-up mb-10 text-center lg:mb-12">
          <span className="mb-4 inline-block rounded-full border border-white/70 bg-white/50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white shadow-sm backdrop-blur-md">
            PORTFOLIO
          </span>
          <h2 className="section-title mb-2 font-bold text-white drop-shadow-md">Moje služby</h2>
          <p className="mx-auto max-w-2xl text-sm text-white/85 sm:text-base">
            Rozklikněte službu — krátký popis a jasný další krok.
          </p>
        </div>
        <ServicesAccordion />
      </div>
    </section>
  );
}

function MojeCestaSection() {
  return (
    <section
      id="moje-cesta"
      className="moje-cesta-section relative overflow-hidden bg-[#EAF3FF] py-12 text-brand-navy sm:py-16 md:py-20 lg:py-24"
      style={{ contain: "layout" }}
      aria-label="Moje cesta"
    >
      <div className="moje-cesta-bg-deco" aria-hidden />
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center sm:mb-10 lg:mb-12">
          <h2 className="text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">
            Moje cesta &
            <br />
            <span className="font-bold italic text-brand-cyan">Klíčové milníky</span>
          </h2>
        </div>
        <div
          className="moje-cesta-box max-h-[min(72vh,680px)] min-h-[360px] overflow-y-auto rounded-3xl border border-slate-200/90 bg-white p-4 shadow-sm sm:p-6 lg:p-8"
          style={{ scrollbarWidth: "thin", isolation: "isolate" }}
        >
          {timelineEntries.map((it, idx) => (
            <div
              key={it.year}
              className={`timeline-section flex flex-col gap-6 md:flex-row md:gap-10 ${idx < timelineEntries.length - 1 ? "mb-14 border-b border-slate-100 pb-14 md:mb-16 md:pb-16" : ""}`}
            >
              <div className="shrink-0 md:sticky md:top-24 md:w-[30%] md:self-start">
                <div className={`timeline-year text-5xl font-black sm:text-6xl ${it.yearClass ?? "text-slate-200"}`}>{it.year}</div>
              </div>
              <div className="timeline-content min-w-0 md:w-[70%]">
                <div className="relative mb-4 aspect-[16/10] w-full overflow-hidden rounded-2xl bg-slate-100">
                  <Image
                    src={it.img}
                    alt={it.title}
                    fill
                    className={`object-cover ${it.imagePositionClass}`}
                    sizes="(max-width: 768px) 100vw, 640px"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-xl font-bold text-brand-navy sm:text-2xl">{it.title}</h3>
                <p className="mt-2 text-slate-600 sm:text-[1.02rem]">{it.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PobockySection() {
  return (
    <section id="pobocky" className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28 bg-white">
      <div className="max-w-content mx-auto px-4 sm:px-6">
        <div className="text-center mb-14 lg:mb-16 animate-fade-in-up">
          <h2 className="section-title font-bold text-brand-text mb-4">Kde nás najdete</h2>
          <p className="text-brand-muted section-desc mx-auto text-lg leading-relaxed">Naše pobočky v Roudnici, Praze a okolí.</p>
        </div>
        <div className="bento-grid">
          <a
            href="https://www.google.com/maps?q=N%C3%A1m.+Jana+z+Dra%C5%BEic+99,+413+01+Roudnice+nad+Labem"
            target="_blank"
            rel="noopener noreferrer"
            className="bento-card bento-card--large"
          >
            <div className="bento-card-img">
              <Image src="/img/rce.jpg" alt="Roudnice nad Labem – náměstí" width={800} height={600} loading="lazy" />
              <div className="bento-card-overlay" />
            </div>
            <div className="bento-card-content">
              <span className="bento-badge">Sídlo společnosti</span>
              <h3 className="bento-city">Roudnice nad Labem</h3>
              <address className="bento-address">
                Nám. Jana z Dražic 99
                <br />
                413 01 Roudnice nad Labem
              </address>
            </div>
          </a>
          <a href="https://www.google.com/maps?q=%C5%BDateck%C3%A1+55%2F14,+110+00+Praha" target="_blank" rel="noopener noreferrer" className="bento-card">
            <div className="bento-card-img">
              <Image src="/img/praha.jpg" alt="Praha – panorama od Petřína" width={600} height={400} />
              <div className="bento-card-overlay" />
            </div>
            <div className="bento-card-content">
              <h3 className="bento-city">Praha</h3>
              <address className="bento-address">
                Žatecká 55/14
                <br />
                110 00 Praha
              </address>
            </div>
          </a>
          <a href="https://www.google.com/maps?q=5.+kv%C4%9Btna+10,+412+01+Litom%C4%9B%C5%99ice" target="_blank" rel="noopener noreferrer" className="bento-card">
            <div className="bento-card-img">
              <Image src="/img/lito.png" alt="Litoměřice – Mírové náměstí" width={600} height={400} loading="lazy" />
              <div className="bento-card-overlay" />
            </div>
            <div className="bento-card-content">
              <h3 className="bento-city">Litoměřice</h3>
              <address className="bento-address">
                5. května 10
                <br />
                412 01 Litoměřice
              </address>
            </div>
          </a>
          <a href="https://www.google.com/maps?q=U+Tr%C5%BEnice+701,+411+08+%C5%A0t%C4%9Bt%C3%AD" target="_blank" rel="noopener noreferrer" className="bento-card">
            <div className="bento-card-img">
              <Image src="/img/steti.jpg" alt="Štětí – region Litoměřicko" width={600} height={400} loading="lazy" />
              <div className="bento-card-overlay" />
            </div>
            <div className="bento-card-content">
              <h3 className="bento-city">Štětí</h3>
              <address className="bento-address">
                U Tržnice 701
                <br />
                411 08 Štětí
              </address>
            </div>
          </a>
          <div className="bento-card bento-card-coming">
            <div className="bento-card-img">
              <Image src="/img/lovo.jpg" alt="Lovosice – Lovoš a okolí" width={600} height={400} loading="lazy" />
              <div className="bento-card-overlay" />
            </div>
            <div className="bento-card-content">
              <h3 className="bento-city">Lovosice</h3>
              <p className="bento-coming">Brzy otevíráme</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ReferenceSection() {
  return (
    <section id="reference" className="py-16 lg:py-24 reference-section relative overflow-hidden">
      <div className="reference-container relative z-10">
        <div className="text-center mb-10 lg:mb-12 animate-fade-in-up">
          <span className="inline-block px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold mb-3">Google Recenze</span>
          <h2 className="section-title font-bold text-white mb-3">Reference</h2>
          <p className="text-white/80 text-base lg:text-lg max-w-xl mx-auto">Co říkají klienti o spolupráci se mnou.</p>
        </div>
        <div className="reference-marquee reference-marquee-white rounded-3xl border border-slate-200/80 bg-white py-10 px-2 md:px-4 relative overflow-hidden shadow-sm">
          <div className="reference-marquee-fade reference-marquee-fade-left" />
          <div className="reference-marquee-fade reference-marquee-fade-right" />
          <ReviewsMarquee />
        </div>
        <div className="text-center mt-8">
          <a
            href="https://www.google.com/search?q=Premium+Brokers+s.r.o.+Recenze&hl=cs-CZ#lkt=LocalPoiReviews"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-brand-navy text-white font-semibold text-sm hover:bg-brand-navy/90 transition"
          >
            Zobrazit všechny recenze na Google
          </a>
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section id="faq" className="faq-section" aria-labelledby="faq-title">
      <div className="faq-head">
        <h2 id="faq-title" className="section-title font-bold text-brand-text">
          Časté dotazy o finančním plánování
        </h2>
        <p className="faq-sub">
          Odpovědi na nejčastější otázky před prvním setkáním – investice, hypotéka, životní pojištění i firemní finance.
        </p>
      </div>
      <div className="faq-switcher" data-tabs role="tablist" aria-label="Kategorie dotazů">
        <span className="faq-bubble" aria-hidden />
        <button type="button" className="faq-tab active" role="tab" data-tab="price">
          Kolik to stojí?
        </button>
        <button type="button" className="faq-tab" role="tab" data-tab="plan">
          První plán
        </button>
        <button type="button" className="faq-tab" role="tab" data-tab="sign">
          Podpisy
        </button>
        <button type="button" className="faq-tab" role="tab" data-tab="existing">
          Stávající smlouvy
        </button>
        <button type="button" className="faq-tab" role="tab" data-tab="review">
          Revize
        </button>
      </div>
      <div className="faq-panels">
        <div className="faq-panel active" data-panel="price">
          <div className="faq-grid">
            <div className="faq-questions" role="list">
              <button type="button" className="faq-q active" data-answer="price-a1">
                Kolik stojí úvodní konzultace?
              </button>
              <button type="button" className="faq-q" data-answer="price-a2">
                Platí se finanční plán jednorázově, nebo průběžně?
              </button>
              <button type="button" className="faq-q" data-answer="price-a3">
                Jak poznám, že se mi to „vyplatí“?
              </button>
            </div>
            <div className="faq-answer" aria-live="polite">
              <div className="faq-a active" id="price-a1">
                Úvodní konzultace je nezávazná a bez poplatku. Na konci si řekneme, zda dává spolupráce smysl a jaký bude další postup.
              </div>
              <div className="faq-a" id="price-a2">
                Záleží na rozsahu spolupráce. Někdy stačí jednorázová analýza + nastavení, jindy dává smysl dlouhodobý servis (pravidelná kontrola, úpravy, změny smluv).
              </div>
              <div className="faq-a" id="price-a3">
                V praxi nejčastěji ušetříme na zbytečných/poplatkově drahých produktech, nastavíme rizika (pojistky) a cíleně srovnáme investice a hypotéku. Výsledky ukazujeme na konkrétních číslech.
              </div>
            </div>
          </div>
        </div>
        <div className="faq-panel" data-panel="plan">
          <div className="faq-grid">
            <div className="faq-questions" role="list">
              <button type="button" className="faq-q active" data-answer="plan-a1">
                Co si mám připravit na první schůzku?
              </button>
              <button type="button" className="faq-q" data-answer="plan-a2">
                Za jak dlouho mám hotový finanční plán?
              </button>
              <button type="button" className="faq-q" data-answer="plan-a3">
                Jak probíhá tvorba plánu krok za krokem?
              </button>
            </div>
            <div className="faq-answer" aria-live="polite">
              <div className="faq-a active" id="plan-a1">
                Stačí stručně: příjmy/výdaje, cíle (např. bydlení, rezerva, důchod) a jaké máte smlouvy (investice, pojistky, hypotéka). Když něco nemáte, dořešíme to spolu.
              </div>
              <div className="faq-a" id="plan-a2">
                Typicky v řádu dnů až jednotek týdnů podle složitosti. Vždy nejdřív uděláme rychlou orientaci a priority, a teprve pak detail.
              </div>
              <div className="faq-a" id="plan-a3">
                Nejdřív rychlá orientace a priority, pak detailní návrh. Projdeme vaši situaci, cíle a možnosti, a teprve pak sestavíme konkrétní doporučení.
              </div>
            </div>
          </div>
        </div>
        <div className="faq-panel" data-panel="sign">
          <div className="faq-grid">
            <div className="faq-questions" role="list">
              <button type="button" className="faq-q active" data-answer="sign-a1">
                Musím něco podepisovat hned na první schůzce?
              </button>
              <button type="button" className="faq-q" data-answer="sign-a2">
                Jak funguje online podpis a ověření?
              </button>
            </div>
            <div className="faq-answer" aria-live="polite">
              <div className="faq-a active" id="sign-a1">
                Ne. První konzultace je nezávazná. Pokud se rozhodnete pokračovat, vysvětlíme si konkrétní kroky a co který podpis znamená.
              </div>
              <div className="faq-a" id="sign-a2">
                Většinu věcí lze řešit online. Vysvětlím postup, pošlu podklady a vy podepíšete bezpečně přes ověřený proces dané instituce.
              </div>
            </div>
          </div>
        </div>
        <div className="faq-panel" data-panel="existing">
          <div className="faq-grid">
            <div className="faq-questions" role="list">
              <button type="button" className="faq-q active" data-answer="existing-a1">
                Má smysl řešit finance, když už mám investice/pojistky/hypotéku?
              </button>
              <button type="button" className="faq-q" data-answer="existing-a2">
                Budete mi hned rušit stávající smlouvy?
              </button>
            </div>
            <div className="faq-answer" aria-live="polite">
              <div className="faq-a active" id="existing-a1">
                Ano — často se dá zlepšit nákladovost, krytí rizik a nastavení strategie. Někdy stačí drobné úpravy, jindy dává smysl změna struktury.
              </div>
              <div className="faq-a" id="existing-a2">
                Ne. Nejdřív audit, pak doporučení s důvody a dopady. Rozhodnutí je vždy na vás.
              </div>
            </div>
          </div>
        </div>
        <div className="faq-panel" data-panel="review">
          <div className="faq-grid">
            <div className="faq-questions" role="list">
              <button type="button" className="faq-q active" data-answer="review-a1">
                Jak často děláte revizi finančního plánu?
              </button>
              <button type="button" className="faq-q" data-answer="review-a2">
                Co přesně se při revizi kontroluje?
              </button>
            </div>
            <div className="faq-answer" aria-live="polite">
              <div className="faq-a active" id="review-a1">
                Standardně 1× ročně nebo při změně situace (dítě, bydlení, podnikání, vyšší příjem, změna hypotéky).
              </div>
              <div className="faq-a" id="review-a2">
                Rezerva, cashflow, pojistná rizika, investiční strategie, hypotéka a cíle. Cílem je, aby plán odpovídal realitě a byl dlouhodobě funkční.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function KontaktSection() {
  return (
    <section
      id="kontakt"
      className="lead-form-section py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 relative overflow-hidden min-h-[520px] sm:min-h-[560px] lg:min-h-[640px] flex items-center"
    >
      <div className="lead-form-bg" aria-hidden />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 relative z-10 w-full">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden smart-cta-container">
          <div className="p-5 sm:p-8 lg:p-12 flex flex-col justify-center">
            <LeadConsultationForm />
          </div>
        </div>
      </div>
    </section>
  );
}
