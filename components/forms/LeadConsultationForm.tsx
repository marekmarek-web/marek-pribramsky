"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cta } from "@/config/cta";
import { siteConfig } from "@/config/site";
import { AnalyticsEvents } from "@/lib/analytics/events";
import { track } from "@/lib/analytics/track";
import { pageUrl } from "@/lib/forms/page-url";
import { postLeadJson } from "@/lib/forms/postLeadApi";

const TOPICS: { key: string; label: string }[] = [
  { key: "investice", label: "Investice a portfolio" },
  { key: "hypoteka", label: "Hypotéka / bydlení" },
  { key: "smlouvy", label: "Zkontrolovat smlouvy" },
  { key: "firemni", label: "Firemní finance" },
];

type LeadConsultationFormProps = {
  source?: "homepage_consultation" | "contact_page";
};

export function LeadConsultationForm({ source = "homepage_consultation" }: LeadConsultationFormProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [topic, setTopic] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [openedAt] = useState(() => Date.now());
  const [companyWebsite, setCompanyWebsite] = useState("");

  useEffect(() => {
    if (step === 2) {
      track(AnalyticsEvents.leadModalOpen, { funnel: source === "contact_page" ? "contact_page" : "homepage_consultation" });
    }
  }, [step, source]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await postLeadJson({
        source,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        topic: topic || undefined,
        consent,
        sourcePath: pageUrl(),
        resultSummary: `Nezávazná konzultace — téma: ${topic}`,
        companyWebsite: companyWebsite.trim() || undefined,
        formOpenedAt: openedAt,
      });
      if (!res.ok) {
        if (res.error === "email_not_configured") {
          setError(`Odesílání zatím není nakonfigurované. Napište na ${siteConfig.contactEmail}.`);
        } else if (res.error === "too_fast") {
          setError("Zkuste formulář odeslat znovu za chvíli.");
        } else if (res.error === "rate_limit") {
          setError("Příliš mnoho pokusů. Zkuste to za chvíli.");
        } else {
          setError("Nepodařilo se odeslat. Zkuste to prosím znovu.");
        }
        return;
      }
      setDone(true);
    } catch {
      setError("Nepodařilo se odeslat. Zkuste to prosím znovu.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 rounded-full bg-brand-cyan/20 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-brand-navy mb-2">Děkujeme — zpráva je u nás</h3>
        <p className="text-brand-muted">
          Ozveme se obvykle do jednoho pracovního dne s návrhem termínu. Spěcháte? Zavolejte na{" "}
          <a href={`tel:${siteConfig.phoneTel}`} className="font-semibold text-brand-navy hover:text-brand-cyan">
            {siteConfig.phoneDisplay}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <>
      {step === 1 && (
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-navy mb-2">S čím začneme?</h2>
          <p className="text-brand-muted leading-relaxed mb-6">Vyberte oblast — v dalším kroku doplníte kontakt.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TOPICS.map((t) => (
              <button
                key={t.key}
                type="button"
                className="smart-choice p-4 rounded-xl text-left font-semibold text-brand-navy border-2 border-slate-200 hover:border-brand-cyan hover:bg-brand-cyan/5 transition-all"
                onClick={() => {
                  setTopic(t.key);
                  track(AnalyticsEvents.ctaClick, { cta_id: "home_consultation_topic", topic: t.key });
                  setStep(2);
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
          <p className="text-center text-xs text-brand-muted mt-6">
            Úvodní orientace bez poplatku. Bez závazku pokračovat — rozhodnutí je vždy na vás.
          </p>
        </div>
      )}
      {step === 2 && (
        <div>
          <h3 className="text-xl font-bold text-brand-navy mb-2">Poslední krok</h3>
          <p className="text-brand-muted mb-6">
            Kam vám napíšu návrh termínu krátkého hovoru? Obvykle stačí 15 minut — podle vašeho času, osobně nebo online.
          </p>
          <form className="space-y-4 text-left" onSubmit={onSubmit}>
            <input type="hidden" name="topic" value={topic} readOnly />
            <label className="sr-only" htmlFor="lead-hp">
              Nepřepisujte
            </label>
            <input
              id="lead-hp"
              type="text"
              tabIndex={-1}
              value={companyWebsite}
              onChange={(e) => setCompanyWebsite(e.target.value)}
              className="sr-only"
              autoComplete="off"
            />
            <div>
              <label htmlFor="lead-name" className="block text-sm font-semibold text-brand-navy mb-1">
                Jméno
              </label>
              <input
                id="lead-name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jan Novák"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/80 text-brand-text placeholder-slate-400 focus:ring-2 focus:ring-brand-cyan/40 focus:border-brand-cyan"
              />
            </div>
            <div>
              <label htmlFor="lead-email" className="block text-sm font-semibold text-brand-navy mb-1">
                E-mail
              </label>
              <input
                id="lead-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jan@email.cz"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/80 text-brand-text placeholder-slate-400 focus:ring-2 focus:ring-brand-cyan/40 focus:border-brand-cyan"
              />
            </div>
            <div>
              <label htmlFor="lead-phone" className="block text-sm font-semibold text-brand-navy mb-1">
                Telefon <span className="text-slate-400 font-normal">(volitelné)</span>
              </label>
              <input
                id="lead-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+420 123 456 789"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/80 text-brand-text placeholder-slate-400 focus:ring-2 focus:ring-brand-cyan/40 focus:border-brand-cyan"
              />
            </div>
            <div className="flex items-start gap-3">
              <input
                id="lead-consent"
                type="checkbox"
                required
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-slate-300 text-brand-navy focus:ring-brand-cyan"
              />
              <label htmlFor="lead-consent" className="text-sm text-brand-muted">
                Souhlasím se{" "}
                <Link href="/gdpr" className="text-brand-cyan hover:underline">
                  zpracováním osobních údajů
                </Link>
                .
              </label>
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button type="submit" disabled={busy} className="lead-cta-btn w-full py-4 px-6 rounded-xl text-white font-bold transition">
              {busy ? "Odesílám…" : cta.homeLeadSubmit}
            </button>
            <p className="text-center text-xs text-brand-muted">Odpovídám osobně — ne automatický systém.</p>
          </form>
        </div>
      )}
    </>
  );
}
