import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { pageOg } from "@/lib/seo/page-meta";

const InvestmentCalculatorPage = dynamic(
  () =>
    import("@/components/calculators/portal/investment/InvestmentCalculatorPage").then(
      (m) => m.InvestmentCalculatorPage
    ),
  {
    loading: () => (
      <div className="flex min-h-[50vh] items-center justify-center text-brand-muted">
        Načítám kalkulačku…
      </div>
    ),
  }
);

const title = "Investiční kalkulačka";
const description = "Projekce zhodnocení, alokace a historický backtest.";

export const metadata: Metadata = {
  title,
  description,
  ...pageOg("/investicnikalkulacka", title, description),
};

export default function InvesticniKalkulackaPage() {
  return (
    <main className="main-with-header pt-24 pb-16 bg-[#f4f6fb] min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4">
        <InvestmentCalculatorPage />
      </div>
    </main>
  );
}
