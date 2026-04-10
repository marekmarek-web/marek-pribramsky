import Link from "next/link";
import { requireEditor } from "@/lib/admin/require-editor";
import { formatPostDate } from "@/lib/posts";

type Props = { searchParams: Promise<{ notice?: string }> };

export default async function AdminHomePage({ searchParams }: Props) {
  const sp = await searchParams;
  const { supabase } = await requireEditor();

  const [{ count: draftCount }, { count: publishedCount }, { data: recent }] = await Promise.all([
    supabase.from("posts").select("id", { count: "exact", head: true }).eq("published", false),
    supabase.from("posts").select("id", { count: "exact", head: true }).eq("published", true),
    supabase
      .from("posts")
      .select("id, slug, title, published, updated_at, author_name")
      .order("updated_at", { ascending: false })
      .limit(6),
  ]);

  return (
    <div>
      {sp.notice === "no-admin" ? (
        <p className="mb-6 text-sm rounded-xl bg-amber-50 text-amber-900 px-4 py-3 border border-amber-200">
          Tato sekce je jen pro roli <strong>admin</strong>. Můžete spravovat články v části Články.
        </p>
      ) : null}

      <h1 className="text-2xl font-bold text-brand-text mb-2">Přehled</h1>
      <p className="text-brand-muted mb-8 text-sm">
        Rychlý přehled obsahu. Editorial workspace — blog a články.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <div className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-muted">Koncepty</p>
          <p className="text-3xl font-bold text-brand-navy mt-1">{draftCount ?? 0}</p>
        </div>
        <div className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-muted">Publikováno</p>
          <p className="text-3xl font-bold text-brand-navy mt-1">{publishedCount ?? 0}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-10">
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center py-3 px-5 rounded-xl bg-brand-navy text-white font-semibold text-sm hover:bg-brand-navy/90"
        >
          Nový článek
        </Link>
        <Link
          href="/admin/posts"
          className="inline-flex items-center py-3 px-5 rounded-xl border-2 border-brand-navy text-brand-navy font-semibold text-sm hover:bg-brand-navy/5"
        >
          Všechny články
        </Link>
      </div>

      <h2 className="text-lg font-bold text-brand-text mb-3">Naposledy upravené</h2>
      {!recent?.length ? (
        <p className="text-brand-muted text-sm">Zatím žádné záznamy.</p>
      ) : (
        <ul className="space-y-2">
          {recent.map((p) => (
            <li
              key={p.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-brand-border bg-white px-4 py-3 text-sm"
            >
              <Link href={`/admin/posts/${p.id}/edit`} className="font-semibold text-brand-navy hover:text-brand-cyan">
                {p.title}
              </Link>
              <span className="text-xs text-brand-muted">
                {p.published ? "publikováno" : "koncept"} · {formatPostDate(p.updated_at)}
                {p.author_name ? ` · ${p.author_name}` : ""}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
