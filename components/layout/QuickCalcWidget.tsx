"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { toolsDropdown } from "@/config/site";

export function QuickCalcWidget() {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!open || !root.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("click", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className={`qc-widget${open ? " open" : ""}`} ref={root} aria-label="Rychlé kalkulačky">
      <button
        type="button"
        className="qc-button"
        aria-expanded={open}
        aria-controls="qc-panel"
        onClick={() => setOpen((v) => !v)}
      >
        <svg className="h-5 w-5 text-white md:h-6 md:w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="4" y="3" width="16" height="18" rx="2" ry="2" />
          <line x1="8" y1="9" x2="16" y2="9" />
          <line x1="9" y1="13" x2="9" y2="13" />
          <line x1="12" y1="13" x2="12" y2="13" />
          <line x1="15" y1="13" x2="15" y2="13" />
          <line x1="9" y1="16" x2="9" y2="16" />
          <line x1="12" y1="16" x2="12" y2="16" />
        </svg>
      </button>
      <div id="qc-panel" className="qc-panel" role="dialog" aria-modal="false">
        <h3 className="text-sm font-bold text-brand-navy mb-1">Rychlé kalkulačky</h3>
        <p className="text-xs text-slate-500 mb-4">Vyberte, co chcete spočítat.</p>
        <div className="space-y-2 text-sm">
          {toolsDropdown.map((t) => (
            <Link key={t.href} href={t.href} className="qc-link" onClick={() => setOpen(false)}>
              <span className="qc-icon">
                <CalcIcon slug={t.href} />
              </span>
              <span>
                <span className="font-semibold block">{t.title}</span>
                <span className="block text-xs text-slate-500">{t.description}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function CalcIcon({ slug }: { slug: string }) {
  if (slug.includes("hypotecni")) {
    return (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    );
  }
  if (slug.includes("investicni")) {
    return (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M7 21V10M12 21V3M17 21v-6" />
      </svg>
    );
  }
  if (slug.includes("zivotni")) {
    return (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    );
  }
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12h8M12 8v8" />
    </svg>
  );
}
