"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { hasConsentDecision, readConsent, writeConsent } from "@/lib/consent/storage";

type ConsentContextValue = {
  /** Hydratováno z localStorage */
  ready: boolean;
  /** Uživatel už zvolil (nebo zavřel bez analytiky) */
  decided: boolean;
  analytics: boolean;
  setEssentialOnly: () => void;
  setAnalyticsAccepted: () => void;
};

const ConsentContext = createContext<ConsentContextValue | null>(null);

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [decided, setDecided] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    const forceBanner = process.env.NEXT_PUBLIC_SHOW_COOKIE_BANNER_IN_DEV === "1";
    const host =
      typeof window !== "undefined" ? window.location.hostname.toLowerCase() : "";
    const isLoopback = host === "localhost" || host === "127.0.0.1" || host.endsWith(".localhost");
    const skipBanner = !forceBanner && (process.env.NODE_ENV === "development" || isLoopback);

    if (skipBanner) {
      setDecided(true);
      setAnalytics(false);
      setReady(true);
      return;
    }

    const c = readConsent();
    setDecided(hasConsentDecision());
    setAnalytics(c?.analytics === true);
    setReady(true);
  }, []);

  const setEssentialOnly = useCallback(() => {
    writeConsent(false);
    setAnalytics(false);
    setDecided(true);
    window.dispatchEvent(new Event("pb-consent-changed"));
  }, []);

  const setAnalyticsAccepted = useCallback(() => {
    writeConsent(true);
    setAnalytics(true);
    setDecided(true);
    window.dispatchEvent(new Event("pb-consent-changed"));
  }, []);

  const value = useMemo(
    () => ({
      ready,
      decided,
      analytics,
      setEssentialOnly,
      setAnalyticsAccepted,
    }),
    [ready, decided, analytics, setEssentialOnly, setAnalyticsAccepted],
  );

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}

export function useConsent() {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error("useConsent must be used within ConsentProvider");
  return ctx;
}

/** Čtení bez throw (např. analytics track). */
export function useConsentOptional(): ConsentContextValue | null {
  return useContext(ConsentContext);
}
