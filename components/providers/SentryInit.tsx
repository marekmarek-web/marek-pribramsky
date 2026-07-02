"use client";

import { useEffect } from "react";

/** Načte Sentry až po prvním paintu — neblokuje initial bundle. */
export function SentryInit() {
  useEffect(() => {
    void import("../../sentry.client.config");
  }, []);
  return null;
}
