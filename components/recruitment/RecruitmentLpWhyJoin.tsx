import type { SVGProps } from "react";
import Image from "next/image";
import {
  RECRUITMENT_BENTO_INTRO,
  RECRUITMENT_CHALLENGE_CARD,
  RECRUITMENT_WHY_TEAM_PHOTO,
} from "@/components/recruitment/recruitment-data";

function MapPinGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

/** Nadstavba sekce — tým + výzva (trust / lokace), bez benefit gridu */
export function RecruitmentLpWhyJoin() {
  return (
    <section className="relative z-10 py-14 md:py-20" aria-labelledby="kariera-proc">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center">
          <h2
            id="kariera-proc"
            className="mb-8 text-center text-3xl font-extrabold tracking-tight text-[#07122F] text-balance md:mb-10 md:text-4xl lg:text-5xl"
          >
            {RECRUITMENT_BENTO_INTRO.title}
          </h2>

          <figure className="relative mb-10 w-full overflow-hidden rounded-[1.75rem] border border-white bg-slate-100 shadow-[0_28px_70px_-32px_rgba(7,18,47,0.5)] ring-1 ring-brand-border/60 md:mb-12 md:rounded-[2rem]">
            <Image
              src={RECRUITMENT_WHY_TEAM_PHOTO.src}
              alt={RECRUITMENT_WHY_TEAM_PHOTO.alt}
              width={RECRUITMENT_WHY_TEAM_PHOTO.width}
              height={RECRUITMENT_WHY_TEAM_PHOTO.height}
              className="h-auto w-full [image-rendering:auto]"
              sizes="(min-width: 1280px) 1200px, 100vw"
              quality={100}
              loading="lazy"
            />
          </figure>

          <article
            className="relative w-full max-w-4xl overflow-hidden rounded-[1.75rem] border border-brand-border bg-white px-6 py-8 text-left shadow-[0_22px_60px_-32px_rgba(7,18,47,0.28)] md:rounded-[2rem] md:px-10 md:py-10"
            aria-labelledby="kariera-vyzva-badge"
          >
            <div
              className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-brand-cyan/15 blur-3xl"
              aria-hidden
            />
            <h3
              id="kariera-vyzva-badge"
              className="relative mb-6 text-2xl font-extrabold tracking-tight text-[#07122F] text-balance md:text-3xl lg:text-4xl"
            >
              {RECRUITMENT_CHALLENGE_CARD.badge}
            </h3>
            <div className="relative grid gap-5 text-base leading-relaxed text-slate-600 md:grid-cols-2 md:text-lg">
              <p className="rounded-2xl bg-brand-light/70 p-5 font-medium text-[#07122F]">
                {RECRUITMENT_CHALLENGE_CARD.intro}
              </p>
              <p className="rounded-2xl bg-slate-50 p-5 font-medium">{RECRUITMENT_CHALLENGE_CARD.offers}</p>
              <p className="rounded-2xl border border-brand-line/80 bg-white p-5 font-semibold text-[#07122F]">
                {RECRUITMENT_CHALLENGE_CARD.requirements}
              </p>
              <p className="rounded-2xl bg-[#07122F] p-5 font-semibold text-white shadow-[0_18px_40px_-24px_rgba(7,18,47,0.65)]">
                {RECRUITMENT_CHALLENGE_CARD.cta}
              </p>
            </div>
            <p className="relative mt-8 flex flex-wrap items-start gap-2 border-t border-brand-border pt-6 text-sm font-medium text-slate-600 md:text-base">
              <MapPinGlyph className="mt-0.5 h-5 w-5 shrink-0 text-brand-cyan" />
              <span>
                <span className="font-semibold text-brand-cyan">{RECRUITMENT_CHALLENGE_CARD.branchesLabel}</span>{" "}
                {RECRUITMENT_CHALLENGE_CARD.branches}
              </span>
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
