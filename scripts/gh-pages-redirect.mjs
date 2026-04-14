/**
 * Přepíše statické HTML soubory (pro GitHub Pages) na přesměrování na produkční Next.js web.
 *
 * Pořadí URL:
 * 1) proměnná prostředí GH_PAGES_REDIRECT_BASE * 2) první řádek v config/gh-pages-redirect-base.txt začínající na http (řádky začínající # se ignorují)
 *
 * Spusť: pnpm gh-pages:redirects
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function resolveBase() {
  const fromEnv = process.env.GH_PAGES_REDIRECT_BASE?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");

  const configPath = join(root, "config/gh-pages-redirect-base.txt");
  let text;
  try {
    text = readFileSync(configPath, "utf8");
  } catch {
    console.error("Chybí config/gh-pages-redirect-base.txt nebo GH_PAGES_REDIRECT_BASE.");
    process.exit(1);
  }

  const line = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .find((l) => l && !l.startsWith("#") && /^https?:\/\//i.test(l));

  if (!line) {
    console.error("V config/gh-pages-redirect-base.txt chybí řádek s URL (https://…).");
    process.exit(1);
  }

  return line.replace(/\/$/, "");
}

const BASE = resolveBase();

function page(relPath, pathOnSite) {
  const dest = `${BASE}${pathOnSite.startsWith("/") ? pathOnSite : `/${pathOnSite}`}`;
  const html = `<!DOCTYPE html>
<html lang="cs">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="refresh" content="0;url=${dest}">
  <link rel="canonical" href="${dest}">
  <title>Přesměrování…</title>
</head>
<body>
  <p>Tento zrcadlový hosting (GitHub Pages) už neobsahuje aktuální web. Pokračujte na <a href="${dest}">hlavní stránku</a>.</p>
</body>
</html>
`;
  writeFileSync(join(root, relPath), html, "utf8");
}

const routes = [
  ["index.html", "/"],
  ["blog/index.html", "/blog"],
  ["cookies/index.html", "/cookies"],
  ["gdpr/index.html", "/gdpr"],
  ["hypotecnikalkulacka/index.html", "/hypotecnikalkulacka"],
  ["investicnikalkulacka/index.html", "/investicnikalkulacka"],
  ["kalkulacky/index.html", "/kalkulacky"],
  ["kontakt/index.html", "/kontakt"],
  ["penzijnikalkulacka/index.html", "/penzijnikalkulacka"],
  ["spoluprace/index.html", "/spoluprace"],
  ["zivotnikalkulacka/index.html", "/zivotnikalkulacka"],
  ["archiv-moje-cesta-horizontal.html", "/"],
];

for (const [file, path] of routes) {
  page(file, path);
}

console.log(`Wrote ${routes.length} GitHub Pages redirects → ${BASE}`);
