import Link from "next/link";
import { requireEditor } from "@/lib/admin/require-editor";
import { signOutAction } from "@/app/admin/actions";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { role, displayName } = await requireEditor();

  return (
    <div className="min-h-screen bg-brand-background pt-10 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <nav className="flex flex-wrap gap-4 mb-10 items-center justify-between border-b border-brand-border pb-4">
          <div className="flex flex-wrap gap-4 text-sm font-semibold items-center">
            <Link href="/admin" className="text-brand-navy hover:text-brand-cyan">
              Přehled
            </Link>
            <Link href="/admin/posts" className="text-brand-navy hover:text-brand-cyan">
              Články
            </Link>
            {role === "admin" ? (
              <Link href="/admin/settings" className="text-brand-navy hover:text-brand-cyan">
                Nastavení webu
              </Link>
            ) : null}
            <Link href="/" className="text-brand-muted hover:text-brand-cyan font-normal">
              Veřejný web
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-xs text-brand-muted">
              <span className="font-semibold text-brand-text">{displayName ?? "Účet"}</span>
              <span className="mx-1.5">·</span>
              <span className="rounded-full bg-brand-navy/10 px-2 py-0.5 text-brand-navy">
                {role === "admin" ? "Admin" : "Editor"}
              </span>
            </span>
            <form action={signOutAction}>
              <button
                type="submit"
                className="text-sm font-semibold text-brand-navy hover:text-brand-cyan"
              >
                Odhlásit
              </button>
            </form>
          </div>
        </nav>
        {children}
      </div>
    </div>
  );
}
