import type { BlogPost } from "@/lib/posts";
import { getSiteUrl } from "@/lib/seo/page-meta";

export function buildArticleJsonLd(post: BlogPost): Record<string, unknown> {
  const base = getSiteUrl();
  const url = base ? `${base}/blog/${post.slug}` : undefined;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || post.seo_description || undefined,
    datePublished: post.published_at || undefined,
    dateModified: post.updated_at || post.published_at || undefined,
    author: post.author_name
      ? { "@type": "Person", name: post.author_name }
      : { "@type": "Organization", name: "Premium Brokers" },
    publisher: {
      "@type": "Organization",
      name: "Premium Brokers",
    },
    mainEntityOfPage: url ? { "@type": "WebPage", "@id": url } : undefined,
    image: post.cover_image_url || post.og_image_url || undefined,
    articleSection: post.category || undefined,
    keywords: post.content_type || "blog",
  };
}
