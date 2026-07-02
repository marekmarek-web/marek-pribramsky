"use client";

import type { ReactNode } from "react";
import { Suspense } from "react";
import { AttributionCapture } from "@/components/analytics/AttributionCapture";
import { PlausibleAnalytics } from "@/components/analytics/PlausibleAnalytics";
import { ConsentProvider } from "@/components/consent/ConsentContext";
import { CookieConsentBanner } from "@/components/consent/CookieConsentBanner";
import { SentryInit } from "@/components/providers/SentryInit";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ConsentProvider>
      {children}
      <CookieConsentBanner />
      <SentryInit />
      <Suspense fallback={null}>
        <AttributionCapture />
        <PlausibleAnalytics />
      </Suspense>
    </ConsentProvider>
  );
}
