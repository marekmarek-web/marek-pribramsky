import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

/** Kanonický základ webu (bez koncového lomítka). */
export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "";
}

/** OG + canonical pro běžné stránky (ne články). */
export function pageOg(path: string, title: string, description: string): Pick<Metadata, "openGraph" | "alternates"> {
  const base = getSiteUrl();
  const url = base ? `${base}${path}` : undefined;
  return {
    alternates: url ? { canonical: url } : undefined,
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      locale: "cs_CZ",
      type: "website",
    },
  };
}

export function homeMetadata(): Metadata {
  const title = "Marek Příbramský – Privátní finanční plánování";
  return {
    title: { absolute: title },
    description: siteConfig.defaultDescription,
    ...pageOg("/", title, siteConfig.defaultDescription),
  };
}
