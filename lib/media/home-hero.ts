import type { CSSProperties } from "react";

/**
 * Homepage hero — jeden zdroj, art direction přes object-position (inline u next/image).
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
  /** Jen základní třída z legacy CSS; object-fit/position řeší imageStyle. */
  imageClassName: "hero-img-full",
  /** y0 % = horní okraj snímku u horního okraje rámu (koruna hlavy v záběru). */
  imageStyle: {
    objectFit: "cover",
    objectPosition: "54% 0",
  } satisfies CSSProperties,
  sizes: "100vw",
  /** Hero je LCP */
  quality: 82 as const,
  /** Gradient nesmí „sežrat“ obličej — mírnější než full black */
  overlayClassName:
    "hero-overlay pointer-events-none absolute inset-0 z-[2] bg-gradient-to-b from-black/34 via-black/28 to-black/50",
} as const;
