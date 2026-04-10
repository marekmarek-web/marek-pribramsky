"use server";

import { requireEditor } from "@/lib/admin/require-editor";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const postSchema = z.object({
  id: z.preprocess(
    (v) => (v === "" || v == null ? undefined : v),
    z.string().uuid().optional()
  ),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug: jen malá písmena, čísla a pomlčky."),
  title: z.string().trim().min(1).max(300),
  excerpt: z.string().trim().max(2000).optional(),
  body: z.string().max(100_000).default(""),
  category: z.string().trim().max(100).default(""),
  published: z.boolean(),
  published_at: z.preprocess(
    (v) => (v === "" || v == null ? null : String(v)),
    z.string().max(50).nullable()
  ),
  cover_image_url: z.string().trim().max(2000).optional().nullable(),
  seo_title: z.string().trim().max(500).optional().nullable(),
  seo_description: z.string().trim().max(2000).optional().nullable(),
  canonical_url: z.string().trim().max(2000).optional().nullable(),
  reading_time: z.preprocess((v) => {
    if (v === "" || v == null) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }, z.number().int().min(0).max(600).nullable()),
  featured: z.boolean().optional(),
  og_image_url: z.string().trim().max(2000).optional().nullable(),
  content_type: z.enum(["blog", "article", "insight"]).default("blog"),
  _intent: z.preprocess(
    (v) => (v === "" || v == null ? "save" : String(v)),
    z.enum(["save", "draft", "publish"])
  ),
});

export type SavePostState = { error: string } | null;

function resolvePublishedAndDate(
  parsed: z.infer<typeof postSchema>,
  rawPublishedAt: string | null
): { published: boolean; published_at: string | null } {
  const intent = parsed._intent ?? "save";
  let published = parsed.published;
  let publishedAt = rawPublishedAt;

  if (intent === "draft") {
    published = false;
  } else if (intent === "publish") {
    published = true;
    if (!publishedAt) {
      publishedAt = new Date().toISOString();
    }
  }

  return { published, published_at: publishedAt };
}

export async function savePostAction(_prev: SavePostState, formData: FormData): Promise<SavePostState> {
  const { supabase, user } = await requireEditor();

  const idRaw = formData.get("id");
  const raw = {
    id: typeof idRaw === "string" && idRaw ? idRaw : undefined,
    slug: formData.get("slug"),
    title: formData.get("title"),
    excerpt: formData.get("excerpt") || undefined,
    body: formData.get("body") ?? "",
    category: formData.get("category") ?? "",
    published: formData.get("published") === "on",
    published_at: formData.get("published_at") || null,
    cover_image_url: formData.get("cover_image_url") || null,
    seo_title: formData.get("seo_title") || null,
    seo_description: formData.get("seo_description") || null,
    canonical_url: formData.get("canonical_url") || null,
    reading_time: formData.get("reading_time") || null,
    featured: formData.get("featured") === "on",
    og_image_url: formData.get("og_image_url") || null,
    content_type: formData.get("content_type") ?? "blog",
    _intent: formData.get("_intent"),
  };

  const parsed = postSchema.safeParse(raw);
  if (!parsed.success) {
    const msg = parsed.error.flatten().fieldErrors.slug?.[0] ?? "Zkontrolujte vyplnění.";
    return { error: msg };
  }

  let publishedAt =
    parsed.data.published_at && String(parsed.data.published_at).trim()
      ? new Date(parsed.data.published_at).toISOString()
      : null;

  const { published, published_at: finalPublishedAt } = resolvePublishedAndDate(parsed.data, publishedAt);
  publishedAt = finalPublishedAt;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  const authorName =
    profile?.full_name?.trim() ||
    (typeof user.email === "string" ? user.email.split("@")[0] : null) ||
    "Autor";

  const row: Record<string, unknown> = {
    slug: parsed.data.slug,
    title: parsed.data.title,
    excerpt: parsed.data.excerpt?.trim() || null,
    body: parsed.data.body,
    category: parsed.data.category.trim() || "",
    published,
    published_at: publishedAt,
    cover_image_url: parsed.data.cover_image_url?.trim() || null,
    seo_title: parsed.data.seo_title?.trim() || null,
    seo_description: parsed.data.seo_description?.trim() || null,
    canonical_url: parsed.data.canonical_url?.trim() || null,
    reading_time: parsed.data.reading_time ?? null,
    featured: parsed.data.featured ?? false,
    og_image_url: parsed.data.og_image_url?.trim() || null,
    content_type: parsed.data.content_type,
    author_id: user.id,
    author_name: authorName,
  };

  if (parsed.data.id) {
    const { error } = await supabase.from("posts").update(row).eq("id", parsed.data.id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("posts").insert(row);
    if (error) return { error: error.message };
  }

  revalidatePath("/blog");
  revalidatePath("/");
  revalidatePath(`/blog/${row.slug as string}`);
  redirect("/admin/posts");
}

export async function deletePostAction(formData: FormData): Promise<void> {
  const { supabase } = await requireEditor();
  const id = formData.get("id");
  if (typeof id !== "string" || !id) redirect("/admin/posts");

  const { data: row } = await supabase.from("posts").select("slug").eq("id", id).maybeSingle();
  await supabase.from("posts").delete().eq("id", id);

  revalidatePath("/blog");
  revalidatePath("/");
  if (row?.slug) revalidatePath(`/blog/${row.slug}`);
  redirect("/admin/posts");
}

export async function uploadBlogCoverAction(formData: FormData): Promise<{ url?: string; error?: string }> {
  const { supabase, user } = await requireEditor();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Vyberte obrázek." };
  }
  if (file.size > 5 * 1024 * 1024) {
    return { error: "Soubor je příliš velký (max. 5 MB)." };
  }
  if (file.type && !file.type.startsWith("image/")) {
    return { error: "Soubor musí být obrázek." };
  }

  const ext = file.name.split(".").pop()?.replace(/[^a-zA-Z0-9]/g, "") || "jpg";
  const path = `${user.id}/${Date.now()}.${ext}`;

  const buf = await file.arrayBuffer();
  const { error } = await supabase.storage.from("blog-covers").upload(path, buf, {
    contentType: file.type || "image/jpeg",
    upsert: true,
  });
  if (error) return { error: error.message };

  const { data } = supabase.storage.from("blog-covers").getPublicUrl(path);
  return { url: data.publicUrl };
}
