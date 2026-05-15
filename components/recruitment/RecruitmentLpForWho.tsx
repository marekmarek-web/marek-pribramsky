import Link from "next/link";
import {
  RECRUITMENT_FOR_WHO,
  RECRUITMENT_QUIZ_SECTION_ID,
} from "@/components/recruitment/recruitment-data";

export function RecruitmentLpForWho() {
  return (
    <section className="py-14 md:py-20" aria-labelledby="pro-koho-heading">
      <div className="mx-auto max-w-7xl px-6">
        <h2
          id="pro-koho-heading"
          className="mb-10 text-center text-3xl font-extrabold tracking-tight text-[#07122F] text-balance md:mb-14 md:text-4xl lg:text-5xl"
        >
          {RECRUITMENT_FOR_WHO.sectionTitle}
        </h2>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          <div className="rounded-[2rem] border border-brand-border bg-white p-6 shadow-[0_14px_40px_-22px_rgba(7,18,47,0.12)] sm:p-10">
            <h3 className="mb-6 text-xl font-extrabold text-[#07122F] md:text-2xl">{RECRUITMENT_FOR_WHO.forTitle}</h3>
            <ul className="space-y-4 text-base leading-relaxed text-slate-700">
              {RECRUITMENT_FOR_WHO.forBullets.map((t) => (
                <li key={t} className="flex gap-3 text-pretty">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-cyan" aria-hidden />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-inner sm:p-10">
            <h3 className="mb-6 text-xl font-extrabold text-slate-800 md:text-2xl">{RECRUITMENT_FOR_WHO.againstTitle}</h3>
            <ul className="space-y-4 text-base leading-relaxed text-slate-600">
              {RECRUITMENT_FOR_WHO.againstBullets.map((t) => (
                <li key={t} className="flex gap-3 text-pretty">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-slate-400" aria-hidden />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href={`#${RECRUITMENT_QUIZ_SECTION_ID}`}
            className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-[#07122F] px-10 py-4 text-base font-semibold text-white shadow-[0_18px_44px_-18px_rgba(7,18,47,0.65)] transition hover:bg-[#0c1d42] hover:shadow-[0_22px_50px_-18px_rgba(7,18,47,0.55)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cyan"
          >
            {RECRUITMENT_FOR_WHO.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
