"use client";

import gsap from "gsap";
import Image from "next/image";
import { useEffect } from "react";
import { HOME_HERO } from "@/lib/media/home-hero";

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
      className="hero-aurora hero-stack-sm hero-entry relative flex min-h-[100dvh] w-full items-center justify-center overflow-hidden bg-brand-navy max-sm:flex-col max-sm:items-stretch max-sm:justify-start max-sm:pb-4"
    >
      <div className="hero-image-wrapper absolute inset-3 z-0 overflow-hidden rounded-[1rem] shadow-2xl sm:inset-4 md:inset-6 max-sm:relative max-sm:order-1 max-sm:z-0 max-sm:mx-3 max-sm:mt-[4.5rem] max-sm:mb-3 max-sm:h-[min(38vh,320px)] max-sm:min-h-[220px] max-sm:shadow-2xl">
        <div className="absolute inset-0 bg-brand-navy" aria-hidden />
        <div className="absolute inset-0 z-[1] min-h-[240px]">
          <Image
            src={HOME_HERO.src}
            alt={HOME_HERO.alt}
            fill
            priority
            className={HOME_HERO.imageClassName}
            style={HOME_HERO.imageStyle}
            sizes={HOME_HERO.sizes}
            quality={HOME_HERO.quality}
          />
        </div>
        <div className={`${HOME_HERO.overlayClassName}`} aria-hidden />
      </div>

      <div className="hero-content relative z-10 mx-auto w-full max-w-4xl px-4 pt-16 text-center max-sm:order-2 max-sm:px-4 max-sm:pt-3 max-sm:pb-2 sm:px-6 md:max-w-5xl md:px-8 md:pt-20 lg:pt-[4.25rem] xl:pt-[4.5rem]">
        <h1 className="hero-title mx-auto max-w-[22ch] text-4xl font-bold leading-[1.12] text-white hero-text-shadow max-sm:max-w-none max-sm:text-[clamp(1.75rem,7vw,2.75rem)] max-sm:leading-snug sm:max-w-[20ch] md:max-w-3xl md:text-5xl md:leading-[1.1] lg:max-w-none lg:text-6xl lg:leading-[1.08] xl:text-7xl 2xl:text-8xl">
          <div className="text-reveal-mask">
            <span className="text-reveal-line">Jsem</span>
          </div>
          <div className="text-reveal-mask">
            <span className="text-reveal-line">
              <span className="hero-name-gradient inline-block">Marek Příbramský.</span>
            </span>
          </div>
        </h1>
        <p className="hero-subtitle hero-subtitle-grid mx-auto mt-6 max-w-2xl rounded-2xl px-5 py-4 text-lg leading-relaxed text-white opacity-0 hero-text-shadow max-sm:mt-3 max-sm:px-3 max-sm:py-3 max-sm:text-sm sm:mt-7 sm:px-6 sm:py-5 md:mt-8 md:text-xl lg:mt-7">
          Finanční plánování pro rodiny a firmy — srozumitelně, bez tlaku na produkt.
          <span className="mt-3 block text-base text-white/95 max-sm:mt-2 max-sm:text-sm md:text-lg">
            Sjednotíme cíle, rizika a nástroje tak, aby dávaly smysl vaší situaci.
          </span>
        </p>

        <div className="hero-badges-center mx-auto mt-8 grid max-w-3xl grid-cols-2 justify-items-center gap-2 max-sm:mt-4 max-sm:max-w-none max-sm:gap-x-2 max-sm:gap-y-2 md:mt-7 md:flex md:flex-wrap md:justify-center md:gap-3 lg:mt-8">
          <div
            className="trust-badge trust-badge-float inline-flex w-full max-w-[min(100%,11rem)] items-center justify-center gap-1.5 rounded-full px-3 py-1.5 max-sm:min-h-0 max-sm:flex-nowrap max-sm:px-2.5 max-sm:py-1.5 md:inline-flex md:w-auto md:max-w-none md:gap-2 md:px-5 md:py-2.5"
            style={{ animationDelay: "0s" }}
          >
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-cyan/20 text-brand-navy md:h-7 md:w-7">
              <svg className="h-3 w-3 md:h-3.5 md:w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-[11px] font-semibold leading-tight text-brand-navy md:text-sm">13 let zkušeností</span>
          </div>
          <div
            className="trust-badge trust-badge-float inline-flex w-full max-w-[min(100%,11rem)] items-center justify-center gap-1.5 rounded-full px-3 py-1.5 max-sm:min-h-0 max-sm:flex-nowrap max-sm:px-2.5 max-sm:py-1.5 md:inline-flex md:w-auto md:max-w-none md:gap-2 md:px-5 md:py-2.5"
            style={{ animationDelay: "1.5s" }}
          >
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 md:h-7 md:w-7">
              <svg className="h-3 w-3 md:h-3.5 md:w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18M18 17l-5-5-4 4-3-3" />
              </svg>
            </div>
            <span className="text-[11px] font-semibold leading-tight text-brand-navy md:text-sm">Aktivní správa portfolií</span>
          </div>
          <div
            className="trust-badge trust-badge-float col-span-2 inline-flex w-full max-w-[min(100%,20rem)] items-center justify-center justify-self-center gap-1.5 rounded-full px-3 py-1.5 max-sm:min-h-0 max-sm:flex-nowrap max-sm:px-2.5 max-sm:py-1.5 md:inline-flex md:w-auto md:max-w-none md:gap-2 md:px-5 md:py-2.5"
            style={{ animationDelay: "3s" }}
          >
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-gold/20 text-brand-gold md:h-7 md:w-7">
              <svg className="h-3 w-3 md:h-3.5 md:w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <span className="text-[11px] font-semibold leading-tight text-brand-navy md:text-sm">200+ mil. Kč v mandátu</span>
          </div>
        </div>
      </div>
      <a
        href="#spoluprace"
        className="hero-scroll-link absolute bottom-[max(2rem,env(safe-area-inset-bottom))] left-1/2 z-10 -translate-x-1/2 text-white/85 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent hero-text-shadow max-sm:relative max-sm:order-3 max-sm:bottom-auto max-sm:left-1/2 max-sm:mt-2 max-sm:mb-1 max-sm:h-10 max-sm:-translate-x-1/2"
        aria-label="Přejít na sekci Jak pracuji"
      >
        <svg className="h-8 w-8 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </a>
    </section>
  );
}
