import Link from "next/link";
import { requireEditor } from "@/lib/admin/require-editor";
import { deletePostAction } from "@/app/admin/posts/actions";
import { formatPostDate } from "@/lib/posts";

export default async function AdminPostsPage() {
  const { supabase } = await requireEditor();
  const { data: posts, error } = await supabase
    .from("posts")
    .select("id, slug, title, published, published_at, updated_at, category, author_name")
    .order("updated_at", { ascending: false });

  if (error) {
    return <p className="text-red-600 text-sm">Nepodařilo se načíst články: {error.message}</p>;
  }

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <h1 className="text-2xl font-bold text-brand-text">Články</h1>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center py-3 px-5 rounded-xl bg-brand-navy text-white font-semibold text-sm hover:bg-brand-navy/90"
        >
          Nový článek
        </Link>
      </div>
      {!posts?.length ? (
        <p className="text-brand-muted text-sm">Zatím žádné články. Vytvořte první.</p>
      ) : (
        <ul className="space-y-3">
          {posts.map((p) => (
            <li
              key={p.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-brand-border bg-white p-4"
            >
              <div>
                <Link
                  href={`/admin/posts/${p.id}/edit`}
                  className="font-semibold text-brand-navy hover:text-brand-cyan"
                >
                  {p.title}
                </Link>
                <p className="text-xs text-brand-muted mt-1">
                  /blog/{p.slug} · {p.category || "—"} ·{" "}
                  {p.published ? (
                    <span className="text-green-700">publikováno</span>
                  ) : (
                    <span>koncept</span>
                  )}
                  {p.published_at ? ` · publ. ${formatPostDate(p.published_at)}` : null}
                  {p.updated_at ? ` · upr. ${formatPostDate(p.updated_at)}` : null}
                  {p.author_name ? ` · ${p.author_name}` : ""}
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/blog/${p.slug}`}
                  className="text-xs font-semibold text-brand-muted hover:text-brand-cyan"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Náhled
                </Link>
                <form action={deletePostAction}>
                  <input type="hidden" name="id" value={p.id} />
                  <button type="submit" className="text-xs font-semibold text-red-600 hover:underline">
                    Smazat
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
