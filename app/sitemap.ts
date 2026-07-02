import type { MetadataRoute } from "next";
import { fetchPublishedPostsForSitemap } from "@/lib/posts";
import { getSiteUrl } from "@/lib/seo/page-meta";

const STATIC: { path: string; changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"]; priority: number }[] =
  [
    { path: "/", changeFrequency: "weekly", priority: 1 },
    { path: "/blog", changeFrequency: "weekly", priority: 0.85 },
    { path: "/kontakt", changeFrequency: "monthly", priority: 0.8 },
    { path: "/kalkulacky", changeFrequency: "monthly", priority: 0.8 },
    { path: "/hypotecnikalkulacka", changeFrequency: "monthly", priority: 0.75 },
    { path: "/investicnikalkulacka", changeFrequency: "monthly", priority: 0.75 },
    { path: "/zivotnikalkulacka", changeFrequency: "monthly", priority: 0.75 },
    { path: "/penzijnikalkulacka", changeFrequency: "monthly", priority: 0.75 },
    { path: "/spoluprace", changeFrequency: "monthly", priority: 0.7 },
    { path: "/kariera", changeFrequency: "monthly", priority: 0.65 },
    { path: "/cookies", changeFrequency: "yearly", priority: 0.3 },
    { path: "/gdpr", changeFrequency: "yearly", priority: 0.3 },
  ];

function resolveSitemapBase(): string {
  const base = getSiteUrl();
  if (base) return base;
  if (process.env.NODE_ENV === "production" && process.env.VERCEL === "1") {
    console.warn("[sitemap] NEXT_PUBLIC_SITE_URL is not set in production");
  }
  return "http://localhost:3000";
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = resolveSitemapBase();
  const staticLastModified = new Date("2026-01-01");

  const staticEntries: MetadataRoute.Sitemap = STATIC.map(({ path, changeFrequency, priority }) => ({
    url: `${base}${path}`,
    lastModified: staticLastModified,
    changeFrequency,
    priority,
  }));

  let blogEntries: MetadataRoute.Sitemap = [];
  try {
    const posts = await fetchPublishedPostsForSitemap();
    blogEntries = posts.map(({ slug, lastModified }) => ({
      url: `${base}/blog/${slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch {
    /* Supabase nedostupné při buildu */
  }

  return [...staticEntries, ...blogEntries];
}
