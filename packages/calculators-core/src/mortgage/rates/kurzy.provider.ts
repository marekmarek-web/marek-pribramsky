import { LIMITS, TERM_LIMITS } from "../mortgage.config";
import { FIX_OPTIONS } from "../mortgage.constants";
import type { NormalizedOffer, RateProvider } from "./types";

/** Tabulka „Výsledek srovnání“ na www.kurzy.cz (může vrátit bot-stěnu místo HTML tabulky). */
const KURZY_MORTGAGE_URL = "https://www.kurzy.cz/hypoteky/srovnani-hypotek/";
const KURZY_LOAN_URL = "https://www.kurzy.cz/pujcky/pujcky-srovnani";

/**
 * Veřejné datové rozhraní Kurzy (často dostupnější z datacenter IP než www HTML).
 * @see https://www.kurzy.cz/html-kody/gdpr-privacy.htm
 */
const DATA_KURZY_MORTGAGE_URLS = [
  "https://data.kurzy.cz/json/hypotekysrovnanicb%5Bvypsat%5D.js",
  "https://data.kurzy.cz/json/hypotekysrovnani%5Bvypsat%5D.js",
  "https://data.kurzy.cz/json/hypoteky/srovnani.json",
] as const;

const DATA_KURZY_LOAN_URLS = [
  "https://data.kurzy.cz/json/pujckysrovnanicb%5Bvypsat%5D.js",
  "https://data.kurzy.cz/json/pujcky/srovnani.json",
] as const;

/** Běžný Chrome — User-Agent „compatible; … robot“ často přepne Kurzy na „Ověření uživatele“. */
const CHROME_DESKTOP_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

function kurzyFetchHeaders(extra?: Record<string, string>): Record<string, string> {
  return {
    "User-Agent": CHROME_DESKTOP_UA,
    Accept: "*/*",
    "Accept-Language": "cs-CZ,cs;q=0.9,en-US;q=0.8,en;q=0.7",
    Referer: "https://www.kurzy.cz/",
    ...(extra ?? {}),
  };
}

/** Pozor: někdy má odpověď text/html bez tabulky; www HTML je spolehlivější pro detekci stěny. */
export function isKurzyBotWallHtml(html: string): boolean {
  if (!html.trim()) return true;
  if (/\bOvěření\s+uživatele\b/i.test(html)) return true;
  const asciiFold = html.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (/\bOvereni\s+uzivatele\b/i.test(asciiFold)) return true;
  return false;
}

export function assertNotKurzyBotWall(html: string, fetchedUrl: string): void {
  if (isKurzyBotWallHtml(html)) {
    throw new Error(`Kurzy bot wall (${fetchedUrl}): blokace nebo ověření uživatele, chybí tabulka srovnání`);
  }
}

/**
 * Jedna výsledková řádka Kurzy „Banka · celkem Kč · výsledná sazba % · měsíční splátka“.
 * (Po stripTags z <tr> mezi buňkami zbývá jen prostá mezera – proto nejde rozparsovat přes \s{2,}.)
 */
const KURZY_RESULT_ROW =
  /^(.+?)\s+(\d{1,3}(?:\s+\d{3})+)\s+(\d+[,.]\d{1,2})\s*%\s+(\d{1,3}(?:\s+\d{3})+)(?:\s|$)/;

const CZK_TAIL_AMOUNT = /\s+(?:\d{1,3}(?:\s+\d{3})*)$/;

function stripTags(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseRate(text: string): number | null {
  const m = text.match(/(\d+[,.]\d{1,2})\s*%/);
  if (!m) return null;
  const parsed = Number(m[1].replace(",", "."));
  return Number.isFinite(parsed) ? parsed : null;
}

function parseApr(text: string): number | undefined {
  const m = text.match(/RPSN[^0-9]*?(\d+[,.]\d{1,2})\s*%/i);
  if (!m) return undefined;
  const parsed = Number(m[1].replace(",", "."));
  return Number.isFinite(parsed) ? parsed : undefined;
}

function extractRows(html: string): string[] {
  return Array.from(html.matchAll(/<tr\b[\s\S]*?<\/tr>/gi)).map((m) => m[0]);
}

function junkProviderLabel(name: string): boolean {
  if (name.length < 2) return true;
  if (/^(Banka\b|Ověřit\b|Úrok|Sazba|RPSN|Produkt|Měsíčně)/i.test(name)) return true;
  return /\d{6,}/.test(name.replace(/\s/g, ""));
}

/**
 * Rozparsuje řádek výsledkové tabulky z již zbaveného HTML řetězce jednoho <tr>.
 */
export function parseKurzyComparisonRow(strippedTrText: string): {
  providerName: string;
  nominalRate: number;
} | null {
  const text = strippedTrText.replace(/\s+/g, " ").trim();
  if (!text) return null;

  const strict = text.match(KURZY_RESULT_ROW);
  if (strict) {
    const providerName = strict[1].trim();
    if (junkProviderLabel(providerName)) return null;
    const nominalRate = Number(strict[3].replace(",", "."));
    return Number.isFinite(nominalRate) ? { providerName, nominalRate } : null;
  }

  const nominalRate = parseRate(text);
  if (nominalRate == null) return null;

  const rateMatch = text.match(/(\d+[,.]\d{1,2})\s*%/);
  const idx = rateMatch?.index ?? -1;
  if (idx < 0) return null;

  let beforeRate = text.slice(0, idx).trim().replace(CZK_TAIL_AMOUNT, "").trim();
  if (!beforeRate || junkProviderLabel(beforeRate)) return null;

  return { providerName: beforeRate, nominalRate };
}

function toId(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function dedupeBestRate(offers: NormalizedOffer[]): NormalizedOffer[] {
  const unique = new Map<string, NormalizedOffer>();
  for (const offer of offers) {
    const existing = unique.get(offer.providerId);
    if (!existing || offer.nominalRate < existing.nominalRate) {
      unique.set(offer.providerId, offer);
    }
  }
  return Array.from(unique.values());
}

function buildOffer(
  providerName: string,
  nominalRate: number,
  productType: "mortgage" | "loan",
  sourceUrl: string,
  fetchedAtIso: string
): NormalizedOffer {
  return {
    providerId: toId(providerName),
    providerName,
    productType,
    subtype: null,
    nominalRate,
    minAmount: productType === "mortgage" ? LIMITS.mortgage.min : LIMITS.loan.min,
    maxAmount: productType === "mortgage" ? LIMITS.mortgage.max : LIMITS.loan.max,
    minTermMonths:
      productType === "mortgage"
        ? TERM_LIMITS.mortgage.min * 12
        : TERM_LIMITS.loanConsumer.min * 12,
    maxTermMonths:
      productType === "mortgage"
        ? TERM_LIMITS.mortgage.max * 12
        : TERM_LIMITS.loanConsumer.max * 12,
    ltvLimit: productType === "mortgage" ? 90 : null,
    fixationOptions: productType === "mortgage" ? [...FIX_OPTIONS] : [],
    source: "kurzy-cz",
    sourceUrl,
    fetchedAt: fetchedAtIso,
  };
}

function parseKurzyRows(
  html: string,
  productType: "mortgage" | "loan",
  sourceUrl: string
): NormalizedOffer[] {
  const nowIso = new Date().toISOString();
  const rows = extractRows(html);
  const raw: NormalizedOffer[] = [];

  for (const rowHtml of rows) {
    const text = stripTags(rowHtml);
    const parsed = parseKurzyComparisonRow(text);
    if (!parsed) continue;

    const { providerName, nominalRate } = parsed;
    const offer = buildOffer(providerName, nominalRate, productType, sourceUrl, nowIso);
    const aprVal = parseApr(text);
    if (aprVal != null) offer.apr = aprVal;
    raw.push(offer);
  }

  return dedupeBestRate(raw);
}

/**
 * Zaměří HTML na blok výsledkové tabulky (nadpisy typu „Výsledek srovnání“ / „Výsledná sazba“),
 * aby řádky z jiných tabulek na stránce nezmátly parsování.
 */
function sliceHtmlToKurzyComparisonTable(html: string, kind: "mortgage" | "loan"): string {
  const patterns =
    kind === "mortgage"
      ? [
          /Výsledek\s+srovnání\s+hypoték/i,
          /Výsledek\s+srovnání/i,
          /výsledn[áa]\s+sazba/i,
        ]
      : [/Výsledek\s+srovnání/i, /srovnání\s+p[uů]j[čc]ek/i];

  let start = -1;
  for (const re of patterns) {
    const m = re.exec(html);
    if (m && (start < 0 || (m.index != null && m.index < start))) start = m.index ?? -1;
  }
  if (start < 0) return html;
  return html.slice(Math.max(0, start - 160));
}

function parseWwwComparisonTable(
  html: string,
  productType: "mortgage" | "loan",
  sourceUrl: string
): NormalizedOffer[] {
  const narrowed = sliceHtmlToKurzyComparisonTable(html, productType);
  let offers = parseKurzyRows(narrowed, productType, sourceUrl);
  if (offers.length === 0) offers = parseKurzyRows(html, productType, sourceUrl);
  return offers;
}

function looksLikeHtmlDocument(text: string): boolean {
  return /<\s*(html|table|script|meta)\b/i.test(text);
}

function stripJsonpToJson(raw: string): string | null {
  const trimmed = raw.trim();
  const mFn = trimmed.match(/^[$A-Za-z_][$\w]*\s*\(([\s\S]*)\)\s*;?\s*$/);
  if (mFn) return mFn[1].trim();

  const l = trimmed.indexOf("{");
  const rBracket = trimmed.lastIndexOf("}");
  const lBracket = trimmed.indexOf("[");
  const rArr = trimmed.lastIndexOf("]");
  if (lBracket >= 0 && rArr > lBracket) {
    const arrSlice = trimmed.slice(lBracket, rArr + 1);
    return arrSlice;
  }
  if (l >= 0 && rBracket > l) return trimmed.slice(l, rBracket + 1);

  return null;
}

const DATA_BANK_KEYS = [
  "banka",
  "Banka",
  "nazevBanky",
  "názevBanky",
  "nazev",
  "název",
  "firma",
  "instituce",
  "jmeno",
  "jméno",
  "provozovatel",
] as const;

const DATA_RATE_KEYS = [
  "vyslednaSazba",
  "výslednáSazba",
  "sazba",
  "urokovaSazba",
  "úrokováSazba",
  "urok",
  "Úrok",
  "rocniUrok",
  "ROCNI_UROK",
  "VYSL_SAZBA",
] as const;

function firstString(o: Record<string, unknown>, keys: readonly string[]): string | null {
  for (const k of keys) {
    if (!(k in o)) continue;
    const v = o[k];
    if (typeof v === "string" && v.trim().length >= 2) return v.trim();
  }
  return null;
}

function firstKnownValue(o: Record<string, unknown>, keys: readonly string[]): unknown {
  for (const k of keys) {
    if (!(k in o)) continue;
    return o[k];
  }
  return undefined;
}

function coercePercentNumber(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v) && v > 0 && v < 40) return v;
  if (typeof v !== "string") return null;
  const cleaned = v.replace(/\s%/g, "%").trim();
  const m = cleaned.match(/(\d+[,.]\d{1,4}|\d+)/);
  if (!m) return null;
  const n = Number(m[1].replace(",", "."));
  if (!Number.isFinite(n) || n <= 0 || n > 35) return null;
  return n;
}

function tryCoerceStructuredRow(el: unknown): { providerName: string; nominalRate: number } | null {
  if (!el || typeof el !== "object") return null;
  const o = el as Record<string, unknown>;

  let name = firstString(o, DATA_BANK_KEYS);
  if (!name) {
    for (const [, v] of Object.entries(o)) {
      if (typeof v !== "string") continue;
      const t = v.trim();
      if (t.length < 4 || t.length > 120) continue;
      if (/^[\d\s,.%]+$/.test(t)) continue;
      name = t;
      break;
    }
  }

  const rateRaw = firstKnownValue(o, DATA_RATE_KEYS);
  const nominalRate = coercePercentNumber(rateRaw);
  if (!name || nominalRate == null) return null;
  if (junkProviderLabel(name)) return null;

  return { providerName: name.trim(), nominalRate };
}

function walkCollectRows(value: unknown, depth: number, out: NormalizedOffer[], meta: {
  productType: "mortgage" | "loan";
  sourceUrl: string;
  fetchedAtIso: string;
}): void {
  if (depth > 14) return;

  const row = tryCoerceStructuredRow(value);
  if (row) {
    out.push(buildOffer(row.providerName, row.nominalRate, meta.productType, meta.sourceUrl, meta.fetchedAtIso));
  }

  if (Array.isArray(value)) {
    for (const item of value) walkCollectRows(item, depth + 1, out, meta);
    return;
  }

  if (value && typeof value === "object") {
    const o = value as Record<string, unknown>;
    for (const nested of Object.values(o)) walkCollectRows(nested, depth + 1, out, meta);
  }
}

/**
 * Extrahuje orientační nabídky z odpovědi data.kurzy.cz (JSON / JSONP). Prázdné / neplatné → [].
 */
export function parseMortgageOffersFromDataKurzyPayload(
  rawText: string,
  productType: "mortgage" | "loan",
  sourceUrl: string
): NormalizedOffer[] {
  const trimmed = rawText.trim();
  if (!trimmed || looksLikeHtmlDocument(trimmed) || isKurzyBotWallHtml(trimmed)) return [];

  const jsonSlice = stripJsonpToJson(trimmed);
  const toParse = jsonSlice ?? trimmed;
  let parsed: unknown;
  try {
    parsed = JSON.parse(toParse) as unknown;
  } catch {
    return [];
  }

  const nowIso = new Date().toISOString();
  const out: NormalizedOffer[] = [];
  walkCollectRows(parsed, 0, out, { productType, sourceUrl, fetchedAtIso: nowIso });

  return dedupeBestRate(out);
}

async function tryFetchMortgageOffersFromDataEndpoints(
  productType: "mortgage" | "loan"
): Promise<NormalizedOffer[]> {
  const urls = productType === "mortgage" ? DATA_KURZY_MORTGAGE_URLS : DATA_KURZY_LOAN_URLS;

  for (const url of urls) {
    const response = await fetch(url, { headers: kurzyFetchHeaders(), cache: "no-store" });
    if (!response.ok) continue;

    const text = await response.text();
    const offers = parseMortgageOffersFromDataKurzyPayload(text, productType, url);
    if (offers.length > 0) return offers;
  }

  return [];
}

/**
 * Hypotéky: primárně HTML „Výsledek srovnání hypoték“ (sloupec výsledná sazba) na www.kurzy.cz,
 * teprve při prázdnu / nedostupnosti data.kurzy.cz jako záloha.
 */
export class KurzyRateProvider implements RateProvider {
  async fetchMortgageRates(): Promise<NormalizedOffer[]> {
    const wwwResponse = await fetch(KURZY_MORTGAGE_URL, {
      headers: kurzyFetchHeaders({ Referer: "https://www.kurzy.cz/hypoteky/srovnani-hypotek/" }),
      cache: "no-store",
    });
    if (!wwwResponse.ok) {
      throw new Error(`Kurzy mortgage fetch failed: ${wwwResponse.status}`);
    }

    const html = await wwwResponse.text();

    if (!isKurzyBotWallHtml(html)) {
      const wwwOffers = parseWwwComparisonTable(html, "mortgage", KURZY_MORTGAGE_URL);
      if (wwwOffers.length > 0) return wwwOffers;
    }

    const fromData = await tryFetchMortgageOffersFromDataEndpoints("mortgage");
    if (fromData.length > 0) return fromData;

    if (isKurzyBotWallHtml(html)) {
      throw new Error(
        "Kurzy mortgage: blokace WWW (Ověření uživatele) ani data.zdroj nevrátily řádky srovnání"
      );
    }
    throw new Error("Kurzy mortgage parser found no offers in WWW comparison table");
  }

  async fetchLoanRates(): Promise<NormalizedOffer[]> {
    const wwwResponse = await fetch(KURZY_LOAN_URL, {
      headers: kurzyFetchHeaders({ Referer: KURZY_LOAN_URL }),
      cache: "no-store",
    });
    if (!wwwResponse.ok) {
      throw new Error(`Kurzy loan fetch failed: ${wwwResponse.status}`);
    }

    const html = await wwwResponse.text();

    if (!isKurzyBotWallHtml(html)) {
      const wwwOffers = parseWwwComparisonTable(html, "loan", KURZY_LOAN_URL);
      if (wwwOffers.length > 0) return wwwOffers;
    }

    const fromData = await tryFetchMortgageOffersFromDataEndpoints("loan");
    if (fromData.length > 0) return fromData;

    if (isKurzyBotWallHtml(html)) {
      throw new Error(
        "Kurzy loans: blokace WWW (Ověření uživatele) ani data.zdroj nevrátily řádky srovnání"
      );
    }
    throw new Error("Kurzy loan parser found no offers in WWW comparison table");
  }
}
