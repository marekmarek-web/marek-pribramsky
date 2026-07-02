"use client";

import { useCallback, useEffect, useState } from "react";
import { HeroHomeSection } from "./HeroHomeSection";
import { HomeVanillaInit } from "./HomeVanillaInit";
import { PageLoader } from "./PageLoader";

const LOADER_SEEN_KEY = "pb_home_loader_seen";

export function HomePageClient() {
  const [hydrated, setHydrated] = useState(false);
  const [skipLoader, setSkipLoader] = useState(false);
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem(LOADER_SEEN_KEY) === "1";
    setSkipLoader(seen);
    setHydrated(true);
    if (seen) {
      setBooted(true);
      document.body.classList.add("page-loaded");
      window.dispatchEvent(new Event("pb:page-ready"));
    } else {
      document.body.classList.add("page-loading");
    }
  }, []);

  const onLoaderDone = useCallback(() => {
    sessionStorage.setItem(LOADER_SEEN_KEY, "1");
    document.body.classList.remove("page-loading");
    document.body.classList.add("page-loaded");
    setBooted(true);
    window.dispatchEvent(new Event("pb:page-ready"));
  }, []);

  useEffect(() => {
    document.documentElement.classList.add("home-scroll-header-init");
    return () => {
      document.documentElement.classList.remove("home-scroll-header-init");
    };
  }, []);

  if (!hydrated) return null;

  return (
    <>
      {!skipLoader && !booted ? <PageLoader onDone={onLoaderDone} /> : null}
      <HeroHomeSection booted={booted} skipIntro={skipLoader} />
      <HomeVanillaInit enabled={booted} />
    </>
  );
}
