import type { Metadata } from "next";
import Link from "next/link";
import { RecruitmentKarieraTrustStrip } from "@/components/recruitment/RecruitmentKarieraTrustStrip";
import { RecruitmentLpBenefitsGrid } from "@/components/recruitment/RecruitmentLpBenefitsGrid";
import { RecruitmentLpForWho } from "@/components/recruitment/RecruitmentLpForWho";
import { RecruitmentLpHero } from "@/components/recruitment/RecruitmentLpHero";
import { RecruitmentLpHowItWorks } from "@/components/recruitment/RecruitmentLpHowItWorks";
import { RecruitmentLpQuizSection } from "@/components/recruitment/RecruitmentLpQuizSection";
import { RecruitmentLpWhyJoin } from "@/components/recruitment/RecruitmentLpWhyJoin";
import { RecruitmentStickyKarieraCta } from "@/components/recruitment/RecruitmentStickyKarieraCta";
import { pageOg } from "@/lib/seo/page-meta";

const title = "Kariéra";
const description =
  "Krátké ověření spolupráce za 2 minuty — leady, zaškolení a reálná podpora v týmu Premium Brokers.";

export const metadata: Metadata = {
  title,
  description,
  ...pageOg("/kariera", title, description),
};

export default function KarieraPage() {
  return (
    <main className="main-with-header min-h-screen bg-brand-background pb-24 pt-24 selection:bg-brand-cyan/30 selection:text-brand-navy lg:pb-32">
      <RecruitmentLpHero />
      <RecruitmentKarieraTrustStrip />
      <RecruitmentLpHowItWorks />
      <RecruitmentLpBenefitsGrid />
      <RecruitmentLpWhyJoin />
      <RecruitmentLpForWho />
      <RecruitmentLpQuizSection />
      <RecruitmentStickyKarieraCta />

      <div className="mx-auto max-w-7xl px-6">
        <p className="pb-8 pt-6">
          <Link href="/" className="font-semibold text-[#07122F] hover:text-brand-cyan">
            ← Zpět na úvod
          </Link>
        </p>
      </div>
    </main>
  );
}
