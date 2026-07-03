"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { scrollToHashFromLocation } from "@/lib/navigation/hashScroll";

export function HashScrollHandler() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;

    scrollToHashFromLocation();

    const onReady = () => scrollToHashFromLocation({ behavior: "smooth" });
    window.addEventListener("pb:page-ready", onReady);

    const onHashChange = () => scrollToHashFromLocation({ behavior: "smooth" });
    window.addEventListener("hashchange", onHashChange);

    return () => {
      window.removeEventListener("pb:page-ready", onReady);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, [pathname]);

  return null;
}
