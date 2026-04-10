import type { Metadata } from "next";
import Link from "next/link";
import { pageOg } from "@/lib/seo/page-meta";

const title = "Kalkulačky";
const description = "Hypotéka, investice, životní pojištění, penze – orientační výpočty.";

export const metadata: Metadata = {
  title,
  description,
  ...pageOg("/kalkulacky", title, description),
};

export default function KalkulackyPage() {
  return (
    <main className="main-with-header pt-24 pb-20 lg:pb-28">
      <div className="max-w-content mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h1 className="section-title font-bold text-brand-text mb-4">Kalkulačky</h1>
          <p className="text-brand-muted max-w-2xl mx-auto text-lg">
            Pomůcky pro orientaci v investicích, hypotékách, pojištění a penzi.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            href="/hypotecnikalkulacka"
            className="block rounded-2xl border border-brand-border bg-white p-8 shadow-sm transition-shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/45 focus-visible:ring-offset-2"
          >
            <div className="w-14 h-14 rounded-xl bg-brand-cyan/10 flex items-center justify-center mb-6">
              <svg className="w-7 h-7 text-brand-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-brand-text mb-2">Hypoteční kalkulačka</h2>
            <p className="text-brand-muted text-sm">Spočítejte si měsíční splátku a celkové náklady hypotéky.</p>
          </Link>
          <Link
            href="/investicnikalkulacka"
            className="block rounded-2xl border border-brand-border bg-white p-8 shadow-sm transition-shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/45 focus-visible:ring-offset-2"
          >
            <div className="w-14 h-14 rounded-xl bg-brand-cyan/10 flex items-center justify-center mb-6">
              <svg className="w-7 h-7 text-brand-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-brand-text mb-2">Investiční kalkulačka</h2>
            <p className="text-brand-muted text-sm">Projekce zhodnocení kapitálu v čase.</p>
          </Link>
          <Link
            href="/zivotnikalkulacka"
            className="block rounded-2xl border border-brand-border bg-white p-8 shadow-sm transition-shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/45 focus-visible:ring-offset-2"
          >
            <div className="w-14 h-14 rounded-xl bg-brand-cyan/10 flex items-center justify-center mb-6">
              <svg className="w-7 h-7 text-brand-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-brand-text mb-2">Kalkulačka životního pojištění</h2>
            <p className="text-brand-muted text-sm">Odhad potřebného krytí pro rodinu.</p>
          </Link>
          <Link
            href="/penzijnikalkulacka"
            className="block rounded-2xl border border-brand-border bg-white p-8 shadow-sm transition-shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/45 focus-visible:ring-offset-2"
          >
            <div className="w-14 h-14 rounded-xl bg-brand-cyan/10 flex items-center justify-center mb-6">
              <svg className="w-7 h-7 text-brand-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-brand-text mb-2">Penzijní kalkulačka</h2>
            <p className="text-brand-muted text-sm">Výpočet doplňkového penzijního spoření a státních příspěvků.</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
