"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnalyticsEvents } from "@/lib/analytics/events";
import { track } from "@/lib/analytics/track";
import { cta } from "@/config/cta";
import { mainNav, mobileMenuLinks, toolsDropdown, type NavItem } from "@/config/site";

function NavLink({ item, onNavigate }: { item: NavItem; onNavigate?: () => void }) {
  const className =
    "rounded-full px-4 py-2.5 text-base font-medium text-slate-700 hover:bg-white/60 hover:text-slate-900 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4FC6F2]/50 focus-visible:ring-offset-2 min-h-[46px] inline-flex shrink-0 items-center whitespace-nowrap md:px-2.5 md:py-2 md:text-sm md:min-h-[42px] xl:px-4 xl:py-2.5 xl:min-h-[46px] xl:text-[1.0625rem]";
  if (item.external) {
    return (
      <a
        href={item.href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onNavigate}
      >
        {item.label}
      </a>
    );
  }
  return (
    <Link href={item.href} className={className} onClick={onNavigate}>
      {item.label}
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const toolsBtnRef = useRef<HTMLButtonElement>(null);
  const toolsPanelRef = useRef<HTMLDivElement>(null);
  const [toolsOpen, setToolsOpen] = useState(false);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!toolsOpen) return;
      const t = e.target as Node;
      if (toolsPanelRef.current?.contains(t) || toolsBtnRef.current?.contains(t)) return;
      setToolsOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [toolsOpen]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        setToolsOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const closeMenu = useCallback(() => setOpen(false), []);

  return (
    <>
      <header
        id="main-header"
        className="header-entry fixed top-0 left-0 right-0 z-50 transition-transform duration-500 ease-out visible"
        role="banner"
      >
        <div className="header-inner mx-auto max-w-6xl px-4 pb-2 pt-4">
          <div className="header-pill-glass flex min-w-0 items-center justify-between gap-1.5 px-2.5 py-2.5 sm:gap-2 sm:px-4 sm:py-3 md:gap-2 md:px-2.5 xl:gap-3 xl:px-4">
            <Link
              href="/"
              className="flex min-w-0 shrink-0 items-center gap-2 rounded-full bg-white/80 px-3 py-2 text-sm font-semibold text-slate-800 transition-colors hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#4FC6F2]/40 focus:ring-offset-1 min-h-[44px] sm:px-4 sm:py-2.5 md:min-h-[48px] xl:px-4"
              aria-label="Úvodní stránka"
            >
              <Image
                src="/img/logos/pb-logo-no-bg.png"
                alt="Premium Brokers"
                width={132}
                height={44}
                className="h-8 w-auto sm:h-9 md:h-8 xl:h-10"
                priority
              />
            </Link>
            <button
              type="button"
              className="hamburger-btn flex h-12 w-12 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#4FC6F2]/40 md:hidden"
              aria-label={open ? "Zavřít menu" : "Otevřít menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <nav className="hidden min-w-0 flex-1 items-center justify-center gap-0 md:flex md:justify-end md:gap-0 xl:gap-0.5" aria-label="Hlavní navigace">
              {mainNav.slice(0, 3).map((item) => (
                <NavLink key={item.href + item.label} item={item} />
              ))}
              <div className="relative">
                <button
                  ref={toolsBtnRef}
                  type="button"
                  className="flex min-h-[42px] shrink-0 items-center gap-0.5 rounded-full px-2.5 py-2 text-sm font-medium text-slate-700 transition hover:bg-white/60 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#4FC6F2]/40 focus:ring-offset-1 whitespace-nowrap xl:min-h-[46px] xl:gap-1 xl:px-4 xl:py-2.5 xl:text-base xl:text-[1.0625rem]"
                  aria-expanded={toolsOpen}
                  aria-haspopup="true"
                  onClick={(e) => {
                    e.stopPropagation();
                    setToolsOpen((v) => !v);
                  }}
                >
                  Nástroje
                  <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div
                  ref={toolsPanelRef}
                  className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 rounded-2xl border border-slate-200/70 bg-white/95 backdrop-blur-xl shadow-lg p-2 z-50 transition-all duration-200 ${
                    toolsOpen ? "visible opacity-100 translate-y-0" : "invisible opacity-0 translate-y-1 pointer-events-none"
                  }`}
                >
                  {toolsDropdown.map((t) => (
                    <Link
                      key={t.href}
                      href={t.href}
                      className="block rounded-xl px-3 py-2.5 hover:bg-slate-50 transition"
                      onClick={() => setToolsOpen(false)}
                    >
                      <span className="font-medium text-slate-800">{t.title}</span>
                      <span className="block text-xs text-slate-500 mt-0.5">{t.description}</span>
                    </Link>
                  ))}
                  <div className="border-t border-slate-100 mt-2 pt-2">
                    <Link
                      href="/kalkulacky"
                      className="block rounded-xl px-3 py-2.5 hover:bg-slate-50 transition font-semibold text-[#1D2354]"
                      onClick={() => setToolsOpen(false)}
                    >
                      Všechny kalkulačky →
                    </Link>
                  </div>
                </div>
              </div>
              {mainNav.slice(3).map((item) => (
                <NavLink key={item.href + item.label} item={item} />
              ))}
            </nav>
            <Link
              href="/#kontakt"
              onClick={() => track(AnalyticsEvents.ctaClick, { cta_id: "header_contact" })}
              className="header-cta lead-cta-btn hidden min-h-[40px] shrink-0 items-center justify-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold text-white no-underline transition focus:outline-none focus:ring-2 focus:ring-[#4FC6F2]/40 focus:ring-offset-1 md:flex xl:min-h-[48px] xl:gap-2 xl:px-6 xl:py-3 xl:text-base xl:text-[1.0625rem]"
            >
              <span className="whitespace-nowrap">{cta.headerPrimary}</span>
              <svg className="h-3.5 w-3.5 shrink-0 xl:h-4 xl:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      <nav
        id="mobile-menu"
        className={`mobile-nav-drawer fixed inset-0 z-[9999] md:hidden ${open ? "open" : ""}`}
        aria-label="Mobilní navigace"
        aria-hidden={!open}
      >
        <div className="mobile-nav-backdrop absolute inset-0" data-close-menu aria-hidden onClick={closeMenu} />
        <div className="mobile-nav-panel absolute top-0 right-0 flex h-full w-full max-w-sm flex-col px-6 pb-8 pt-20">
          {mobileMenuLinks.map((item) => (
            <Link
              key={`m-${item.label}-${item.href}`}
              href={item.href}
              className="border-b border-slate-100 py-3 text-lg font-medium text-slate-800"
              onClick={closeMenu}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/#kontakt"
            className="lead-cta-btn mt-4 flex w-full flex-row items-center justify-center gap-2 rounded-xl px-4 py-3 text-base font-semibold text-white no-underline"
            onClick={() => {
              track(AnalyticsEvents.ctaClick, { cta_id: "mobile_drawer_contact" });
              closeMenu();
            }}
          >
            <span className="text-center">{cta.headerPrimary}</span>
            <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </Link>
        </div>
      </nav>
    </>
  );
}
