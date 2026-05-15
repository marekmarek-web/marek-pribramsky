"use client";

import Image from "next/image";
import { ArrowRight, ChevronRight, Image as ImageIcon, Sparkles } from "lucide-react";
import {
  RECRUITMENT_CONVERSION_CARD,
  RECRUITMENT_HERO,
  RECRUITMENT_QUIZ_SECTION_ID,
} from "@/components/recruitment/recruitment-data";
import { scrollToKarieraQuiz } from "@/lib/recruitment/kariera-scroll";

export function RecruitmentLpHero() {
  const scrollToHowItWorks = () => {
    const id = RECRUITMENT_HERO.secondaryScrollTargetId;
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -72;
      const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <section className="relative overflow-hidden pt-10 pb-14 md:pt-14 md:pb-20 lg:pb-24">
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-full max-w-5xl -translate-x-1/2 rounded-full opacity-35 blur-[120px]"
        style={{ background: "radial-gradient(circle, #EAF3FF 0%, transparent 72%)" }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="relative max-w-2xl lg:col-span-7">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-line bg-white px-4 py-2 text-sm font-semibold text-[#07122F]/90 shadow-sm">
              <Sparkles size={16} className="text-brand-gold" aria-hidden />
              {RECRUITMENT_HERO.badgeLabel}
            </span>

            <h1 className="mb-6 text-balance text-4xl font-extrabold leading-[1.08] tracking-tight text-[#07122F] md:text-5xl lg:text-[3.15rem] xl:text-[3.35rem]">
              {RECRUITMENT_HERO.headline}
            </h1>

            <p className="mb-8 max-w-xl text-lg leading-relaxed text-slate-600 text-pretty md:text-xl">
              {RECRUITMENT_HERO.subheadline}
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
              <button
                type="button"
                onClick={() => scrollToKarieraQuiz(RECRUITMENT_QUIZ_SECTION_ID)}
                className="group relative inline-flex min-h-[52px] items-center justify-center gap-3 overflow-hidden rounded-full bg-[#07122F] px-8 py-4 text-base font-semibold text-white shadow-[0_18px_44px_-18px_rgba(7,18,47,0.55)] transition hover:-translate-y-0.5 hover:bg-[#0c1d42] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cyan md:px-10"
              >
                <span className="relative z-10">{RECRUITMENT_HERO.ctaPrimary}</span>
                <ArrowRight className="relative z-10 h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden />
              </button>

              <button
                type="button"
                onClick={scrollToHowItWorks}
                className="inline-flex min-h-[52px] items-center gap-1 text-base font-semibold text-[#07122F] underline-offset-4 hover:text-brand-cyan hover:underline sm:min-h-0"
              >
                {RECRUITMENT_HERO.secondaryLinkLabel}
                <ChevronRight className="h-5 w-5" aria-hidden />
              </button>
            </div>

            <p className="mt-4 max-w-lg text-sm font-medium text-slate-500 md:text-base">{RECRUITMENT_HERO.ctaMicrocopy}</p>

            <div className="mt-10 max-w-xl rounded-[1.75rem] border border-brand-border bg-white p-6 shadow-[0_20px_50px_-28px_rgba(7,18,47,0.25)] md:p-8 lg:max-w-none">
              <h2 className="mb-4 text-lg font-extrabold leading-snug text-[#07122F] text-balance md:text-xl">
                {RECRUITMENT_CONVERSION_CARD.title}
              </h2>
              <ul className="mb-6 space-y-2.5 text-sm leading-relaxed text-slate-600 md:text-base">
                {RECRUITMENT_CONVERSION_CARD.bullets.map((line) => (
                  <li key={line} className="flex gap-2.5 text-pretty">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-cyan" aria-hidden />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => scrollToKarieraQuiz(RECRUITMENT_QUIZ_SECTION_ID)}
                className="w-full rounded-2xl bg-brand-cyan px-6 py-4 text-center text-base font-bold text-[#07122F] shadow-[0_12px_36px_-14px_rgba(79,198,242,0.55)] transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#07122F] sm:w-auto sm:px-8"
              >
                {RECRUITMENT_CONVERSION_CARD.cta}
              </button>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:col-span-5 lg:ml-auto lg:max-w-none">
            <div
              className="absolute -inset-4 rounded-[2.5rem] opacity-25 blur-2xl transition-all duration-500"
              style={{ background: "linear-gradient(135deg, #4FC6F2, #FBBF24)" }}
              aria-hidden
            />
            {RECRUITMENT_HERO.usePlaceholderPortrait ? (
              <div
                className="relative flex aspect-[3/4] w-full flex-col items-center justify-center overflow-hidden rounded-[2rem] border-2 border-[#07122F]/20 bg-white/70 p-8 backdrop-blur-xl"
                style={{ boxShadow: "0 25px 50px -12px rgba(7,18,47,0.12)" }}
              >
                <ImageIcon size={56} className="mb-5 opacity-50 text-[#07122F]" aria-hidden />
                <p className="mb-3 text-center text-xs font-bold uppercase tracking-[0.2em] text-[#07122F]">Fotografie</p>
                <p className="max-w-[220px] text-center text-xs font-medium text-brand-muted opacity-80">
                  (Oblast vyhrazená pro profesionální portrét Marka Příbramského)
                </p>
              </div>
            ) : (
              <div
                className="relative aspect-[3/4] w-full overflow-hidden rounded-[2rem] border-2 border-[#07122F]/25 transition-transform duration-500"
                style={{ boxShadow: "0 28px 56px -14px rgba(7,18,47,0.25)" }}
              >
                <Image
                  src={RECRUITMENT_HERO.imageSrc}
                  alt={RECRUITMENT_HERO.imageAlt}
                  fill
                  className="object-cover object-[center_25%]"
                  sizes="(min-width: 1024px) min(420px, 33vw), 100vw"
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
