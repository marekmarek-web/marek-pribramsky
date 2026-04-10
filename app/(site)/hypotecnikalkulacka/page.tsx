import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { pageOg } from "@/lib/seo/page-meta";

const MortgageCalculatorPage = dynamic(
  () =>
    import("@/components/calculators/portal/mortgage/MortgageCalculatorPage").then(
      (m) => m.MortgageCalculatorPage
    ),
  {
    loading: () => (
      <div className="flex min-h-[50vh] items-center justify-center text-brand-muted">
        Načítám kalkulačku…
      </div>
    ),
  }
);

const title = "Hypoteční kalkulačka";
const description = "Měsíční splátka, amortizace a srovnání nabídek bank.";

export const metadata: Metadata = {
  title,
  description,
  ...pageOg("/hypotecnikalkulacka", title, description),
};

export default function HypotecniKalkulackaPage() {
  return (
    <main className="main-with-header pt-24 pb-16 bg-[#f4f6fb] min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4">
        <MortgageCalculatorPage />
      </div>
    </main>
  );
}
