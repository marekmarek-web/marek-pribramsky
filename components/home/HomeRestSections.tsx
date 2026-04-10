import Link from "next/link";
import { HomeTailSections } from "@/components/home/HomeTailSections";
import { WealthProjectionChart } from "@/components/home/WealthProjectionChart";

/** Zbytek úvodní stránky podle kořenového `index.html` (kromě hero a loaderu). */
export function HomeRestSections() {
  return (
    <>
      <section id="spoluprace" className="py-12 sm:py-16 md:py-20 lg:py-28 xl:py-32 bg-white relative overflow-hidden scroll-mt-28 md:scroll-mt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14 lg:mb-20 animate-fade-in-up">
            <h2 className="section-title font-bold text-brand-text mb-4">Můj postup</h2>
            <p className="text-brand-muted section-desc mx-auto text-lg leading-relaxed">
              Jasný proces od analýzy až po dlouhodobý servis.
            </p>
          </div>
          <div
            id="postup-bento"
            className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-10 sm:mb-14 lg:mb-20"
          >
            <div
              className="animate-fade-in-up postup-item group relative rounded-2xl bg-gradient-to-br from-brand-background to-white border border-brand-border p-6 sm:p-8 lg:p-14 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden"
              data-delay="0"
            >
              <span className="postup-number" aria-hidden>
                1
              </span>
              <div className="relative z-10">
                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-brand-cyan/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-brand-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-brand-text">Audit majetku a portfolia</h3>
                </div>
                <p className="text-brand-muted leading-relaxed">
                  Projdeme vaše smlouvy, fondy a cíle. Zaměřím se na skryté poplatky a neefektivní alokaci kapitálu, která
                  zpomaluje váš růst.
                </p>
              </div>
            </div>
            <div
              className="animate-fade-in-up postup-item group relative rounded-2xl bg-gradient-to-br from-brand-background to-white border border-brand-border p-6 sm:p-8 lg:p-14 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden"
              data-delay="1"
            >
              <span className="postup-number" aria-hidden>
                2
              </span>
              <div className="relative z-10">
                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-brand-cyan/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-brand-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-brand-text">Strategie a diverzifikace</h3>
                </div>
                <p className="text-brand-muted leading-relaxed">
                  Společně nastavíme váš investiční profil (Mírný, Vyvážený, Dynamický) a navrhnu řešení s ověřenými nástroji
                  jako Atris, CREIF nebo MSCI World ETF.
                </p>
              </div>
            </div>
            <div
              className="animate-fade-in-up postup-item group relative rounded-2xl bg-gradient-to-br from-brand-background to-white border border-brand-border p-6 sm:p-8 lg:p-14 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden"
              data-delay="2"
            >
              <span className="postup-number" aria-hidden>
                3
              </span>
              <div className="relative z-10">
                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-brand-cyan/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-brand-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-brand-text">Spuštění a dlouhodobý růst</h3>
                </div>
                <p className="text-brand-muted leading-relaxed">
                  Pomohu s hladkou implementací zvolené strategie. Zajistím pravidelné kontroly a úpravy, aby váš majetek
                  rostl efektivně i za 5, 10 či 15 let.
                </p>
              </div>
            </div>
          </div>
          <div className="text-center">
            <Link
              href="/#kontakt"
              className="lead-cta-btn inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-white font-bold transition-all duration-300 no-underline"
            >
              Domluvit úvodní konzultaci
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
      <section
        id="investicni-projekce"
        className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28 bg-gradient-to-br from-brand-navy/95 via-brand-navy/85 to-brand-cyan/50 relative overflow-hidden"
      >
        <div className="absolute bottom-0 right-0 w-[500px] h-[300px] bg-brand-cyan/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-content mx-auto px-4 sm:px-6 relative z-10">
          <div className="lg:flex lg:items-center lg:gap-16">
            <div className="lg:w-1/2 mb-10 lg:mb-0">
              <span className="text-brand-cyan font-bold tracking-widest uppercase text-xs">Investiční filozofie</span>
              <h2 className="section-title font-bold text-white mt-2 mb-6">Jak to dělají nejbohatší fondy světa?</h2>
              <p className="text-white/80 mb-6 text-lg leading-relaxed">
                Inspiruji se strategií jako je{" "}
                <a
                  href="https://www.nbim.no/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-cyan hover:text-brand-cyan/80 font-bold underline decoration-brand-cyan/30"
                >
                  Norský ropný fond
                </a>
                . Diverzifikace, nízké náklady a dlouhodobý horizont.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-brand-cyan/20 flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-3.5 h-3.5 text-brand-cyan" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <span className="text-white">Investice do globálních ETF fondů</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-brand-cyan/20 flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-3.5 h-3.5 text-brand-cyan" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <span className="text-white">Složené úročení pracující pro vás</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-brand-cyan/20 flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-3.5 h-3.5 text-brand-cyan" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <span className="text-white">Okamžitá dostupnost peněz (likvidita)</span>
                </li>
              </ul>
              <Link
                href="/investicnikalkulacka"
                className="lead-cta-btn inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-white font-bold transition-all duration-300 no-underline"
              >
                Spočítat vlastní výnosy
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            <div className="lg:w-1/2 chart-card-container">
              <div className="chart-card-tilt bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl">
                <div className="chart-glow" aria-hidden />
                <div className="relative z-10">
                  <div className="mb-6 border-b border-white/25 pb-4">
                    <h3 className="text-lg font-bold text-white">Projekce majetku (10 let)</h3>
                    <p className="text-xs text-white/70">Reálný dopad složeného úročení</p>
                  </div>
                  <WealthProjectionChart />
                  <div className="mt-4 flex flex-wrap justify-between gap-2 text-xs font-bold">
                    <div className="wealth-legend-average flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" />
                      Běžný účet
                    </div>
                    <div className="wealth-legend-strategy flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" />
                      Strategie fondů
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <HomeTailSections />
    </>
  );
}
