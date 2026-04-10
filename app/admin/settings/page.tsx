import Link from "next/link";
import { requireAdmin } from "@/lib/admin/require-editor";
import { saveSiteSettingsAction } from "@/app/admin/settings/actions";

type Props = { searchParams: Promise<{ saved?: string; error?: string }> };

export default async function AdminSettingsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const { supabase } = await requireAdmin();

  const { data: rows } = await supabase.from("site_settings").select("key, value").in("key", [
    "footer_tagline",
    "home_blog_intro",
  ]);

  const map = new Map(rows?.map((r) => [r.key, r.value]) ?? []);
  const footer = map.get("footer_tagline") ?? "";
  const blogIntro = map.get("home_blog_intro") ?? "";

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <h1 className="text-2xl font-bold text-brand-text">Nastavení webu</h1>
        <Link href="/admin" className="text-sm font-semibold text-brand-navy hover:text-brand-cyan">
          ← Přehled
        </Link>
      </div>

      {sp.saved ? (
        <p className="mb-6 text-sm rounded-xl bg-brand-cyan/10 text-brand-navy px-4 py-3">Uloženo.</p>
      ) : null}
      {sp.error ? (
        <p className="mb-6 text-sm rounded-xl bg-red-50 text-red-700 px-4 py-3">{decodeURIComponent(sp.error)}</p>
      ) : null}

      <form action={saveSiteSettingsAction} className="space-y-8 max-w-2xl">
        <div>
          <label htmlFor="footer_tagline" className="block text-sm font-semibold text-brand-text mb-1.5">
            Text v patičce (pod logem)
          </label>
          <p className="text-xs text-brand-muted mb-2">
            Veřejně viditelný. Prázdné pole = výchozí text z kódu.
          </p>
          <textarea
            id="footer_tagline"
            name="footer_tagline"
            rows={4}
            defaultValue={footer}
            className="w-full px-4 py-3 rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-cyan focus:border-transparent resize-none text-sm"
          />
        </div>
        <div>
          <label htmlFor="home_blog_intro" className="block text-sm font-semibold text-brand-text mb-1.5">
            Úvodní text u sekce Blog (úvod + stránka /blog)
          </label>
          <p className="text-xs text-brand-muted mb-2">
            Krátký odstavec pod nadpisem „Blog“. Prázdné = výchozí z kódu.
          </p>
          <textarea
            id="home_blog_intro"
            name="home_blog_intro"
            rows={3}
            defaultValue={blogIntro}
            className="w-full px-4 py-3 rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-cyan focus:border-transparent resize-none text-sm"
          />
        </div>
        <button
          type="submit"
          className="py-4 px-8 rounded-2xl bg-brand-navy text-white font-bold hover:bg-brand-navy/90"
        >
          Uložit
        </button>
      </form>
    </div>
  );
}
