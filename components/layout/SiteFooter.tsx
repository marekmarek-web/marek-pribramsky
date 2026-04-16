import Image from "next/image";
import Link from "next/link";
import { legalConfig } from "@/config/legal";
import {
  branches,
  footerQuickLinks,
  footerToolLinks,
  siteConfig,
  socialLinks,
} from "@/config/site";
import { getFooterTagline } from "@/lib/site-settings";

function SocialIcon({ icon }: { icon: "fb" | "ig" | "li" }) {
  if (icon === "fb") {
    return (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    );
  }
  if (icon === "ig") {
    return (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    );
  }
  return (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export async function SiteFooter() {
  const footerTagline = await getFooterTagline();

  return (
    <footer className="bg-brand-navy py-8 text-white sm:py-12 lg:py-14" role="contentinfo">
      <div className="footer-inner mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:gap-10 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <Image src="/img/logos/pb-logo-no-bg-grey.png" alt="Premium Brokers" width={120} height={40} className="h-9 w-auto" />
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-300">{footerTagline}</p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Sledujte mě</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {socialLinks.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon-link inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition hover:border-white/25 hover:bg-white/10"
                  aria-label={s.label}
                >
                  <SocialIcon icon={s.icon} />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 sm:gap-10 lg:col-span-5">
            <div className="min-w-0">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Rychlé odkazy</h3>
              <ul className="mt-3 space-y-2 text-sm sm:mt-4 sm:space-y-2.5">
                {footerQuickLinks.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-slate-300 transition hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Nástroje</h3>
              <ul className="mt-3 space-y-2 text-sm sm:mt-4 sm:space-y-2.5">
                {footerToolLinks.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-slate-300 transition hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2 min-w-0 sm:col-span-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Pobočky</h3>
              <ul className="mt-4 space-y-4 text-sm text-slate-300">
                {branches.map((b) => (
                  <li key={b.city}>
                    <span className="font-semibold text-white">{b.city}</span>
                    {b.muted ? (
                      <span className="mt-0.5 block text-slate-500">{b.lines[0]}</span>
                    ) : (
                      <span className="mt-0.5 block text-slate-400">
                        {b.lines.map((line) => (
                          <span key={line} className="block">
                            {line}
                          </span>
                        ))}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Kontakt</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a href={`tel:${siteConfig.phoneTel}`} className="text-lg font-semibold text-white hover:underline">
                  {siteConfig.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${siteConfig.contactEmail}`} className="break-all text-slate-300 hover:text-white">
                  {siteConfig.contactEmail}
                </a>
              </li>
              <li className="pt-1">
                <Link
                  href="/kontakt"
                  className="inline-flex min-h-[44px] items-center rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/35 hover:bg-white/10"
                >
                  Stránka kontakt
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <p className="text-xs text-slate-500">
              &copy; {new Date().getFullYear()} {siteConfig.name}
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
              <Link href="/gdpr" className="text-slate-400 hover:text-white">
                Ochrana údajů (web)
              </Link>
              <a
                href="https://www.beplan.cz/ochrana-osobnich-udaju/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white"
              >
                Partner (BEplan)
              </a>
              <Link href="/cookies" className="text-slate-400 hover:text-white">
                Cookies
              </Link>
            </div>
          </div>
          <div className="mt-6 max-w-4xl space-y-3 text-[11px] leading-relaxed text-slate-500">
            {legalConfig.regulatoryDisclaimerShortParagraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-500">
            Vytvořil{" "}
            <a
              href={legalConfig.credit.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-slate-400 hover:text-white"
            >
              {legalConfig.credit.label}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
