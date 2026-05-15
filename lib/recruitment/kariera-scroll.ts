export function scrollToKarieraQuiz(anchorId: string = "dotaznik-sekce"): void {
  if (typeof document === "undefined") return;
  const el = document.getElementById(anchorId);
  if (!el) return;
  const yOffset = -72;
  const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
  window.scrollTo({ top: y, behavior: "smooth" });
}
