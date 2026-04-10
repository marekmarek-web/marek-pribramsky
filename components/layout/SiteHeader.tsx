"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { mainNav, mobileMenuLinks, toolsDropdown, type NavItem } from "@/config/site";

const CALC_PATHS = [
  "/hypotecnikalkulacka",
  "/investicnikalkulacka",
  "/zivotnikalkulacka",
  "/penzijnikalkulacka",
];

function isCalculatorRoute(path: string) {
  return CALC_PATHS.some((p) => path === p || path.startsWith(`${p}/`));
}

function NavLink({ item, onNavigate }: { item: NavItem; onNavigate?: () => void }) {
  const className =
    "rounded-full px-3 py-2 text-sm font-medium text-slate-700 hover:bg-white/60 hover:text-slate-900 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4FC6F2]/50 focus-visible:ring-offset-2";
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
  const pathname = usePathname();
  const reveal = isCalculatorRoute(pathname ?? "");
  const isHome = pathname === "/";
  const [open, setOpen] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(!(isHome || reveal));
  const toolsBtnRef = useRef<HTMLButtonElement>(null);
  const toolsPanelRef = useRef<HTMLDivElement>(null);
  const [toolsOpen, setToolsOpen] = useState(false);

  useEffect(() => {
    if (reveal) {
      const onScroll = () => setHeaderVisible(window.scrollY > 80);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }
    if (isHome) {
      const onScroll = () => setHeaderVisible(window.scrollY > 140);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }
    setHeaderVisible(true);
    return;
  }, [reveal, isHome, pathname]);

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

  const headerClass =
    headerVisible
      ? "header-entry fixed top-0 left-0 right-0 z-50 transition-transform duration-500 ease-out visible"
      : "header-entry fixed top-0 left-0 right-0 z-50 transition-transform duration-500 ease-out";

  return (
    <>
      <header id="main-header" className={headerClass} role="banner">
        <div className="header-inner max-w-6xl mx-auto px-4 pt-4 pb-2">
          <div className="header-pill-glass px-3 py-2 flex justify-between items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-white/90 transition-colors focus:outline-none focus:ring-2 focus:ring-[#4FC6F2]/40 focus:ring-offset-1 shrink-0"
              aria-label="Úvodní stránka"
            >
              <Image
                src="/img/logos/pb-logo-no-bg.png"
                alt="Premium Brokers"
                width={120}
                height={40}
                className="h-8 w-auto"
                priority
              />
            </Link>
            <button
              type="button"
              className="hamburger-btn md:hidden flex items-center justify-center w-11 h-11 rounded-full text-slate-700 hover:bg-slate-100 transition focus:outline-none focus:ring-2 focus:ring-[#4FC6F2]/40"
              aria-label={open ? "Zavřít menu" : "Otevřít menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <nav className="hidden md:flex items-center gap-1" aria-label="Hlavní navigace">
              {mainNav.slice(0, 3).map((item) => (
                <NavLink key={item.href + item.label} item={item} />
              ))}
              <div className="relative">
                <button
                  ref={toolsBtnRef}
                  type="button"
                  className="rounded-full px-3 py-2 text-sm font-medium text-slate-700 hover:bg-white/60 hover:text-slate-900 transition flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-[#4FC6F2]/40 focus:ring-offset-1"
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
              className="header-cta lead-cta-btn hidden md:flex items-center justify-center gap-2 rounded-full text-white px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-[#4FC6F2]/40 focus:ring-offset-1 shrink-0 no-underline"
            >
              <span>Kontaktujte mě</span>
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            className="mobile-nav-link lead-cta-btn mt-4 py-4 rounded-xl text-white font-semibold text-center no-underline"
            onClick={closeMenu}
          >
            Kontaktujte mě
          </Link>
        </div>
      </nav>
    </>
  );
}
