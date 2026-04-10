import type { Metadata } from "next";
import Link from "next/link";
import { pageOg } from "@/lib/seo/page-meta";

const title = "Cookies";
const description = "Základní informace o cookies na tomto webu.";

export const metadata: Metadata = {
  title,
  description,
  robots: { index: false, follow: true },
  ...pageOg("/cookies", title, description),
};

export default function CookiesPage() {
  return (
    <main className="main-with-header pt-24 pb-20 lg:pb-28">
      <div className="max-w-content mx-auto px-4 sm:px-6">
        <div className="max-w-3xl">
          <h1 className="section-title font-bold text-brand-text mb-8">Cookies</h1>
          <p className="text-brand-muted leading-relaxed mb-6">
            Tento web může používat cookies pro zajištění základní funkčnosti a analýzu návštěvnosti. Cookies jsou malé
            textové soubory ukládané ve vašem prohlížeči.
          </p>
          <p className="text-brand-muted leading-relaxed">
            Nastavení cookies můžete upravit v prohlížeči. Podrobnosti o zpracování osobních údajů najdete v dokumentu níže.
          </p>
          <Link
            href="/gdpr"
            className="inline-block mt-8 min-h-[44px] rounded-xl bg-brand-navy px-6 py-3 font-semibold text-white hover:bg-brand-navy/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/50 focus-visible:ring-offset-2"
          >
            Ochrana osobních údajů
          </Link>
        </div>
      </div>
    </main>
  );
}
