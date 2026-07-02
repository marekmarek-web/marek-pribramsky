"use client";

import { useEffect } from "react";
import { useConsentOptional } from "@/components/consent/ConsentContext";
import { captureSessionAttribution } from "@/lib/analytics/attribution";

/** Uloží landing path (+ UTM po souhlasu s analytikou) do sessionStorage. */
export function AttributionCapture() {
  const consent = useConsentOptional();

  useEffect(() => {
    if (!consent?.ready || !consent.decided) return;
    captureSessionAttribution({ includeUtm: consent.analytics });
  }, [consent?.ready, consent?.decided, consent?.analytics]);

  useEffect(() => {
    function onConsentChanged() {
      if (!consent?.decided) return;
      captureSessionAttribution({ includeUtm: consent.analytics, force: true });
    }
    window.addEventListener("pb-consent-changed", onConsentChanged);
    return () => window.removeEventListener("pb-consent-changed", onConsentChanged);
  }, [consent?.decided, consent?.analytics]);

  return null;
}
