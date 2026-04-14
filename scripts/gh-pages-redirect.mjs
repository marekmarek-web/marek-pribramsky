/**
 * Přepíše statické HTML soubory (pro GitHub Pages) na okamžité přesměrování na produkční Next.js web.
 * Spusť: node scripts/gh-pages-redirect.mjs
 * BASE sjednoťte s NEXT_PUBLIC_SITE_URL na Vercelu (bez koncového lomítka).
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const BASE = (process.env.GH_PAGES_REDIRECT_BASE || "https://www.marekpribramsky.cz").replace(/\/$/, "");

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
