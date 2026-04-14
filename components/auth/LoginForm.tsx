"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { AnalyticsEvents } from "@/lib/analytics/events";
import { track } from "@/lib/analytics/track";
import { safeInternalPath } from "@/lib/security/safeRedirectPath";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

type Props = { defaultNext?: string; errorKey?: string };

const errorMessages: Record<string, string> = {
  config: "Přihlášení do administrace není k dispozici. Obraťte se na správce webu.",
  auth: "Přihlášení se nezdařilo. Zkuste to znovu.",
  forbidden:
    "Tento účet nemá oprávnění do administrace. V Supabase musí existovat řádek v tabulce profiles (role admin nebo editor) se stejným id jako uživatel v Authentication.",
};

export function LoginForm({ defaultNext = "/admin", errorKey }: Props) {
  const searchParams = useSearchParams();
  const next = safeInternalPath(searchParams.get("next"), defaultNext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(errorKey ? errorMessages[errorKey] ?? null : null);

  async function onPasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (!isSupabaseConfigured()) {
      setMsg(errorMessages.config);
      return;
    }
    setBusy(true);
    try {
      const supabase = createBrowserSupabaseClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        track(AnalyticsEvents.adminLoginError, { method: "password" });
        setMsg(
          process.env.NODE_ENV === "development"
            ? `${errorMessages.auth} (${error.message})`
            : errorMessages.auth
        );
        return;
      }
      track(AnalyticsEvents.adminLoginSuccess, { method: "password" });
      window.location.href = next.startsWith("/") ? next : "/admin";
    } finally {
      setBusy(false);
    }
  }

  async function onMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (!isSupabaseConfigured()) {
      setMsg(errorMessages.config);
      return;
    }
    if (!email.trim()) {
      setMsg("Zadejte e-mail.");
      return;
    }
    setBusy(true);
    try {
      const supabase = createBrowserSupabaseClient();
      const origin = window.location.origin;
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      if (error) {
        setMsg(
          process.env.NODE_ENV === "development"
            ? `Odkaz se nepodařilo odeslat: ${error.message}`
            : "Odkaz se nepodařilo odeslat. Zkuste to znovu."
        );
        return;
      }
      setMsg("Odkaz pro přihlášení jsme vám poslali na e-mail.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      {msg && (
        <p
          className={`text-sm rounded-xl px-4 py-3 ${
            msg.includes("poslali") ? "bg-brand-cyan/10 text-brand-navy" : "bg-red-50 text-red-700"
          }`}
        >
          {msg}
        </p>
      )}
      <form className="space-y-4" onSubmit={onPasswordSubmit}>
        <div>
          <label htmlFor="login-email" className="block text-sm font-semibold text-brand-text mb-1.5">
            E-mail
          </label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-cyan focus:border-transparent"
          />
        </div>
        <div>
          <label htmlFor="login-password" className="block text-sm font-semibold text-brand-text mb-1.5">
            Heslo
          </label>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-cyan focus:border-transparent"
          />
        </div>
        <button
          type="submit"
          disabled={busy}
          className="w-full py-4 px-6 rounded-2xl bg-brand-navy text-white font-bold hover:bg-brand-navy/90 disabled:opacity-75"
        >
          {busy ? "Přihlašuji…" : "Přihlásit se"}
        </button>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-brand-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-wider">
          <span className="bg-white px-2 text-brand-muted">nebo</span>
        </div>
      </div>
      <form className="space-y-3" onSubmit={onMagicLink}>
        <p className="text-sm text-brand-muted">Pošleme vám jednorázový odkaz na e-mail (magic link).</p>
        <button
          type="submit"
          disabled={busy}
          className="w-full py-3 px-6 rounded-xl border-2 border-brand-navy text-brand-navy font-semibold hover:bg-brand-navy/5 disabled:opacity-75"
        >
          Poslat přihlašovací odkaz
        </button>
      </form>
    </div>
  );
}
