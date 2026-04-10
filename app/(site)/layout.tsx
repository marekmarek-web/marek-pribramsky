import type { ReactNode } from "react";
import { QuickCalcWidget } from "@/components/layout/QuickCalcWidget";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

/**
 * Veřejný web — jeden SiteHeader / SiteFooter (canonical index.html).
 * Admin a přihlášení jsou mimo tuto skupinu route.
 */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <a
        href="#site-main"
        className="skip-link sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-brand-navy focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-cyan/70"
      >
        Přeskočit na obsah
      </a>
      <SiteHeader />
      <div id="site-main" tabIndex={-1} className="outline-none">
        {children}
      </div>
      <QuickCalcWidget />
      <SiteFooter />
    </>
  );
}
