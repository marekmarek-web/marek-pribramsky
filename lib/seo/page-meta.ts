import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

/** Kanonický základ webu (bez koncového lomítka). */
export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "";
}

/** Výchozí OG/Twitter obrázek pro marketingové stránky. */
export const DEFAULT_OG_IMAGE_PATH = "/img/logos/pb-logo-no-bg.png";

function defaultOgImages() {
  return [{ url: DEFAULT_OG_IMAGE_PATH, alt: siteConfig.name }];
}

/** OG + canonical pro běžné stránky (ne články). */
export function pageOg(path: string, title: string, description: string): Pick<Metadata, "openGraph" | "twitter" | "alternates"> {
  const base = getSiteUrl();
  const url = base ? `${base}${path}` : undefined;
  const images = defaultOgImages();
  return {
    alternates: url ? { canonical: url } : undefined,
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      locale: "cs_CZ",
      type: "website",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images.map((img) => img.url),
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
