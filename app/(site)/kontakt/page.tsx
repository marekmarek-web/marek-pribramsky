import type { Metadata } from "next";
import Link from "next/link";
import { ContactConsultationSection } from "@/components/contact/ContactConsultationSection";
import { ContactDirectStrip } from "@/components/contact/ContactDirectStrip";
import { PobockySection } from "@/components/contact/PobockySection";
import { pageOg } from "@/lib/seo/page-meta";

const title = "Kontakt";
const description =
  "Telefon, e-mail, pobočky. Domluvte nezávaznou konzultaci — odpovídám osobně, obvykle do jednoho pracovního dne.";

export const metadata: Metadata = {
  title,
  description,
  ...pageOg("/kontakt", title, description),
};

export default function KontaktPage() {
  return (
    <main className="main-with-header">
      <section className="pt-24 pb-10 sm:pb-12 lg:pb-14">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <h1 className="section-title mb-4 font-bold text-brand-text">Kontakt</h1>
          <p className="mb-8 max-w-2xl text-brand-muted">
            Ozvěte se telefonicky, e-mailem nebo přes formulář níže — domluvíme krátký hovor nebo schůzku. Odpovídám
            osobně, obvykle do jednoho pracovního dne.
          </p>
        </div>
        <ContactDirectStrip />
      </section>

      <PobockySection />

      <ContactConsultationSection source="contact_page" />

      <div className="mx-auto max-w-content px-4 pb-20 pt-8 sm:px-6 lg:pb-28">
        <Link href="/" className="font-semibold text-brand-navy hover:text-brand-cyan">
          ← Zpět na úvod
        </Link>
      </div>
    </main>
  );
}
