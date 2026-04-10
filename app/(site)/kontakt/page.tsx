import type { Metadata } from "next";
import Link from "next/link";
import { ContactPageForm } from "@/components/forms/ContactPageForm";
import { pageOg } from "@/lib/seo/page-meta";

const title = "Kontakt";
const description = "Napište nám a domluvíme termín nezávazné konzultace.";

export const metadata: Metadata = {
  title,
  description,
  ...pageOg("/kontakt", title, description),
};

export default function KontaktPage() {
  return (
    <main className="main-with-header pt-24 pb-20 lg:pb-28">
      <div className="max-w-content mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="section-title font-bold text-brand-text mb-4">Kontakt</h1>
          <p className="text-brand-muted mb-12">
            Napište nám a domluvíme termín nezávazné konzultace. Odpovíme do 24 hodin.
          </p>
          <div className="rounded-2xl p-[1px] bg-gradient-to-br from-brand-navy/15 via-brand-cyan/10 to-brand-navy/15 shadow-sm">
            <div className="bg-white rounded-2xl p-8 lg:p-10">
              <ContactPageForm />
            </div>
          </div>
          <div className="mt-12 flex flex-col sm:flex-row gap-6">
            <a
              href="tel:+420728480423"
              className="flex items-center gap-3 text-brand-navy font-semibold hover:text-brand-cyan"
            >
              +420 728 480 423
            </a>
            <a
              href="mailto:pribramsky@premiumbrokers.cz"
              className="flex items-center gap-3 text-brand-navy font-semibold hover:text-brand-cyan"
            >
              pribramsky@premiumbrokers.cz
            </a>
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
