"use client";

import Link from "next/link";
import type { ServiceItem } from "@/components/home/home-data";

type ServiceCardProps = {
  item: ServiceItem;
  open: boolean;
  onToggle: () => void;
  panelId: string;
  triggerId: string;
};

export function ServiceCard({ item, open, onToggle, panelId, triggerId }: ServiceCardProps) {
  return (
    <div
      className={`sluzby-accordion-card rounded-2xl border bg-white/[0.97] shadow-lg backdrop-blur-xl transition-all duration-300 ${
        open
          ? "is-open border-brand-cyan/60 shadow-xl ring-2 ring-brand-cyan/35"
          : "border-white/80 hover:border-white hover:shadow-xl"
      }`}
    >
      <button
        type="button"
        id={triggerId}
        className="sluzby-acc-trigger flex min-h-[52px] w-full cursor-pointer flex-col items-center gap-1 rounded-2xl p-5 text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/50 focus-visible:ring-offset-2 sm:min-h-[56px] sm:p-6"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle();
          }
        }}
      >
        <div className="mb-2 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-cyan/10 sm:h-14 sm:w-14">
          <svg className="h-6 w-6 text-brand-navy sm:h-7 sm:w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.iconD} />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-brand-navy sm:text-xl">{item.title}</h3>
        <p className="text-sm text-slate-600">{item.subtitle}</p>
        <svg
          className={`sluzby-acc-chevron mt-2 h-5 w-5 text-brand-navy/50 transition-transform duration-300 ease-out ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="border-t border-slate-200/80 px-5 pb-5 pt-1 sm:px-6 sm:pb-6">
            <p className="text-center text-sm leading-relaxed text-slate-700 sm:text-left">{item.detail}</p>
            <Link
              href={item.ctaHref}
              className="sluzby-acc-cta mt-4 inline-flex min-h-[44px] w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy"
            >
              {item.ctaLabel}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
