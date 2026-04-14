"use client";

import Link from "next/link";
import { useState } from "react";
import { legalConfig } from "@/config/legal";
import { siteConfig } from "@/config/site";
import { pageUrl } from "@/lib/forms/page-url";
import { postSubscriberJson } from "@/lib/forms/postSubscriberApi";
import { CONSENT_TEXT_VERSION } from "@/lib/subscribers/domain";
import type { InterestSegment, SubscriberSource } from "@/lib/subscribers/domain";

type Props = {
  source: SubscriberSource;
  /** Výchozí segment publika (blog, kalkulačky, …). */
  interestSegment?: InterestSegment;
  /** Krátký popis, co člověk dostane (nad formulářem). */
  headline: string;
  /** Doplňující text pod nadpisem. */
  description?: string;
  /** Tailwind třídy pro obal (např. tmavá patička vs. světlý blog). */
  variant?: "light" | "dark";
  className?: string;
};

export function SubscribeInlineForm({
  source,
  interestSegment = "general_updates",
  headline,
  description,
  variant = "light",
  className = "",
}: Props) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [openedAt] = useState(() => Date.now());
  const [companyWebsite, setCompanyWebsite] = useState("");

  const isDark = variant === "dark";
  const labelCls = isDark ? "text-slate-300" : "text-brand-muted";
  const inputCls = isDark
    ? "w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 text-white placeholder:text-slate-500 focus:border-brand-cyan/50 focus:outline-none focus:ring-2 focus:ring-brand-cyan/35"
    : "w-full rounded-xl border border-brand-border px-3 py-2.5 text-brand-text focus:ring-2 focus:ring-brand-cyan focus:border-transparent";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await postSubscriberJson({
        email: email.trim(),
        name: name.trim() || undefined,
        source,
        interestSegment,
        sourcePath: pageUrl(),
        consentMarketing: consent,
        consentTextVersion: CONSENT_TEXT_VERSION,
        companyWebsite: companyWebsite.trim() || undefined,
        formOpenedAt: openedAt,
      });
      if (!res.ok) {
        if (res.error === "rate_limit") {
          setError("Příliš mnoho pokusů. Zkuste to za chvíli.");
        } else if (res.error === "too_fast") {
          setError("Zkuste formulář odeslat znovu za sekundu.");
        } else if (res.error === "validation") {
          setError("Zkontrolujte e-mail a souhlas.");
        } else if (res.error === "email_not_configured") {
          setError(`Odesílání není na serveru nakonfigurované. Napište na ${siteConfig.contactEmail}.`);
        } else {
          setError("Odeslání se nepodařilo. Zkuste to znovu.");
        }
        return;
      }
      setDone(true);
    } catch {
      setError("Chyba spojení. Zkuste to znovu.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div
        data-testid="subscribe-inline-success"
        className={`rounded-2xl border px-4 py-4 sm:px-5 ${isDark ? "border-white/15 bg-white/[0.06]" : "border-brand-border bg-emerald-50/90"} ${className}`}
        role="status"
      >
        <p className={`text-sm font-semibold ${isDark ? "text-white" : "text-emerald-900"}`}>Děkujeme</p>
        <p className={`mt-1 text-sm ${isDark ? "text-slate-300" : "text-emerald-800"}`}>
          Jste zapsáni k odběru. Občas pošleme tip z praxe nebo shrnutí nového článku. Odhlásit se můžete vždy jedním
          klikem v patičce kteréhokoli e-mailu.
        </p>
      </div>
    );
  }

  return (
    <div
      data-testid="subscribe-inline-form"
      className={`rounded-2xl border px-4 py-5 sm:px-6 ${isDark ? "border-white/10 bg-white/[0.04]" : "border-brand-border bg-white shadow-sm"} ${className}`}
    >
      <h3 className={`text-base font-bold ${isDark ? "text-white" : "text-brand-text"}`}>{headline}</h3>
      {description ? <p className={`mt-1 text-sm ${labelCls}`}>{description}</p> : null}

      <form className="mt-4 space-y-3" onSubmit={onSubmit}>
        <label htmlFor="sub-hp" className="sr-only">
          Nepřepisujte
        </label>
        <input
          id="sub-hp"
          type="text"
          tabIndex={-1}
          value={companyWebsite}
          onChange={(e) => setCompanyWebsite(e.target.value)}
          className="absolute h-px w-px overflow-hidden opacity-0"
          autoComplete="off"
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="sub-email" className={`mb-1 block text-xs font-semibold ${labelCls}`}>
              E-mail
            </label>
            <input
              id="sub-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vas@email.cz"
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="sub-name" className={`mb-1 block text-xs font-semibold ${labelCls}`}>
              Jméno (volitelně)
            </label>
            <input
              id="sub-name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jan"
              className={inputCls}
            />
          </div>
        </div>
        <div className="flex items-start gap-2">
          <input
            id="sub-consent"
            type="checkbox"
            required
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className={`mt-0.5 h-4 w-4 shrink-0 rounded border ${isDark ? "border-white/30 bg-white/10" : "border-brand-border"} text-brand-navy focus:ring-brand-cyan`}
          />
          <label htmlFor="sub-consent" className={`text-xs leading-snug ${labelCls}`}>
            Souhlasím se zasíláním novinek a tipů z praxe na tento e-mail. Zpracování:{" "}
            <Link href="/gdpr" className={isDark ? "text-brand-cyan hover:underline" : "text-brand-navy hover:underline"}>
              ochrana údajů
            </Link>
            . Marketingový souhlas je dobrovolný a oddělený od žádosti o konzultaci. Partner:{" "}
            <a
              href={legalConfig.partnerPrivacyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={isDark ? "text-brand-cyan hover:underline" : "text-brand-navy hover:underline"}
            >
              BEplan
            </a>
            . Verze textu: {CONSENT_TEXT_VERSION}.
          </label>
        </div>
        {error ? <p className="text-xs text-red-500">{error}</p> : null}
        <button
          type="submit"
          disabled={busy}
          className={
            isDark
              ? "w-full rounded-xl bg-brand-cyan py-2.5 text-sm font-semibold text-brand-navy hover:opacity-95 disabled:opacity-60"
              : "w-full rounded-xl bg-brand-navy py-2.5 text-sm font-semibold text-white hover:bg-brand-navy/90 disabled:opacity-60"
          }
        >
          {busy ? "Odesílám…" : "Přihlásit se k novinkám"}
        </button>
        <p className={`text-[11px] ${labelCls}`}>
          Máte dotaz místo newsletteru?{" "}
          <a href={`mailto:${siteConfig.contactEmail}`} className="font-semibold underline-offset-2 hover:underline">
            Napište přímo
          </a>
          .
        </p>
      </form>
    </div>
  );
}
