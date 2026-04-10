import type { Metadata } from "next";
import Link from "next/link";
import { pageOg } from "@/lib/seo/page-meta";

const title = "Jak probíhá spolupráce";
const description = "Jak probíhá spolupráce s finančním poradcem.";

export const metadata: Metadata = {
  title,
  description,
  ...pageOg("/spoluprace", title, description),
};

export default function SpolupracePage() {
  return (
    <main className="main-with-header pt-24 pb-20 lg:pb-28">
      <div className="max-w-content mx-auto px-4 sm:px-6">
        <h1 className="section-title font-bold text-brand-text mb-8">Jak probíhá spolupráce</h1>
        <div className="lg:grid lg:grid-cols-5 lg:gap-12">
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl border border-brand-border p-8 shadow-sm">
              <span className="text-3xl font-bold text-brand-cyan/60 block mb-4">01</span>
              <h2 className="text-xl font-bold text-brand-text mb-3">Úvodní konzultace</h2>
              <p className="text-brand-muted">Seznámíme se, probereme vaši situaci a očekávání. Nezávazně, v klidu.</p>
            </div>
            <div className="bg-white rounded-2xl border border-brand-border p-8 shadow-sm">
              <span className="text-3xl font-bold text-brand-cyan/60 block mb-4">02</span>
              <h2 className="text-xl font-bold text-brand-text mb-3">Analýza</h2>
              <p className="text-brand-muted">
                Projdeme finance, cíle a rizika. Získáte přehled o tom, kde jste a kam směřujete.
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-brand-border p-8 shadow-sm">
              <span className="text-3xl font-bold text-brand-cyan/60 block mb-4">03</span>
              <h2 className="text-xl font-bold text-brand-text mb-3">Plán</h2>
              <p className="text-brand-muted">
                Připravíme konkrétní doporučení – investiční strategie, pojištění, hypotéka či komplexní plán.
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-brand-border p-8 shadow-sm">
              <span className="text-3xl font-bold text-brand-cyan/60 block mb-4">04</span>
              <h2 className="text-xl font-bold text-brand-text mb-3">Servis</h2>
              <p className="text-brand-muted">Pravidelný dohled, úpravy a podpora. Jsme tu pro vás dlouhodobě.</p>
            </div>
          </div>
          <div className="lg:col-span-2 mt-12 lg:mt-0">
            <div className="bg-brand-navy rounded-2xl p-8 text-white lg:sticky lg:top-32">
              <h3 className="text-lg font-bold mb-6">Co si připravit</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-brand-cyan/20 flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span>Přehled příjmů a výdajů</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-brand-cyan/20 flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span>Seznam stávajících smluv a investic</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-brand-cyan/20 flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span>Vaše finanční cíle a časový horizont</span>
                </li>
              </ul>
              <Link
                href="/kontakt"
                className="mt-8 block w-full py-4 rounded-xl bg-brand-cyan text-brand-navy font-bold text-center hover:bg-brand-cyan/90"
              >
                Domluvit konzultaci
              </Link>
            </div>
          </div>
        </div>
        <p className="mt-12">
          <Link href="/" className="text-brand-navy font-semibold hover:text-brand-cyan">
            ← Zpět na úvod
          </Link>
        </p>
      </div>
    </main>
  );
}
