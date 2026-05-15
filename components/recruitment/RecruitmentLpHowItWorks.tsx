import {
  RECRUITMENT_HOW_IT_WORKS,
  RECRUITMENT_HOW_IT_WORKS_ID,
} from "@/components/recruitment/recruitment-data";

export function RecruitmentLpHowItWorks() {
  return (
    <section
      id={RECRUITMENT_HOW_IT_WORKS_ID}
      className="scroll-mt-28 border-y border-brand-border/70 bg-white/80 py-14 backdrop-blur-sm md:py-20"
      aria-labelledby="jak-spoluprace-heading"
    >
      <div className="mx-auto max-w-7xl px-6">
        <h2
          id="jak-spoluprace-heading"
          className="mb-10 text-center text-3xl font-extrabold tracking-tight text-[#07122F] text-balance md:mb-14 md:text-4xl lg:text-5xl"
        >
          {RECRUITMENT_HOW_IT_WORKS.title}
        </h2>
        <ol className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {RECRUITMENT_HOW_IT_WORKS.steps.map((step, i) => (
            <li
              key={step.title}
              className="relative flex flex-col rounded-[1.75rem] border border-brand-border bg-white p-6 shadow-[0_14px_40px_-22px_rgba(7,18,47,0.18)] md:p-8"
            >
              <span
                className="mb-4 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-light text-sm font-extrabold text-[#07122F]"
                aria-hidden
              >
                {i + 1}
              </span>
              <h3 className="mb-3 text-lg font-extrabold leading-snug text-[#07122F] text-balance md:text-xl">{step.title}</h3>
              <p className="text-sm leading-relaxed text-slate-600 text-pretty md:text-base">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
