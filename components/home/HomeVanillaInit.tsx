"use client";

import { useEffect } from "react";

/** Port `assets/js/anim.js` + část `main.js` (FAQ, postup spotlight) po dokončení loaderu. Persona a služby jsou v Reactu. */
export function HomeVanillaInit({ enabled }: { enabled: boolean }) {
  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    let ticking = false;
    function checkFade() {
      document.querySelectorAll(".animate-fade-in-up:not(.visible)").forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight - 50) {
          el.classList.add("visible");
        }
      });
    }
    function onScrollFade() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          checkFade();
          ticking = false;
        });
        ticking = true;
      }
    }
    window.addEventListener("scroll", onScrollFade, { passive: true });
    window.addEventListener("load", checkFade);
    checkFade();

    const postupBento = document.getElementById("postup-bento");
    const onPostupMove = (e: MouseEvent) => {
      if (!postupBento) return;
      const cards = postupBento.getElementsByClassName("postup-item");
      for (let i = 0; i < cards.length; i++) {
        const card = cards[i] as HTMLElement;
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
        card.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
      }
    };
    if (postupBento) postupBento.addEventListener("mousemove", onPostupMove);

    const faqSwitcher = document.querySelector<HTMLElement>(".faq-switcher[data-tabs]");
    const faqTabs = faqSwitcher ? Array.from(faqSwitcher.querySelectorAll<HTMLButtonElement>(".faq-tab")) : [];
    function setFaqActive(tab: HTMLButtonElement) {
      if (!faqSwitcher) return;
      const idx = faqTabs.indexOf(tab);
      faqTabs.forEach((t) => t.classList.toggle("active", t === tab));
      faqSwitcher.style.setProperty("--bubble-x", `${idx * 100}%`);
      document.querySelectorAll(".faq-panel").forEach((p) => p.classList.remove("active"));
      const panel = document.querySelector(`.faq-panel[data-panel="${tab.dataset.tab}"]`);
      if (panel) panel.classList.add("active");
    }
    const faqTabCleanups: (() => void)[] = [];
    faqTabs.forEach((t) => {
      const onEnter = () => setFaqActive(t);
      const onClick = (e: Event) => setFaqActive(e.currentTarget as HTMLButtonElement);
      t.addEventListener("mouseenter", onEnter);
      t.addEventListener("click", onClick);
      faqTabCleanups.push(() => {
        t.removeEventListener("mouseenter", onEnter);
        t.removeEventListener("click", onClick);
      });
    });
    const initTab = faqSwitcher?.querySelector<HTMLButtonElement>(".faq-tab.active") || faqTabs[0];
    if (initTab) setFaqActive(initTab);

    const faqPanelCleanups: (() => void)[] = [];
    document.querySelectorAll(".faq-panel").forEach((panel) => {
      const qs = Array.from(panel.querySelectorAll<HTMLButtonElement>(".faq-q"));
      function setQ(btn: HTMLButtonElement) {
        qs.forEach((b) => b.classList.toggle("active", b === btn));
        panel.querySelectorAll(".faq-a").forEach((a) => a.classList.remove("active"));
        const id = btn.dataset.answer;
        if (id) {
          const el = panel.querySelector(`#${CSS.escape(id)}`);
          if (el) el.classList.add("active");
        }
      }
      qs.forEach((b) => {
        const fn = () => setQ(b);
        b.addEventListener("click", fn);
        faqPanelCleanups.push(() => b.removeEventListener("click", fn));
      });
      const initQ = panel.querySelector<HTMLButtonElement>(".faq-q.active") || qs[0];
      if (initQ) setQ(initQ);
    });

    return () => {
      window.removeEventListener("scroll", onScrollFade);
      window.removeEventListener("load", checkFade);
      if (postupBento) postupBento.removeEventListener("mousemove", onPostupMove);
      faqTabCleanups.forEach((c) => c());
      faqPanelCleanups.forEach((c) => c());
    };
  }, [enabled]);

  return null;
}
