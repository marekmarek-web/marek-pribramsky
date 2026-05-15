"use client";

import { useEffect, useState } from "react";
import {
  RECRUITMENT_QUIZ_SECTION_ID,
  RECRUITMENT_STICKY_CTA,
} from "@/components/recruitment/recruitment-data";
import { scrollToKarieraQuiz } from "@/lib/recruitment/kariera-scroll";

const SHOW_AFTER_Y = 380;

export function RecruitmentStickyKarieraCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER_Y);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center p-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:inset-x-auto md:bottom-8 md:right-8 md:justify-end md:p-0">
      <button
        type="button"
        onClick={() => scrollToKarieraQuiz(RECRUITMENT_QUIZ_SECTION_ID)}
        className="pointer-events-auto w-full max-w-md rounded-2xl bg-[#07122F] px-6 py-4 text-center text-base font-semibold text-white shadow-[0_20px_50px_-15px_rgba(7,18,47,0.55)] ring-1 ring-white/10 transition hover:bg-[#0c1d42] md:w-auto md:rounded-full md:px-8 md:py-3.5 md:text-sm md:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cyan"
      >
        {RECRUITMENT_STICKY_CTA.label}
      </button>
    </div>
  );
}
