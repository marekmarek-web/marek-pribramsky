"use client";

import { useCallback, useEffect, useState } from "react";
import { HeroHomeSection } from "./HeroHomeSection";
import { HomeVanillaInit } from "./HomeVanillaInit";
import { PageLoader } from "./PageLoader";

const LOADER_SEEN_KEY = "pb_home_loader_seen";

export function HomePageClient() {
  const [showLoader, setShowLoader] = useState(false);
  const [skipLoader, setSkipLoader] = useState(false);
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem(LOADER_SEEN_KEY) === "1";
    setSkipLoader(seen);
    if (seen) {
      setBooted(true);
      document.body.classList.add("page-loaded");
      window.dispatchEvent(new Event("pb:page-ready"));
    } else {
      setShowLoader(true);
    }
  }, []);

  const onLoaderDone = useCallback(() => {
    sessionStorage.setItem(LOADER_SEEN_KEY, "1");
    document.body.classList.add("page-loaded");
    setBooted(true);
    setShowLoader(false);
    window.dispatchEvent(new Event("pb:page-ready"));
  }, []);

  useEffect(() => {
    document.documentElement.classList.add("home-scroll-header-init");
    return () => {
      document.documentElement.classList.remove("home-scroll-header-init");
    };
  }, []);

  const ready = skipLoader || booted;

  return (
    <>
      {showLoader ? <PageLoader onDone={onLoaderDone} /> : null}
      <HeroHomeSection booted={ready} skipIntro={skipLoader} />
      <HomeVanillaInit enabled={ready} />
    </>
  );
}
