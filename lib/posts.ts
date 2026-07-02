import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export { formatPostDate } from "@/lib/format/date";

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string;
  category: string;
  published: boolean;
  published_at: string | null;
  cover_image_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
  canonical_url: string | null;
  author_id: string | null;
  author_name: string | null;
  reading_time: number | null;
  featured: boolean;
  og_image_url: string | null;
  content_type: string;
  updated_at?: string | null;
  /** Admin / operativa — nepoužívá veřejný výpis článků. */
  distribution_status?: string | null;
  promoted_at?: string | null;
  newsletter_ready?: boolean | null;
};

/** Sloupce pro výpis blogu / homepage — bez `body` (velké payloady). */
const listingPostFields =
  "id, slug, title, category, published_at, cover_image_url, reading_time";

export type BlogPostListItem = Pick<
  BlogPost,
  "id" | "slug" | "title" | "category" | "published_at" | "cover_image_url" | "reading_time"
>;

const publicPostFields =
  "id, slug, title, excerpt, body, category, published, published_at, updated_at, cover_image_url, seo_title, seo_description, canonical_url, author_id, author_name, reading_time, featured, og_image_url, content_type";

/**
 * Publikované články pro výpis (blog, úvod) — bez těla článku kvůli menšímu přenosu z DB a HTML.
 */
export async function fetchPublishedPosts(limit?: number): Promise<BlogPostListItem[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const supabase = await createServerSupabaseClient();
    let q = supabase
      .from("posts")
      .select(listingPostFields)
      .eq("published", true)
      .order("published_at", { ascending: false });
    if (limit != null) q = q.limit(limit);
    const { data, error } = await q;
    if (error || !data) return [];
    return data as BlogPostListItem[];
  } catch {
    return [];
  }
}

export async function fetchPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("posts")
      .select(publicPostFields)
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    if (error || !data) return null;
    return data as BlogPost;
  } catch {
    return null;
  }
}

export async function fetchAllPostSlugs(): Promise<string[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.from("posts").select("slug").eq("published", true);
    if (error || !data) return [];
    return data.map((r) => r.slug as string);
  } catch {
    return [];
  }
}

export type SitemapPostEntry = { slug: string; lastModified: Date };

/** Pro sitemap — slug + reálné datum poslední úpravy / publikace. */
export async function fetchPublishedPostsForSitemap(): Promise<SitemapPostEntry[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("posts")
      .select("slug, updated_at, published_at")
      .eq("published", true);
    if (error || !data) return [];
    return data.map((row) => ({
      slug: row.slug as string,
      lastModified: new Date(
        (row.updated_at as string | null) ?? (row.published_at as string | null) ?? Date.now(),
      ),
    }));
  } catch {
    return [];
  }
}
