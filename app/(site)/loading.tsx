/** Minimální skeleton během streamování homepage RSC. */
export default function SiteLoading() {
  return (
    <main className="main-with-header min-h-[50vh]" aria-hidden>
      <div className="mx-auto max-w-4xl px-4 pt-24 animate-pulse space-y-4">
        <div className="h-10 rounded-xl bg-slate-200/80 w-3/4 mx-auto" />
        <div className="h-6 rounded-lg bg-slate-100 w-1/2 mx-auto" />
      </div>
    </main>
  );
}
