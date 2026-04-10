import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo/page-meta";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl() || "http://localhost:3000";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/auth/callback", "/login"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
