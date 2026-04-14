import { RecruitmentWizard } from "@/components/recruitment/RecruitmentWizard";

export function RecruitmentLpQuizSection() {
  return (
    <section id="dotaznik-sekce" className="scroll-mt-28 py-16 md:py-24" aria-label="Náborový dotazník">
      <div className="mx-auto max-w-4xl px-6">
        <div
          className="relative overflow-hidden rounded-[2.5rem] border border-brand-navyLight p-8 md:p-14"
          style={{
            background: "linear-gradient(160deg, #0A0F29 0%, #1D2354 100%)",
            boxShadow:
              "0 30px 60px -15px rgba(10,15,41,0.6), inset 0 1px 0 rgba(255,255,255,0.1)",
          }}
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div
              className="absolute -right-[10%] -top-[20%] h-[500px] w-[500px] rounded-full opacity-20 blur-[100px]"
              style={{ backgroundColor: "#4FC6F2" }}
              aria-hidden
            />
            <div
              className="absolute -bottom-[20%] -left-[10%] h-[400px] w-[400px] rounded-full opacity-10 blur-[100px]"
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
