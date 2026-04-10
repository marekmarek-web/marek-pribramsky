import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogCoverImage } from "@/components/blog/BlogCoverImage";
import { BlogMarkdown } from "@/components/blog/BlogMarkdown";
import { fetchAllPostSlugs, fetchPostBySlug, formatPostDate } from "@/lib/posts";
import { buildArticleJsonLd } from "@/lib/seo/article-jsonld";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

function siteBase(): string {
  const u = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (u) return u.replace(/\/$/, "");
  return "";
}

export async function generateStaticParams() {
  const slugs = await fetchAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchPostBySlug(slug);
  if (!post) return { title: "Článek" };

  const base = siteBase();
  const path = `/blog/${post.slug}`;
  const canonical = post.canonical_url?.trim() || (base ? `${base}${path}` : undefined);
  const title = post.seo_title?.trim() || post.title;
  const description = post.seo_description?.trim() || post.excerpt || undefined;
  const ogImage = post.og_image_url?.trim() || post.cover_image_url || undefined;

  return {
    title,
    description,
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.published_at ?? undefined,
      url: canonical,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = await fetchPostBySlug(slug);
  if (!post) notFound();

  const label =
    post.content_type === "article"
      ? "Článek"
      : post.content_type === "insight"
        ? "Insight"
        : "Blog";

  const jsonLd = buildArticleJsonLd(post);

  return (
    <main className="main-with-header pt-24 pb-20 lg:pb-28">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <p className="text-xs font-semibold text-brand-cyan uppercase tracking-wider mb-2">
          {post.category || label}
        </p>
        <h1 className="section-title font-bold text-brand-text mb-2">{post.title}</h1>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-brand-muted mb-8">
          <time dateTime={post.published_at ?? undefined}>{formatPostDate(post.published_at)}</time>
          {post.author_name ? <span>{post.author_name}</span> : null}
          {post.reading_time != null && post.reading_time > 0 ? (
            <span>{post.reading_time} min čtení</span>
          ) : null}
        </div>
        {post.cover_image_url ? (
          <div className="rounded-2xl overflow-hidden border border-brand-border mb-10">
            <BlogCoverImage
              src={post.cover_image_url}
              alt=""
              sizes="(max-width:768px) 100vw, 768px"
              priority
            />
          </div>
        ) : null}
        {post.excerpt ? (
          <p className="text-lg text-brand-muted mb-8 leading-relaxed border-l-4 border-brand-cyan/40 pl-4">
            {post.excerpt}
          </p>
        ) : null}
        <BlogMarkdown body={post.body} />
        <p className="mt-12">
          <Link href="/blog" className="text-brand-navy font-semibold hover:text-brand-cyan">
            ← Zpět na blog
          </Link>
        </p>
      </div>
    </main>
  );
}
