"use client";

import dynamic from "next/dynamic";

const QuickCalcWidget = dynamic(
  () => import("@/components/layout/QuickCalcWidget").then((m) => m.QuickCalcWidget),
  { ssr: false },
);

export function LazyQuickCalcWidget() {
  return <QuickCalcWidget />;
}
