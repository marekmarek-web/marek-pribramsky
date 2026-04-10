"use client";

import { useState } from "react";
import { pageUrl } from "@/lib/forms/leadSubmit";
import { postLeadJson } from "@/lib/forms/postLeadApi";

export function FooterLeadForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [interest, setInterest] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [openedAt] = useState(() => Date.now());
  const [companyWebsite, setCompanyWebsite] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    if (!name.trim()) {
      setErr("Vyplňte jméno.");
      return;
    }
    if (!email.trim()) {
      setErr("Vyplňte e-mail.");
      return;
    }
    setBusy(true);
    try {
      const res = await postLeadJson({
        source: "footer_quick",
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        interest: interest || undefined,
        sourcePath: pageUrl(),
        companyWebsite: companyWebsite.trim() || undefined,
        formOpenedAt: openedAt,
        resultSummary: `Zájem z patičky: ${interest || "neuvedeno"}`,
      });
      if (!res.ok) {
        if (res.error === "email_not_configured") {
          setErr("E-mailový odesílání není na serveru nastavené. Napište na pribramsky@premiumbrokers.cz.");
        } else {
          setErr("Odeslání se nepodařilo. Zkuste to znovu.");
        }
        return;
      }
      setName("");
      setEmail("");
      setPhone("");
      setInterest("");
      setMsg("Děkujeme, brzy se ozveme.");
    } catch {
      setErr("Chyba spojení. Zkuste to znovu.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form id="footer-quick-lead" className="grid gap-3 text-sm sm:grid-cols-2 sm:gap-4" onSubmit={onSubmit}>
      <label className="sr-only" htmlFor="footer-hp">
        Nepřepisujte
      </label>
      <input
        id="footer-hp"
        type="text"
        tabIndex={-1}
        value={companyWebsite}
        onChange={(e) => setCompanyWebsite(e.target.value)}
        className="absolute h-px w-px overflow-hidden opacity-0"
        autoComplete="off"
      />
      <div className="sm:col-span-1">
        <label htmlFor="footer-name" className="mb-1 block text-slate-400">
          Jméno
        </label>
        <input
          id="footer-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          className="w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 text-white placeholder:text-slate-500 focus:border-brand-cyan/50 focus:outline-none focus:ring-2 focus:ring-brand-cyan/35"
          placeholder="Jan Novák"
        />
      </div>
      <div className="sm:col-span-1">
        <label htmlFor="footer-email" className="mb-1 block text-slate-400">
          E-mail
        </label>
        <input
          id="footer-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          className="w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 text-white placeholder:text-slate-500 focus:border-brand-cyan/50 focus:outline-none focus:ring-2 focus:ring-brand-cyan/35"
          placeholder="jan@email.cz"
        />
      </div>
      <div className="sm:col-span-1">
        <label htmlFor="footer-phone" className="mb-1 block text-slate-400">
          Telefon (volitelně)
        </label>
        <input
          id="footer-phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          autoComplete="tel"
          className="w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 text-white placeholder:text-slate-500 focus:border-brand-cyan/50 focus:outline-none focus:ring-2 focus:ring-brand-cyan/35"
        />
      </div>
      <div className="sm:col-span-1">
        <label htmlFor="footer-interest" className="mb-1 block text-slate-400">
          Zájem
        </label>
        <select
          id="footer-interest"
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
          className="w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 text-white focus:border-brand-cyan/50 focus:outline-none focus:ring-2 focus:ring-brand-cyan/35"
        >
          <option value="">— vyberte —</option>
          <option value="investice">Investice</option>
          <option value="hypoteka">Hypotéka</option>
          <option value="pojisteni">Pojištění</option>
          <option value="duchod">Důchod / penze</option>
          <option value="jine">Jiné</option>
        </select>
      </div>
      <div className="sm:col-span-2">
        {err && <p className="text-xs text-red-300">{err}</p>}
        {msg && <p className="text-xs text-brand-cyan">{msg}</p>}
        <button
          type="submit"
          disabled={busy}
          className="mt-1 w-full min-h-[44px] rounded-xl bg-brand-cyan py-2.5 font-semibold text-brand-navy transition hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy disabled:opacity-70"
        >
          {busy ? "Odesílám…" : "Odeslat"}
        </button>
      </div>
    </form>
  );
}
