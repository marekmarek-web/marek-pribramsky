import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { pageOg } from "@/lib/seo/page-meta";
import { PensionFullscreenHero } from "@/components/calculators/portal/pension/PensionFullscreenHero";
import { PensionSectionIntro } from "@/components/calculators/portal/pension/PensionSectionIntro";

const PensionCalculatorPage = dynamic(
  () =>
    import("@/components/calculators/portal/pension/PensionCalculatorPage").then(
      (m) => m.PensionCalculatorPage
    ),
  {
    loading: () => (
      <div className="flex min-h-[50vh] items-center justify-center text-brand-muted">
        Načítám kalkulačku…
      </div>
    ),
  }
);

const title = "Penzijní kalkulačka";
const description = "Odhad důchodu, mezery k cílové rentě a potřebné spoření.";

export const metadata: Metadata = {
  title,
  description,
  ...pageOg("/penzijnikalkulacka", title, description),
};

export default function PenzijniKalkulackaPage() {
  return (
    <main className="main-with-header min-h-screen bg-brand-light pb-16 pt-24">
      <PensionFullscreenHero />
      <section
        id="kalkulacka"
        className="relative scroll-mt-28 overflow-hidden border-t border-slate-200/60 bg-gradient-to-b from-brand-light via-[#f4f7fc] to-[#eef2f9] py-16 md:py-24"
      >
        <div
          className="pointer-events-none absolute -right-40 -top-40 h-[800px] w-[800px] rounded-full bg-white/40 opacity-60 blur-3xl"
          aria-hidden
        />
        <div className="relative z-10 mx-auto max-w-[1200px] px-4">
          <PensionSectionIntro />
          <PensionCalculatorPage />
        </div>
      </section>
    </main>
  );
}
