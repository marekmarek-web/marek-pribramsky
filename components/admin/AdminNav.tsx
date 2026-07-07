"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOutAction } from "@/app/admin/actions";

type Role = "admin" | "editor";

function navClass(active: boolean) {
  return active
    ? "rounded-lg bg-brand-navy px-3 py-1.5 text-white"
    : "rounded-lg px-3 py-1.5 text-brand-navy hover:bg-slate-100 hover:text-brand-cyan";
}

export function AdminNav({ role, displayName }: { role: Role; displayName: string | null }) {
  const pathname = usePathname() || "";

  const isOverview = pathname === "/admin" || pathname === "/admin/";
  const isPosts = pathname.startsWith("/admin/posts");
  const isLeads = pathname.startsWith("/admin/leads");
  const isSubs = pathname.startsWith("/admin/subscribers");
  const isRates = pathname.startsWith("/admin/rates");
  const isSettings = pathname.startsWith("/admin/settings");

  return (
    <nav aria-label="Hlavní menu administrace" className="border-b border-brand-border pb-4 mb-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-start lg:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:gap-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-brand-muted mb-1.5">Obsah</p>
            <div className="flex flex-wrap gap-1 text-sm font-semibold">
              <Link href="/admin" className={navClass(isOverview)} aria-current={isOverview ? "page" : undefined}>
                Přehled
              </Link>
              <Link href="/admin/posts" className={navClass(isPosts)} aria-current={isPosts ? "page" : undefined}>
                Články
              </Link>
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-brand-muted mb-1.5">Kontakty</p>
            <div className="flex flex-wrap gap-1 text-sm font-semibold">
              <Link href="/admin/leads" className={navClass(isLeads)} aria-current={isLeads ? "page" : undefined}>
                Leady
              </Link>
              <Link href="/admin/subscribers" className={navClass(isSubs)} aria-current={isSubs ? "page" : undefined}>
                Odběratelé
              </Link>
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-brand-muted mb-1.5">Nástroje</p>
            <div className="flex flex-wrap gap-1 text-sm font-semibold">
              <Link href="/admin/rates" className={navClass(isRates)} aria-current={isRates ? "page" : undefined}>
                VIP sazby
              </Link>
            </div>
          </div>
          {role === "admin" ? (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-brand-muted mb-1.5">Web</p>
              <div className="flex flex-wrap gap-1 text-sm font-semibold">
                <Link
                  href="/admin/settings"
                  className={navClass(isSettings)}
                  aria-current={isSettings ? "page" : undefined}
                >
                  Nastavení
                </Link>
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm lg:justify-end">
          <Link
            href="/"
            className="font-medium text-brand-muted hover:text-brand-cyan rounded-lg px-2 py-1 -mx-2 focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:ring-offset-2"
          >
            Veřejný web
          </Link>
          <span className="hidden sm:inline text-brand-border" aria-hidden>
            |
          </span>
          <span className="text-xs text-brand-muted">
            <span className="font-semibold text-brand-text">{displayName ?? "Účet"}</span>
            <span className="mx-1.5">·</span>
            <span className="rounded-full bg-brand-navy/10 px-2 py-0.5 text-brand-navy">
              {role === "admin" ? "Admin" : "Editor"}
            </span>
          </span>
          <form action={signOutAction} className="inline">
            <button
              type="submit"
              className="text-sm font-semibold text-brand-navy hover:text-brand-cyan rounded-lg px-2 py-1 -mx-2 focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:ring-offset-2"
            >
              Odhlásit se
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}
