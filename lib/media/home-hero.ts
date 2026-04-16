import type { CSSProperties } from "react";

/**
 * Homepage hero — jeden zdroj obrázku; art direction (object-position) je v assets/css/styles.css
 * u .hero-aurora .hero-img-full + @media, aby inline styl u next/image nepřebíjel breakpointy.
 *
 * Důležité: třídy z imageClassName dřív nefungovaly — tailwind.config neobsahoval ./lib/**,
 * takže object-* utility vůbec nevznikly a img měl výchozí object-position 50 % 50 % (useknutá hlava).
 *
 * Nepoužívat transform: translateY na img — u „cover“ odkryje horní okraj kontejneru a pod ním je
 * vidět .hero-image-wrapper / sekce (modrý pruh).
 */

export const HOME_HERO = {
  src: "/img/hero3.jpg",
  /** Popisný alt (ne jen jméno) */
  alt: "Marek Příbramský při konzultaci — finanční poradce Premium Brokers",
  /** Jen základní třída z legacy CSS; object-fit zde, object-position v CSS. */
  imageClassName: "hero-img-full",
  imageStyle: {
    objectFit: "cover",
  } satisfies CSSProperties,
  sizes: "100vw",
  /** Hero je LCP */
  quality: 82 as const,
  /** Mobil silnější stín pro čitelnost; md+ původní jemnější gradient */
  overlayClassName:
    "hero-overlay pointer-events-none absolute inset-0 z-[2] bg-gradient-to-b from-black/44 via-black/34 to-black/58 md:from-black/34 md:via-black/28 md:to-black/50",
} as const;
