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
    "rounded-full px-4 py-2.5 text-base font-medium text-slate-700 hover:bg-white/60 hover:text-slate-900 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4FC6F2]/50 focus-visible:ring-offset-2 min-h-[46px] inline-flex items-center md:text-[1.0625rem]";
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
          <div className="header-pill-glass flex items-center justify-between gap-3 px-3 py-2.5 sm:px-4 sm:py-3">
            <Link
              href="/"
              className="flex shrink-0 items-center gap-2 rounded-full bg-white/80 px-4 py-2.5 text-sm font-semibold text-slate-800 transition-colors hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#4FC6F2]/40 focus:ring-offset-1 min-h-[48px]"
              aria-label="Úvodní stránka"
            >
              <Image
                src="/img/logos/pb-logo-no-bg.png"
                alt="Premium Brokers"
                width={132}
                height={44}
                className="h-9 w-auto sm:h-10"
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
            <nav className="hidden items-center gap-0.5 md:flex" aria-label="Hlavní navigace">
              {mainNav.slice(0, 3).map((item) => (
                <NavLink key={item.href + item.label} item={item} />
              ))}
              <div className="relative">
                <button
                  ref={toolsBtnRef}
                  type="button"
                  className="flex min-h-[46px] items-center gap-1 rounded-full px-4 py-2.5 text-base font-medium text-slate-700 transition hover:bg-white/60 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#4FC6F2]/40 focus:ring-offset-1 md:text-[1.0625rem]"
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
              className="header-cta lead-cta-btn hidden min-h-[48px] shrink-0 items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-semibold text-white no-underline transition focus:outline-none focus:ring-2 focus:ring-[#4FC6F2]/40 focus:ring-offset-1 md:flex md:text-[1.0625rem]"
            >
              <span>{cta.headerPrimary}</span>
              <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
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
        <div className="mobile-nav-panel absolute top-0 right-0 w-full max-w-sm h-full flex flex-col pt-20 px-6 pb-8">
          {mobileMenuLinks.map((item) => (
            <Link
              key={`m-${item.label}-${item.href}`}
              href={item.href}
              className="mobile-nav-link py-3 text-lg font-medium text-slate-800 border-b border-slate-100"
              onClick={closeMenu}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/#kontakt"
            className="mobile-nav-link lead-cta-btn mt-4 inline-flex items-center justify-center gap-2 py-4 rounded-xl text-white font-semibold text-center no-underline"
            onClick={() => {
              track(AnalyticsEvents.ctaClick, { cta_id: "mobile_drawer_contact" });
              closeMenu();
            }}
          >
            {cta.headerPrimary}
            <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </Link>
        </div>
      </nav>
    </>
  );
}
