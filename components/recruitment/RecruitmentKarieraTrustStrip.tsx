import { RECRUITMENT_TRUST_PILLS } from "@/components/recruitment/recruitment-data";

export function RecruitmentKarieraTrustStrip() {
  return (
    <div className="border-b border-brand-border/60 bg-white/70 py-4 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-2 px-6 md:gap-3">
        {RECRUITMENT_TRUST_PILLS.map((label) => (
          <span
            key={label}
            className="inline-flex items-center rounded-full border border-brand-line bg-brand-light/90 px-4 py-2 text-xs font-semibold text-[#07122F] shadow-sm md:text-sm"
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
