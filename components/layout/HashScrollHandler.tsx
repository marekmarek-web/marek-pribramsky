"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const HEADER_OFFSET = 88;
const MAX_RETRIES = 40;
const RETRY_MS = 120;

function scrollToHash(hash: string, attempt = 0) {
  const id = hash.replace(/^#/, "");
  if (!id) return;

  const el = document.getElementById(id);
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
    window.scrollTo({ top: Math.max(0, top), behavior: attempt === 0 ? "auto" : "smooth" });
    return;
  }

  if (attempt < MAX_RETRIES) {
    window.setTimeout(() => scrollToHash(hash, attempt + 1), RETRY_MS);
  }
}

export function HashScrollHandler() {
  const pathname = usePathname();

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    scrollToHash(hash);

    const onReady = () => scrollToHash(hash);
    window.addEventListener("pb:page-ready", onReady);
    return () => window.removeEventListener("pb:page-ready", onReady);
  }, [pathname]);

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash;
      if (hash) scrollToHash(hash);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return null;
}
