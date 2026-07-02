"use client";

import gsap from "gsap";
import { useLayoutEffect, useRef } from "react";

type Props = { onDone: () => void };

export function PageLoader({ onDone }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef(false);

  useLayoutEffect(() => {
    if (typeof window === "undefined" || doneRef.current) return;
    const loader = rootRef.current;
    if (!loader) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      loader.style.display = "none";
      doneRef.current = true;
      onDone();
      return;
    }

    const progress = loader.querySelector<HTMLElement>(".loader-progress");
    const loaderText = loader.querySelector<HTMLElement>(".loader-text");

    const runAfter = () => {
      doneRef.current = true;
      document.body.classList.add("page-loaded");
      onDone();
    };

    if (!progress || !loaderText) {
      runAfter();
      return;
    }

    gsap.to(progress, {
      width: "100%",
      duration: 0.7,
      ease: "power2.inOut",
      onComplete: () => {
        const tl = gsap.timeline();
        tl.to(loaderText, { y: "0%", duration: 0.3, ease: "power3.out" })
          .to(loaderText, { y: "-100%", duration: 0.3, delay: 0.2, ease: "power3.in" })
          .to(loader, {
            yPercent: -100,
            duration: 0.5,
            ease: "power4.inOut",
            onComplete: runAfter,
          });
      },
    });
  }, [onDone]);

  return (
    <div className="loader" id="loader" ref={rootRef} aria-hidden>
      <div className="loader-text-wrap text-3xl md:text-5xl font-bold text-brand-navy overflow-hidden">
        <span className="loader-text block translate-y-full">Dobrý den.</span>
      </div>
      <div className="loader-progress-wrap w-48 h-[1px] bg-slate-200 mt-4 overflow-hidden">
        <div className="loader-progress h-full bg-brand-navy" style={{ width: "0%" }} />
      </div>
    </div>
  );
}
