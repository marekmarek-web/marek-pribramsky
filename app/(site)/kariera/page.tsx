import type { Metadata } from "next";
import Link from "next/link";
import { RecruitmentPageForm } from "@/components/forms/RecruitmentPageForm";
import { pageOg } from "@/lib/seo/page-meta";

const title = "Kariéra";
const description = "Napište nám a domluvíme další kroky v náborovém procesu.";

export const metadata: Metadata = {
  title,
  description,
  ...pageOg("/kariera", title, description),
};

export default function KarieraPage() {
  return (
    <main className="main-with-header pt-24 pb-20 lg:pb-28">
      <div className="max-w-content mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="section-title font-bold text-brand-text mb-4">Kariéra</h1>
          <p className="text-brand-muted mb-12">
            Hledáme kolegy, kteří chtějí růst v prostředí finančního poradenství. Vyplňte formulář — ozveme se vám.
          </p>
          <div className="rounded-2xl p-[1px] bg-gradient-to-br from-brand-navy/15 via-brand-cyan/10 to-brand-navy/15 shadow-sm">
            <div className="bg-white rounded-2xl p-8 lg:p-10">
              <RecruitmentPageForm />
            </div>
          </div>
          <p className="mt-10">
            <Link href="/" className="text-brand-navy font-semibold hover:text-brand-cyan">
              ← Zpět na úvod
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
