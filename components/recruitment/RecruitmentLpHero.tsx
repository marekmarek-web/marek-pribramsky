"use client";

import Image from "next/image";
import { ArrowRight, Image as ImageIcon, Sparkles } from "lucide-react";
import { RECRUITMENT_HERO } from "@/components/recruitment/recruitment-data";

const QUIZ_SECTION_ID = "dotaznik-sekce";

export function RecruitmentLpHero() {
  const scrollToQuiz = () => {
    const el = document.getElementById(QUIZ_SECTION_ID);
    if (el) {
      const yOffset = -40;
      const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <section className="relative overflow-hidden pt-10 pb-16 md:pt-16 md:pb-24 lg:pt-20 lg:pb-28">
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-full max-w-4xl -translate-x-1/2 rounded-full opacity-40 blur-[120px]"
        style={{ background: "radial-gradient(circle, #EAF3FF 0%, transparent 70%)" }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="relative max-w-2xl lg:col-span-7">
            <span className="mb-8 inline-flex items-center gap-2 rounded-full border border-brand-line bg-white px-4 py-2 text-sm font-semibold text-brand-navyLight shadow-sm">
              <Sparkles size={16} className="text-brand-gold" aria-hidden />
              {RECRUITMENT_HERO.badgeLabel}
            </span>

            <h1 className="mb-8 text-4xl font-extrabold leading-[1.05] tracking-tight text-brand-text md:text-5xl lg:text-[4rem]">
              {RECRUITMENT_HERO.titleBefore}{" "}
              <span className="relative inline-block text-gradient-shimmer-brand">
                {RECRUITMENT_HERO.titleGradient}
              </span>
              {" "}
              <br className="hidden md:block" />
              {RECRUITMENT_HERO.titleAfterLine}
            </h1>

            <p className="mb-12 max-w-xl text-lg font-light leading-relaxed text-slate-500 md:text-xl">
              {RECRUITMENT_HERO.subtitle}
              <span className="mt-4 block font-semibold text-brand-navy">{RECRUITMENT_HERO.subtitleEmphasis}</span>
            </p>

            <button
              type="button"
              onClick={scrollToQuiz}
              className="group relative inline-flex items-center gap-4 overflow-hidden rounded-full px-10 py-5 font-semibold text-white transition-all duration-500 hover:scale-[1.02]"
              style={{
                background: "linear-gradient(135deg, #1D2354 0%, #2A3366 100%)",
                boxShadow: "0 10px 30px -10px #1D2354",
              }}
            >
              <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 ease-in-out group-hover:translate-x-[100%]" />
              <span className="relative z-10 flex items-center gap-3 text-lg">
                {RECRUITMENT_HERO.ctaLabel}
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden />
              </span>
            </button>
          </div>

          <div className="relative mx-auto mt-10 w-full max-w-md lg:col-span-5 lg:ml-auto lg:mt-0">
            <div
              className="absolute -inset-4 rounded-[2.5rem] opacity-30 blur-2xl transition-all duration-500"
              style={{
                background: "linear-gradient(135deg, #4FC6F2, #FBBF24)",
              }}
              aria-hidden
            />
            {RECRUITMENT_HERO.usePlaceholderPortrait ? (
              <div
                className="relative flex aspect-[3/4] w-full flex-col items-center justify-center overflow-hidden rounded-[2rem] border-2 border-brand-navy bg-white/60 p-8 backdrop-blur-xl transition-transform duration-500"
                style={{ boxShadow: "0 25px 50px -12px rgba(0,0,0,0.1)" }}
              >
                <ImageIcon size={56} className="mb-5 opacity-50 text-brand-navyLight" aria-hidden />
                <p className="mb-3 text-center text-xs font-bold uppercase tracking-[0.2em] text-brand-navy">Fotografie</p>
                <p className="max-w-[220px] text-center text-xs font-medium text-brand-muted opacity-80">
                  (Oblast vyhrazená pro profesionální portrét Marka Příbramského)
                </p>
              </div>
            ) : (
              <div
                className="relative aspect-[3/4] w-full overflow-hidden rounded-[2rem] border-2 border-brand-navy transition-transform duration-500"
                style={{ boxShadow: "0 25px 50px -12px rgba(0,0,0,0.1)" }}
              >
                <Image
                  src={RECRUITMENT_HERO.imageSrc}
                  alt={RECRUITMENT_HERO.imageAlt}
                  fill
                  className="object-cover object-[center_25%]"
                  sizes="(min-width: 1024px) 400px, 100vw"
                  priority
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
