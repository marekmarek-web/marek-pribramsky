"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";
import {
  normalizeLocationHash,
  scrollToHashTarget,
  splitHashHref,
  stashPendingHash,
} from "@/lib/navigation/hashScroll";

type HashLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
};

/**
 * Odkaz na sekci (#kontakt apod.) — bez dvojitého hashe, spolehlivý scroll i z jiných stránek.
 */
export function HashLink({ href, onClick, scroll = false, ...rest }: HashLinkProps) {
  const pathname = usePathname() || "/";
  const { pathname: targetPath, hash } = splitHashHref(href);

  if (!hash) {
    return <Link href={href} onClick={onClick} scroll={scroll} {...rest} />;
  }

  const linkHref = { pathname: targetPath, hash };

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    onClick?.(e);
    if (e.defaultPrevented || !hash) return;

    if (pathname === targetPath) {
      e.preventDefault();
      normalizeLocationHash(hash);
      scrollToHashTarget(hash, { behavior: "smooth" });
      return;
    }

    stashPendingHash(hash);
  }

  return (
    <Link href={linkHref} scroll={false} onClick={handleClick} {...rest} />
  );
}
