import dynamic from "next/dynamic";

const LeadConsultationForm = dynamic(
  () => import("@/components/forms/LeadConsultationForm").then((m) => m.LeadConsultationForm),
  { loading: () => <div className="min-h-[420px] animate-pulse rounded-2xl bg-slate-50" aria-hidden /> },
);

type ContactConsultationSectionProps = {
  source?: "homepage_consultation" | "contact_page";
};

/** Sekce #kontakt s LeadConsultationForm — stejná jako na úvodní stránce. */
export function ContactConsultationSection({ source = "homepage_consultation" }: ContactConsultationSectionProps) {
  return (
    <section
      id="kontakt"
      className="lead-form-section relative py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 overflow-hidden min-h-[520px] sm:min-h-[560px] lg:min-h-[640px] flex items-center scroll-mt-28 md:scroll-mt-32"
    >
      <div
        id="lead-form"
        className="pointer-events-none absolute left-0 top-0 h-px w-full scroll-mt-28 md:scroll-mt-32"
        aria-hidden
      />
      <div className="lead-form-bg" aria-hidden />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 relative z-10 w-full">
        <div className="mb-6 text-center sm:mb-8">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Nezávazná konzultace</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-white/85 sm:text-base">
            Vyberte téma a nechte kontakt — odpovím osobně (ne automat), obvykle do jednoho pracovního dne. Žádný tlak na
            podpis hned na první schůzce.
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden smart-cta-container">
          <div className="p-5 sm:p-8 lg:p-12 flex flex-col justify-center">
            <LeadConsultationForm source={source} />
          </div>
        </div>
      </div>
    </section>
  );
}
