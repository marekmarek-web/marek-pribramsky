"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import {
  savePostAction,
  type SavePostState,
  uploadBlogCoverAction,
} from "@/app/admin/posts/actions";
import { MarkdownPreview } from "@/components/admin/MarkdownPreview";
import type { BlogPost } from "@/lib/posts";

function toDatetimeLocalValue(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

type Props = { initial: BlogPost | null };

export function PostEditor({ initial }: Props) {
  const [coverUrl, setCoverUrl] = useState(initial?.cover_image_url ?? "");
  const [ogUrl, setOgUrl] = useState(initial?.og_image_url ?? "");
  const [body, setBody] = useState(initial?.body ?? "");
  const [dirty, setDirty] = useState(false);
  const [uploadBusy, setUploadBusy] = useState(false);
  const [uploadErr, setUploadErr] = useState<string | null>(null);

  const [state, formAction, pending] = useActionState<SavePostState, FormData>(savePostAction, null);

  useEffect(() => {
    setCoverUrl(initial?.cover_image_url ?? "");
    setOgUrl(initial?.og_image_url ?? "");
    setBody(initial?.body ?? "");
    setDirty(false);
  }, [initial]);

  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  async function onCoverFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadErr(null);
    setUploadBusy(true);
    try {
      const fd = new FormData();
      fd.set("file", file);
      const res = await uploadBlogCoverAction(fd);
      if (res.error) {
        setUploadErr(res.error);
        return;
      }
      if (res.url) {
        setCoverUrl(res.url);
        setDirty(true);
      }
    } finally {
      setUploadBusy(false);
      e.target.value = "";
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-4 justify-between items-center mb-8">
        <h1 className="text-xl font-bold text-brand-text">
          {initial ? "Upravit článek" : "Nový článek"}
        </h1>
        <Link href="/admin/posts" className="text-sm font-semibold text-brand-navy hover:text-brand-cyan">
          ← Zpět na seznam
        </Link>
      </div>

      {state?.error && (
        <p className="mb-4 text-sm text-red-600 rounded-xl bg-red-50 px-4 py-3">{state.error}</p>
      )}

      <form
        action={formAction}
        className="space-y-5 max-w-3xl"
        onChange={() => setDirty(true)}
      >
        {initial?.id ? <input type="hidden" name="id" value={initial.id} /> : null}

        <div>
          <label htmlFor="slug" className="block text-sm font-semibold text-brand-text mb-1.5">
            Slug (URL)
          </label>
          <input
            id="slug"
            name="slug"
            required
            defaultValue={initial?.slug ?? ""}
            placeholder="napr-clanek"
            className="w-full px-4 py-3 rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-cyan focus:border-transparent font-mono text-sm"
          />
        </div>
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-brand-text mb-1.5">
            Nadpis
          </label>
          <input
            id="title"
            name="title"
            required
            defaultValue={initial?.title ?? ""}
            className="w-full px-4 py-3 rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-cyan focus:border-transparent"
          />
        </div>
        <div>
          <label htmlFor="content_type" className="block text-sm font-semibold text-brand-text mb-1.5">
            Typ obsahu
          </label>
          <select
            id="content_type"
            name="content_type"
            defaultValue={initial?.content_type ?? "blog"}
            className="w-full max-w-xs px-4 py-3 rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-cyan focus:border-transparent bg-white"
          >
            <option value="blog">Blog</option>
            <option value="article">Článek</option>
            <option value="insight">Insight</option>
          </select>
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-semibold text-brand-text mb-1.5">
            Kategorie
          </label>
          <input
            id="category"
            name="category"
            defaultValue={initial?.category ?? ""}
            className="w-full px-4 py-3 rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-cyan focus:border-transparent"
          />
        </div>
        <div>
          <label htmlFor="excerpt" className="block text-sm font-semibold text-brand-text mb-1.5">
            Perex
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            rows={3}
            defaultValue={initial?.excerpt ?? ""}
            className="w-full px-4 py-3 rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-cyan focus:border-transparent resize-none"
          />
        </div>
        <div>
          <label htmlFor="body" className="block text-sm font-semibold text-brand-text mb-1.5">
            Text (Markdown)
          </label>
          <textarea
            id="body"
            name="body"
            rows={16}
            value={body}
            onChange={(e) => {
              setBody(e.target.value);
              setDirty(true);
            }}
            className="w-full px-4 py-3 rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-cyan focus:border-transparent font-mono text-sm"
          />
          <details className="mt-3 rounded-xl border border-brand-border bg-white/80 p-4">
            <summary className="cursor-pointer text-sm font-semibold text-brand-navy">
              Náhled Markdown
            </summary>
            <div className="mt-4 pt-4 border-t border-brand-border max-h-[min(480px,50vh)] overflow-y-auto">
              <MarkdownPreview body={body || "_(prázdný obsah)_"} />
            </div>
          </details>
        </div>
        <div>
          <label htmlFor="cover_image_url" className="block text-sm font-semibold text-brand-text mb-1.5">
            Obrázek náhledu (cover)
          </label>
          <input
            id="cover_image_url"
            name="cover_image_url"
            value={coverUrl}
            onChange={(e) => {
              setCoverUrl(e.target.value);
              setDirty(true);
            }}
            placeholder="https://… nebo nahrajte soubor níže"
            className="w-full px-4 py-3 rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-cyan focus:border-transparent"
          />
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <label className="text-sm text-brand-muted cursor-pointer">
              <span className="font-semibold text-brand-navy hover:text-brand-cyan">Nahrát do úložiště</span>
              <input type="file" accept="image/*" className="sr-only" disabled={uploadBusy} onChange={onCoverFile} />
            </label>
            {uploadBusy && <span className="text-xs text-brand-muted">Nahrávám…</span>}
            {uploadErr && <span className="text-xs text-red-600">{uploadErr}</span>}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="seo_title" className="block text-sm font-semibold text-brand-text mb-1.5">
              SEO titulek
            </label>
            <input
              id="seo_title"
              name="seo_title"
              defaultValue={initial?.seo_title ?? ""}
              placeholder="Volitelně — jinak se použije nadpis"
              className="w-full px-4 py-3 rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-cyan focus:border-transparent text-sm"
            />
          </div>
          <div>
            <label htmlFor="reading_time" className="block text-sm font-semibold text-brand-text mb-1.5">
              Čtení (min)
            </label>
            <input
              id="reading_time"
              name="reading_time"
              type="number"
              min={0}
              max={600}
              defaultValue={initial?.reading_time ?? ""}
              placeholder="auto / ručně"
              className="w-full px-4 py-3 rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-cyan focus:border-transparent text-sm"
            />
          </div>
        </div>
        <div>
          <label htmlFor="seo_description" className="block text-sm font-semibold text-brand-text mb-1.5">
            SEO popis
          </label>
          <textarea
            id="seo_description"
            name="seo_description"
            rows={2}
            defaultValue={initial?.seo_description ?? ""}
            placeholder="Meta description pro vyhledávače"
            className="w-full px-4 py-3 rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-cyan focus:border-transparent resize-none text-sm"
          />
        </div>
        <div>
          <label htmlFor="canonical_url" className="block text-sm font-semibold text-brand-text mb-1.5">
            Kanonická URL (volitelné)
          </label>
          <input
            id="canonical_url"
            name="canonical_url"
            defaultValue={initial?.canonical_url ?? ""}
            placeholder="https://…"
            className="w-full px-4 py-3 rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-cyan focus:border-transparent text-sm"
          />
        </div>
        <div>
          <label htmlFor="og_image_url" className="block text-sm font-semibold text-brand-text mb-1.5">
            OG obrázek (volitelně jiný než cover)
          </label>
          <input
            id="og_image_url"
            name="og_image_url"
            value={ogUrl}
            onChange={(e) => {
              setOgUrl(e.target.value);
              setDirty(true);
            }}
            placeholder="Prázdné = použije se cover"
            className="w-full px-4 py-3 rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-cyan focus:border-transparent text-sm"
          />
        </div>

        <div>
          <label htmlFor="published_at" className="block text-sm font-semibold text-brand-text mb-1.5">
            Datum publikace
          </label>
          <input
            id="published_at"
            name="published_at"
            type="datetime-local"
            defaultValue={toDatetimeLocalValue(initial?.published_at ?? null)}
            className="w-full max-w-xs px-4 py-3 rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-cyan focus:border-transparent"
          />
        </div>
        <div className="flex items-start gap-3">
          <input
            id="published"
            name="published"
            type="checkbox"
            defaultChecked={initial?.published ?? false}
            className="mt-1 w-4 h-4 rounded border-brand-border text-brand-navy focus:ring-brand-cyan"
          />
          <label htmlFor="published" className="text-sm text-brand-text">
            Publikovat na webu (při „Uložit“ respektuje tento přepínač)
          </label>
        </div>
        <div className="flex items-start gap-3">
          <input
            id="featured"
            name="featured"
            type="checkbox"
            defaultChecked={initial?.featured ?? false}
            className="mt-1 w-4 h-4 rounded border-brand-border text-brand-navy focus:ring-brand-cyan"
          />
          <label htmlFor="featured" className="text-sm text-brand-text">
            Zvýrazněný článek
          </label>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            name="_intent"
            value="save"
            disabled={pending}
            className="py-3 px-6 rounded-2xl bg-brand-navy text-white font-bold hover:bg-brand-navy/90 disabled:opacity-75"
          >
            {pending ? "Ukládám…" : "Uložit"}
          </button>
          <button
            type="submit"
            name="_intent"
            value="draft"
            disabled={pending}
            className="py-3 px-6 rounded-2xl border-2 border-brand-navy text-brand-navy font-bold hover:bg-brand-navy/5 disabled:opacity-75"
          >
            {pending ? "Ukládám…" : "Uložit koncept"}
          </button>
          <button
            type="submit"
            name="_intent"
            value="publish"
            disabled={pending}
            className="py-3 px-6 rounded-2xl bg-brand-cyan text-brand-navy font-bold hover:opacity-90 disabled:opacity-75"
          >
            {pending ? "Ukládám…" : "Publikovat"}
          </button>
        </div>
        <p className="text-xs text-brand-muted">
          „Uložit“ použije přepínač Publikovat výše. „Uložit koncept“ vždy uloží jako nepublikované. „Publikovat“
          zveřejní článek a doplní datum publikace, pokud chybí.
        </p>
      </form>
    </div>
  );
}
