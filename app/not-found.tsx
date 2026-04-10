import Link from "next/link";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { QuickCalcWidget } from "@/components/layout/QuickCalcWidget";
import { siteConfig } from "@/config/site";

export default async function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="site-main" tabIndex={-1} className="main-with-header min-h-[60vh] px-4 py-24 text-center outline-none sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-cyan">404</p>
        <h1 className="mt-2 text-2xl font-bold text-brand-text sm:text-3xl">Stránka nenalezena</h1>
        <p className="mx-auto mt-4 max-w-md text-brand-muted">
          Tato adresa neexistuje nebo byla přesunuta.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-brand-navy px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-brand-navy/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/60 focus-visible:ring-offset-2"
          >
            Na úvod
          </Link>
          <Link
            href="/blog"
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl border-2 border-brand-navy px-6 py-3 text-sm font-semibold text-brand-navy transition hover:bg-brand-navy/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/60 focus-visible:ring-offset-2"
          >
            Blog
          </Link>
          <Link
            href="/kontakt"
            className="rounded text-sm font-semibold text-brand-navy underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/50"
          >
            Kontakt
          </Link>
        </div>
        <p className="mt-12 text-xs text-brand-muted">{siteConfig.name}</p>
      </main>
      <QuickCalcWidget />
      <SiteFooter />
    </>
  );
}
