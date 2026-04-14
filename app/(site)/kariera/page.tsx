import type { Metadata } from "next";
import Link from "next/link";
import { RecruitmentLpBentoBenefits } from "@/components/recruitment/RecruitmentLpBentoBenefits";
import { RecruitmentLpHero } from "@/components/recruitment/RecruitmentLpHero";
import { RecruitmentLpQuizSection } from "@/components/recruitment/RecruitmentLpQuizSection";
import { pageOg } from "@/lib/seo/page-meta";

const title = "Kariéra";
const description =
  "Pracuj ve světě financí na vysoké úrovni. Krátký dotazník a osobní odbavení do 24 hodin.";

export const metadata: Metadata = {
  title,
  description,
  ...pageOg("/kariera", title, description),
};

export default function KarieraPage() {
  return (
    <main className="main-with-header min-h-screen bg-brand-background pb-20 pt-24 selection:bg-brand-cyan/30 selection:text-brand-navy lg:pb-28">
      <RecruitmentLpHero />
      <RecruitmentLpBentoBenefits />
      <RecruitmentLpQuizSection />

      <div className="mx-auto max-w-7xl px-6">
        <p className="pb-8 pt-4">
          <Link href="/" className="font-semibold text-brand-navy hover:text-brand-cyan">
            ← Zpět na úvod
          </Link>
        </p>
      </div>
    </main>
  );
}
