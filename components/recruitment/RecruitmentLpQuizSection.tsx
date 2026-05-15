import { RecruitmentWizard } from "@/components/recruitment/RecruitmentWizard";
import {
  RECRUITMENT_QUIZ_HEADER,
  RECRUITMENT_QUIZ_SECTION_ID,
  RECRUITMENT_TRUST_PILLS,
} from "@/components/recruitment/recruitment-data";

export function RecruitmentLpQuizSection() {
  const quizTrust = RECRUITMENT_TRUST_PILLS.slice(0, 4);

  return (
    <section
      id={RECRUITMENT_QUIZ_SECTION_ID}
      className="scroll-mt-28 py-16 md:py-24"
      aria-labelledby="kariera-dotaznik-nadpis"
    >
      <div className="mx-auto max-w-4xl px-6">
        <header className="mb-10 text-center md:mb-12">
          <h2
            id="kariera-dotaznik-nadpis"
            className="mb-4 text-3xl font-extrabold tracking-tight text-[#07122F] text-balance md:text-4xl"
          >
            {RECRUITMENT_QUIZ_HEADER.title}
          </h2>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-600 text-pretty">{RECRUITMENT_QUIZ_HEADER.intro}</p>
          <div className="mx-auto mt-6 flex max-w-2xl flex-wrap justify-center gap-2">
            {quizTrust.map((t) => (
              <span
                key={t}
                className="rounded-full border border-brand-line bg-white px-3 py-1.5 text-xs font-semibold text-[#07122F]/90 shadow-sm md:text-sm"
              >
                {t}
              </span>
            ))}
          </div>
        </header>

        <div
          className="relative overflow-hidden rounded-[2.5rem] border border-brand-navyLight p-6 md:p-12 lg:p-14"
          style={{
            background: "linear-gradient(165deg, #07122F 0%, #1D2354 55%)",
            boxShadow:
              "0 32px 64px -18px rgba(7,18,47,0.55), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div
              className="absolute -right-[10%] -top-[20%] h-[480px] w-[480px] rounded-full opacity-25 blur-[100px]"
              style={{ backgroundColor: "#4FC6F2" }}
              aria-hidden
            />
            <div
              className="absolute -bottom-[18%] -left-[10%] h-[380px] w-[380px] rounded-full opacity-12 blur-[100px]"
              style={{ backgroundColor: "#fbbf24" }}
              aria-hidden
            />
          </div>
          <div className="relative z-10">
            <RecruitmentWizard />
          </div>
        </div>
      </div>
    </section>
  );
}
