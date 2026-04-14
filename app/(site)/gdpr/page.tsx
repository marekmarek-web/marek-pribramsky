import type { Metadata } from "next";
import Link from "next/link";
import { legalConfig } from "@/config/legal";
import { siteConfig } from "@/config/site";
import { pageOg } from "@/lib/seo/page-meta";

const title = "Ochrana osobních údajů";
const description =
  "Jak zpracováváme osobní údaje na tomto webu, vaše práva a odkaz na zásady partnera BEplan.";

export const metadata: Metadata = {
  title,
  description,
  ...pageOg("/gdpr", title, description),
};

export default function GdprPage() {
  return (
    <main className="main-with-header pt-24 pb-20 lg:pb-28">
      <div className="max-w-content mx-auto px-4 sm:px-6">
        <div className="max-w-3xl prose prose-brand">
          <h1 className="section-title font-bold text-brand-text mb-8">Ochrana osobních údajů</h1>
          <p className="text-brand-muted leading-relaxed mb-6">
            Vaše soukromí bereme vážně. Tento web provozuje {siteConfig.name}. Údaje, které nám sdělíte prostřednictvím
            formulářů (jméno, kontakt, zpráva), zpracováváme za účelem odpovědi na dotaz, domluvení konzultace a přípravy
            návrhů v oblasti finančního poradenství — tedy v oprávněném zájmu a pro plnění smluvních kroků podle vašeho
            zájmu o spolupráci.
          </p>
          <p className="text-brand-muted leading-relaxed mb-6">
            Údaje nepředáváme třetím stranám k marketingu. Technické provozní údaje (např. logy serveru) mohou zpracovávat
            poskytovatelé hostingu v rozsahu nezbytném pro bezpečný provoz webu. Máte právo na přístup ke svým údajům,
            opravu, výmaz, omezení zpracování a vznést námitku; kontaktujte nás na{" "}
            <a href={`mailto:${siteConfig.contactEmail}`} className="text-brand-navy hover:underline">
              {siteConfig.contactEmail}
            </a>
            .
          </p>
          <p className="text-brand-muted leading-relaxed mb-6">
            Podrobné zásady zpracování osobních údajů v síti našeho partnerského zprostředkovatele najdete zde:{" "}
            <a
              href={legalConfig.partnerPrivacyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-navy hover:underline"
            >
              {legalConfig.partnerPrivacyUrl.replace(/^https:\/\//, "")}
            </a>
            . Informace o cookies na tomto webu:{" "}
            <Link href="/cookies" className="text-brand-navy hover:underline">
              stránka Cookies
            </Link>
            .
          </p>
          <div className="space-y-3 text-sm text-brand-muted leading-relaxed border-l-4 border-brand-cyan/40 pl-4 py-1">
            {legalConfig.regulatoryDisclaimerFullParagraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <Link
            href="/kontakt"
            className="inline-block mt-8 px-6 py-3 rounded-xl bg-brand-navy text-white font-semibold hover:bg-brand-navy/90"
          >
            Kontakt
          </Link>
        </div>
      </div>
    </main>
  );
}
