"use client";

import gsap from "gsap";
import Image from "next/image";
import { useEffect } from "react";

export function HeroHomeSection({ booted }: { booted: boolean }) {
  useEffect(() => {
    if (!booted) return;
    const revealLines = document.querySelectorAll(".text-reveal-line");
    if (revealLines.length && typeof gsap !== "undefined") {
      gsap.to(revealLines, {
        y: "0%",
        duration: 1.2,
        stagger: 0.1,
        ease: "power4.out",
        delay: 0.2,
      });
      const heroSub = document.querySelector(".hero-subtitle");
      if (heroSub) {
        gsap.to(heroSub, { opacity: 1, duration: 1, delay: 1, ease: "power2.out" });
      }
    }
  }, [booted]);

  return (
    <section
      id="hero"
      className="hero-aurora hero-entry relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-brand-navy"
    >
      <div className="hero-image-wrapper absolute inset-3 z-0 overflow-hidden rounded-[1rem] shadow-2xl sm:inset-4 md:inset-6">
        <div className="absolute inset-0 bg-brand-navy" aria-hidden />
        <div className="relative z-[1] h-[min(82dvh,880px)] min-h-[320px] w-full sm:h-[min(86dvh,900px)] md:h-[min(88vh,920px)]">
          <Image
            src="/img/hero3.jpg"
            alt="Marek Příbramský"
            fill
            priority
            className="hero-img-full object-cover object-[46%_18%] max-sm:object-[58%_22%] sm:object-[45%_16%] md:object-[44%_14%] lg:object-[42%_12%] xl:object-[40%_10%]"
            sizes="100vw"
          />
        </div>
        <div
          className="hero-overlay pointer-events-none absolute inset-0 z-[2] bg-gradient-to-b from-black/40 via-black/32 to-black/52"
          aria-hidden
        />
      </div>

      <div className="hero-content relative z-10 mx-auto w-full max-w-4xl px-4 pt-16 text-center max-sm:px-4 max-sm:pt-12 sm:px-6 md:max-w-5xl md:pt-20 lg:pt-[4.5rem]">
        <h1 className="hero-title mx-auto max-w-[22ch] text-4xl font-bold leading-[1.1] text-white hero-text-shadow max-sm:max-w-none max-sm:text-[clamp(2rem,8vw,3rem)] max-sm:leading-snug sm:max-w-[20ch] md:max-w-none md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl">
          <div className="text-reveal-mask">
            <span className="text-reveal-line">Jsem</span>
          </div>
          <div className="text-reveal-mask">
            <span className="text-reveal-line text-gradient-shimmer-blue">Marek Příbramský.</span>
          </div>
        </h1>
        <p className="hero-subtitle mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/92 opacity-0 hero-text-shadow max-sm:mt-4 max-sm:text-base sm:mt-8 md:text-xl">
          Pomůžu Vám splnit Vaše cíle.
        </p>

        <div className="hero-badges-center mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-3 max-sm:mt-5 max-sm:gap-2">
          <div
            className="trust-badge trust-badge-float inline-flex items-center gap-2 rounded-full px-4 py-2 md:px-5 md:py-2.5"
            style={{ animationDelay: "0s" }}
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-cyan/20 text-brand-navy md:h-7 md:w-7">
              <svg className="h-3.5 w-3.5 md:h-4 md:w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-xs font-semibold text-brand-navy md:text-sm">13 let zkušeností</span>
          </div>
          <div
            className="trust-badge trust-badge-float inline-flex items-center gap-2 rounded-full px-4 py-2 md:px-5 md:py-2.5"
            style={{ animationDelay: "1.5s" }}
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 md:h-7 md:w-7">
              <svg className="h-3.5 w-3.5 md:h-4 md:w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18M18 17l-5-5-4 4-3-3" />
              </svg>
            </div>
            <span className="text-xs font-semibold text-brand-navy md:text-sm">Aktivní správa portfolií</span>
          </div>
          <div
            className="trust-badge trust-badge-float inline-flex items-center gap-2 rounded-full px-4 py-2 md:px-5 md:py-2.5"
            style={{ animationDelay: "3s" }}
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-gold/20 text-brand-gold md:h-7 md:w-7">
              <svg className="h-3.5 w-3.5 md:h-4 md:w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <span className="text-xs font-semibold text-brand-navy md:text-sm">200+ mil. Kč v mandátu</span>
          </div>
        </div>
      </div>
      <a
        href="#spoluprace"
        className="hero-scroll-link absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-white/85 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent hero-text-shadow max-sm:bottom-4"
        aria-label="Posunout dolů na sekci spolupráce"
      >
        <svg className="h-8 w-8 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </a>
    </section>
  );
}
