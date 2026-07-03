import { siteConfig, socialLinks } from "@/config/site";

/** Přímý kontakt — telefon, e-mail, sociální sítě (stejné údaje jako v patičce). */
export function ContactDirectStrip() {
  return (
    <div className="mx-auto max-w-content px-4 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-10 sm:gap-y-3">
        <a
          href={`tel:${siteConfig.phoneTel}`}
          className="text-xl font-bold text-brand-navy transition hover:text-brand-cyan sm:text-2xl"
        >
          {siteConfig.phoneDisplay}
        </a>
        <a
          href={`mailto:${siteConfig.contactEmail}`}
          className="break-all text-base font-semibold text-brand-navy transition hover:text-brand-cyan sm:text-lg"
        >
          {siteConfig.contactEmail}
        </a>
      </div>
      <ul className="mt-5 flex flex-wrap gap-4">
        {socialLinks.map((s) => (
          <li key={s.href}>
            <a
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-brand-cyan hover:underline"
            >
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
