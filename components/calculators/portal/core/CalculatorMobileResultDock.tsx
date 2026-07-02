"use client";

export interface CalculatorMobileResultDockProps {
  children: React.ReactNode;
}

/**
 * Shared mobile floating dock used by calculator pages.
 */
export function CalculatorMobileResultDock({
  children,
}: CalculatorMobileResultDockProps) {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-fixed-cta px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pointer-events-none">
      <div className="max-w-[480px] mx-auto pointer-events-auto overflow-hidden rounded-2xl border border-slate-200/80 shadow-[0_-4px_24px_rgba(13,31,78,0.12)]">
        {children}
      </div>
    </div>
  );
}
