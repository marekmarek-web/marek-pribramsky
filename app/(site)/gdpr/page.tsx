import type { Metadata } from "next";
import Link from "next/link";
import { pageOg } from "@/lib/seo/page-meta";

const title = "Ochrana osobních údajů";
const description = "Informace o zpracování osobních údajů a odkaz na podrobné zásady.";

export const metadata: Metadata = {
  title,
  description,
  ...pageOg("/gdpr", title, description),
};

export default function GdprPage() {
  return (
    <main className="main-with-header pt-24 pb-20 lg:pb-28">
      <div className="max-w-content mx-auto px-4 sm:px-6">
        <div className="max-w-3xl prose prose-brand">
          <h1 className="section-title font-bold text-brand-text mb-8">Ochrana osobních údajů</h1>
          <p className="text-brand-muted leading-relaxed mb-6">
            Správcem osobních údajů je Premium Brokers. Vaše údaje zpracováváme v souladu s GDPR za účelem odpovědi na
            dotazy, domluvení konzultací a poskytování našich služeb.
          </p>
          <p className="text-brand-muted leading-relaxed mb-6">
            Údaje neposkytujeme třetím stranám bez vašeho souhlasu. Máte právo na přístup, opravu, výmaz a přenositelnost
            údajů. Pro uplatnění práv nás kontaktujte na pribramsky@premiumbrokers.cz. Podrobné zásady:{" "}
            <a
              href="https://www.beplan.cz/ochrana-osobnich-udaju/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-navy hover:underline"
            >
              beplan.cz/ochrana-osobnich-udaju
            </a>
            .
          </p>
          <p className="text-brand-muted leading-relaxed">
            Podrobné zásady zpracování osobních údajů doplňte dle vašich potřeb a právních požadavků.
          </p>
          <Link
            href="/kontakt"
            className="inline-block mt-8 px-6 py-3 rounded-xl bg-brand-navy text-white font-semibold hover:bg-brand-navy/90"
          >
            Kontakt
          </Link>
        </div>
      </div>
    </main>
  );
}
