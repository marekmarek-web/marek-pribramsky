import { notFound } from "next/navigation";
import { PostEditor } from "@/components/admin/PostEditor";
import { requireEditor } from "@/lib/admin/require-editor";
import type { BlogPost } from "@/lib/posts";

type Props = { params: Promise<{ id: string }> };

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;
  const { supabase } = await requireEditor();
  const { data, error } = await supabase
    .from("posts")
    .select(
      "id, slug, title, excerpt, body, category, published, published_at, cover_image_url, seo_title, seo_description, canonical_url, author_id, author_name, reading_time, featured, og_image_url, content_type"
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !data) notFound();

  return <PostEditor initial={data as BlogPost} />;
}
