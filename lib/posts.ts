import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";

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
};

const publicPostFields =
  "id, slug, title, excerpt, body, category, published, published_at, updated_at, cover_image_url, seo_title, seo_description, canonical_url, author_id, author_name, reading_time, featured, og_image_url, content_type";

export function formatPostDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("cs-CZ", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
}

export async function fetchPublishedPosts(limit?: number): Promise<BlogPost[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const supabase = await createServerSupabaseClient();
    let q = supabase
      .from("posts")
      .select(publicPostFields)
      .eq("published", true)
      .order("published_at", { ascending: false });
    if (limit != null) q = q.limit(limit);
    const { data, error } = await q;
    if (error || !data) return [];
    return data as BlogPost[];
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
