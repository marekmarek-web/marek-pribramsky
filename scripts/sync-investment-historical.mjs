#!/usr/bin/env node
/**
 * Stáhne měsíční uzavírací ceny z Yahoo Finance a přepíše generovanou větev
 * HISTORICAL_DATA v packages/calculators-core/src/investment/investment.config.ts.
 *
 * Symboly (proxy vůči sloupcům v kalkulačce):
 *   sp500 → ^GSPC
 *   gold  → GLD (SPDR Gold Shares)
 *   bonds → BND (Vanguard Total Bond Market ETF)
 *   re    → VNQ (Vanguard Real Estate ETF)
 *
 * Po dubnu 2024 se u každé řady zachovává jen poměr vývoje: hodnota_měsíc = kotva * (cena_měsíc / cena_2024-04),
 * kde kotvy jsou stávající čísla v souboru za 2024-04 (délka série navíc na původní tabulku navazuje).
 *
 * Spuštění: npm run sync-investment-historical
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CONFIG_PATH = path.join(ROOT, "packages/calculators-core/src/investment/investment.config.ts");

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

/** Sloupce v HistoricalDataPoint → ticker Yahoo */
const YAHOO = {
  sp500: "^GSPC",
  gold: "GLD",
  bonds: "BND",
  re: "VNQ",
};

const ANCHOR_MONTH = "2024-04";
const ANCHOR = { sp500: 5200, gold: 2350, bonds: 164, re: 250 };

const BEGIN_MARK = "  // BEGIN GENERATED HISTORICAL_EXTENSION (sync-investment-historical.mjs)";
const END_MARK = "  // END GENERATED HISTORICAL_EXTENSION";

function toYmUtc(tsSec) {
  return new Date(tsSec * 1000).toISOString().slice(0, 7);
}

function pickSeries(result, preferAdj) {
  const quote = result?.indicators?.quote?.[0];
  const adj = result?.indicators?.adjclose?.[0]?.adjclose;
  const closes = preferAdj && Array.isArray(adj) ? adj : quote?.close;
  const ts = result?.timestamp;
  if (!Array.isArray(ts) || !Array.isArray(closes) || ts.length !== closes.length) return new Map();

  const m = new Map();
  for (let i = 0; i < ts.length; i++) {
    const c = closes[i];
    if (c == null || Number.isNaN(c)) continue;
    const ym = toYmUtc(ts[i]);
    m.set(ym, c);
  }
  return m;
}

async function fetchMonthlyMap(symbol, preferAdj) {
  const period1 = Math.floor(new Date("2024-03-01T12:00:00Z").getTime() / 1000);
  const period2 = Math.floor(Date.now() / 1000) + 86_400;
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
    symbol,
  )}?period1=${period1}&period2=${period2}&interval=1mo`;

  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`Yahoo ${symbol}: HTTP ${res.status}`);
  const json = await res.json();
  const err = json?.chart?.error;
  if (err) throw new Error(`Yahoo ${symbol}: ${err.description ?? JSON.stringify(err)}`);
  const result = json?.chart?.result?.[0];
  if (!result) throw new Error(`Yahoo ${symbol}: prázdná odpověď`);
  return pickSeries(result, preferAdj);
}

async function main() {
  const [mSp, mAu, mBd, mRe] = await Promise.all([
    fetchMonthlyMap(YAHOO.sp500, false),
    fetchMonthlyMap(YAHOO.gold, true),
    fetchMonthlyMap(YAHOO.bonds, true),
    fetchMonthlyMap(YAHOO.re, true),
  ]);

  const aSp = mSp.get(ANCHOR_MONTH);
  const aAu = mAu.get(ANCHOR_MONTH);
  const aBd = mBd.get(ANCHOR_MONTH);
  const aRe = mRe.get(ANCHOR_MONTH);
  if (aSp == null || aAu == null || aBd == null || aRe == null) {
    throw new Error(
      `Chybí kotva ${ANCHOR_MONTH} v jedné z řad. GSPC=${aSp}, GLD=${aAu}, BND=${aBd}, VNQ=${aRe}`,
    );
  }

  const allMonths = new Set([...mSp.keys(), ...mAu.keys(), ...mBd.keys(), ...mRe.keys()]);
  const extension = [...allMonths].filter((ym) => ym > ANCHOR_MONTH).sort();

  const rows = [];
  for (const ym of extension) {
    const rSp = mSp.get(ym);
    const rAu = mAu.get(ym);
    const rBd = mBd.get(ym);
    const rRe = mRe.get(ym);
    if (rSp == null || rAu == null || rBd == null || rRe == null) continue;

    const sp500 = Math.round(ANCHOR.sp500 * (rSp / aSp));
    const gold = Math.round(ANCHOR.gold * (rAu / aAu));
    const bonds = Math.round(ANCHOR.bonds * (rBd / aBd));
    const re = Math.round(ANCHOR.re * (rRe / aRe));
    rows.push(`  { date: "${ym}", sp500: ${sp500}, gold: ${gold}, bonds: ${bonds}, re: ${re} },`);
  }

  const block = [
    BEGIN_MARK,
    "  // Yahoo Finance (měsíc, 1mo): ^GSPC; GLD; BND; VNQ — poměry vs. " +
      `${ANCHOR_MONTH} → měřítko tabulky (kotvy sp500 ${ANCHOR.sp500}, gold ${ANCHOR.gold}, bonds ${ANCHOR.bonds}, re ${ANCHOR.re}).`,
    ...rows,
    END_MARK,
  ].join("\n");

  let src = fs.readFileSync(CONFIG_PATH, "utf8");
  if (src.includes(BEGIN_MARK) && src.includes(END_MARK)) {
    src = src.replace(
      new RegExp(
        `${BEGIN_MARK.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[\\s\\S]*?${END_MARK.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&",
        )}`,
      ),
      block,
    );
  } else {
    throw new Error(
      `V ${CONFIG_PATH} chybí značky BEGIN/END GENERATED HISTORICAL_EXTENSION — vlož je ručně kolem generovaných řádků.`,
    );
  }

  fs.writeFileSync(CONFIG_PATH, src, "utf8");
  console.log(`OK: ${rows.length} měsíců po ${ANCHOR_MONTH} → ${CONFIG_PATH}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
