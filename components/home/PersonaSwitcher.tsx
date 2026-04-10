"use client";

import Link from "next/link";
import { useCallback, useId, useState } from "react";
import { personaContent, type PersonaId } from "@/components/home/home-data";

export function PersonaSwitcher() {
  const baseId = useId();
  const [active, setActive] = useState<PersonaId>("rodina");

  const indexOf = useCallback((id: PersonaId) => personaContent.findIndex((p) => p.id === id), []);

  const focusAndSet = useCallback((id: PersonaId) => {
    setActive(id);
    requestAnimationFrame(() => {
      document.getElementById(`${baseId}-tab-${id}`)?.focus();
    });
  }, [baseId]);

  const onTabKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, id: PersonaId) => {
      const idx = indexOf(id);
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        const next = personaContent[(idx + 1) % personaContent.length];
        focusAndSet(next.id);
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        const next = personaContent[(idx - 1 + personaContent.length) % personaContent.length];
        focusAndSet(next.id);
      }
      if (e.key === "Home") {
        e.preventDefault();
        focusAndSet(personaContent[0].id);
      }
      if (e.key === "End") {
        e.preventDefault();
        focusAndSet(personaContent[personaContent.length - 1].id);
      }
    },
    [focusAndSet, indexOf],
  );

  return (
    <div className="persona-switcher-root">
      <div
        className="persona-segmented flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-2"
        role="tablist"
        aria-label="Typ klienta"
      >
        {personaContent.map((p) => {
          const selected = active === p.id;
          return (
            <button
              key={p.id}
              type="button"
              id={`${baseId}-tab-${p.id}`}
              role="tab"
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${p.id}`}
              tabIndex={selected ? 0 : -1}
              className={`persona-segment-btn rounded-2xl px-4 py-3 text-left text-sm font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:min-w-[11rem] sm:text-center ${
                selected
                  ? "bg-brand-navy text-white shadow-lg shadow-brand-navy/20"
                  : "bg-white/80 text-slate-700 hover:bg-white hover:text-brand-navy"
              }`}
              onClick={() => setActive(p.id)}
              onKeyDown={(e) => onTabKeyDown(e, p.id)}
            >
              {p.tabLabel}
            </button>
          );
        })}
      </div>

      <div className="mt-8 sm:mt-10">
        {personaContent.map((p) => (
          <article
            key={p.id}
            role="tabpanel"
            id={`${baseId}-panel-${p.id}`}
            aria-labelledby={`${baseId}-tab-${p.id}`}
            hidden={active !== p.id}
            className="persona-switcher-panel rounded-2xl border border-white/60 bg-white/70 p-6 shadow-sm backdrop-blur-md sm:p-8"
            style={active === p.id ? { animation: "personaFadeIn 0.4s ease forwards" } : undefined}
          >
            <div className="mx-auto max-w-2xl text-center sm:max-w-none sm:text-left">
              <h3 className="text-xl font-bold leading-snug text-brand-text sm:text-2xl">{p.headline}</h3>
              <p className="mt-4 text-base leading-relaxed text-brand-muted">{p.description}</p>

              <div className="mt-6 grid gap-6 sm:grid-cols-2 sm:gap-8 sm:text-left">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Co získáte</p>
                  <ul className="mt-3 space-y-2.5 text-left text-sm text-slate-700">
                    {p.benefits.map((b) => (
                      <li key={b} className="flex gap-2">
                        <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-brand-cyan" aria-hidden />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Typické situace</p>
                  <ul className="mt-3 space-y-2 text-left text-sm text-slate-700">
                    {p.scenarios.map((s) => (
                      <li key={s} className="rounded-lg border border-dashed border-slate-200/90 bg-slate-50/80 px-3 py-2">
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 flex justify-center sm:justify-start">
                <Link
                  href={p.ctaHref}
                  className="lead-cta-btn inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-8 py-3 text-sm font-semibold no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/50 focus-visible:ring-offset-2"
                >
                  {p.ctaLabel}
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
