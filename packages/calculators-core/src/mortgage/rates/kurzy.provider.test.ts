import { describe, expect, it, vi } from "vitest";
import type { NormalizedOffer } from "./types";
import {
  KurzyRateProvider,
  isKurzyBotWallHtml,
  parseKurzyComparisonRow,
  parseMortgageOffersFromDataKurzyPayload,
} from "./kurzy.provider";

describe("parseKurzyComparisonRow", () => {
  it("parsuje typický řádek výsledku (jednorázové mezery po stripTags)", () => {
    const row =
      "Raiffeisenbank 6 181 680 4,64 % 25 757 Ověřit dostupnost".replace(/\s+/g, " ");
    expect(parseKurzyComparisonRow(row)).toEqual({
      providerName: "Raiffeisenbank",
      nominalRate: 4.64,
    });
  });

  it("podporuje víceslovné názvy bank", () => {
    const row = "Česká spořitelna 6 208 080 4.69 % 25 867";
    expect(parseKurzyComparisonRow(row)?.providerName).toBe("Česká spořitelna");
    expect(parseKurzyComparisonRow(row)?.nominalRate).toBe(4.69);
  });

  it("ignoruje řádek hlavičky tabulky", () => {
    expect(
      parseKurzyComparisonRow("Banka Celkemzaplatím Výslednásazba Měsíčnísplátka")
    ).toBeNull();
  });

  it("parsuje řádek z ukázkové tabulky v HTML struktuře", () => {
    const html = `<tr><td>Partners banka</td><td>6&nbsp;366&nbsp;960</td><td>4,99 %</td><td>26&nbsp;529</td></tr>`;
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    expect(parseKurzyComparisonRow(text)?.providerName).toBe("Partners banka");
    expect(parseKurzyComparisonRow(text)?.nominalRate).toBe(4.99);
  });
});

describe("bot wall detection", () => {
  it("detekuje stránku s výzvou k ověření uživatele", () => {
    expect(isKurzyBotWallHtml("<html>Ověření uživatele …</html>")).toBe(true);
    expect(isKurzyBotWallHtml('<div class="x">Ověření uživatele</div>')).toBe(true);
  });

  it("neoznačí běžnou tabulku jako bot wall", () => {
    expect(isKurzyBotWallHtml("<table><tr><td>UniCredit Bank</td></tr></table>")).toBe(false);
  });
});

describe("parseMortgageOffersFromDataKurzyPayload", () => {
  it("parsuje vnořený JSON se známými klíči", () => {
    const payload = JSON.stringify({
      blok: [
        { banka: "UniCredit Bank", sazba: "4,29 %" },
        { banka: "mBank", urokovaSazba: 4.99 },
      ],
    });
    const offers = parseMortgageOffersFromDataKurzyPayload(
      payload,
      "mortgage",
      "https://data.kurzy.cz/test.json"
    );
    const byId = new Map(offers.map((o) => [o.providerId, o]));
    expect(byId.get("unicredit-bank")?.nominalRate).toBeCloseTo(4.29);
    expect(byId.get("mbank")?.nominalRate).toBeCloseTo(4.99);
  });

  it("JSONP vypsat({...})", () => {
    const body = `vypsat({"rows":[{"nazev":"Raiffeisenbank","sazba":"4.64"}]});`;
    const offers = parseMortgageOffersFromDataKurzyPayload(
      body,
      "mortgage",
      "https://data.kurzy.cz/x.js"
    );
    expect(offers[0]?.providerName).toBe("Raiffeisenbank");
    expect(offers[0]?.nominalRate).toBe(4.64);
  });

  it("vrátí prázdno pro HTML dokument", () => {
    expect(
      parseMortgageOffersFromDataKurzyPayload(
        "<html><body>…</body></html>",
        "mortgage",
        "https://data.kurzy.cz/e"
      )
    ).toEqual([]);
  });
});

describe("KurzyRateProvider markup integration", () => {
  const sampleHtml = `
  <body>
    <table>
      <thead><tr><th>Banka</th><th>C</th><th>S</th><th>M</th></tr></thead>
      <tbody>
        <tr><td>Unicredit Bank</td><td>6&nbsp;208&nbsp;080</td><td>4,69 %</td><td>25 867</td></tr>
        <tr><td>mBank</td><td>4&nbsp;776&nbsp;720</td><td>4,99 %</td><td>19 903</td></tr>
      </tbody>
    </table>
  </body>`;

  async function stubFetchMortgage(okBody: string) {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const u = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
      if (typeof u === "string" && u.includes("data.kurzy.cz"))
        return new Response("", { status: 200 });
      return new Response(okBody, { status: 200 });
    });
    vi.stubGlobal("fetch", fetchMock);
    try {
      return await new KurzyRateProvider().fetchMortgageRates();
    } finally {
      vi.unstubAllGlobals();
      fetchMock.mockClear();
    }
  }

  it("produceruje NormalizedOffer z HTML po prázdném data.zdroji", async () => {
    const offers: NormalizedOffer[] = await stubFetchMortgage(sampleHtml);
    const byId = new Map(offers.map((o) => [o.providerId, o]));
    expect(offers.map((o) => o.providerName).sort()).toEqual(["Unicredit Bank", "mBank"]);
    expect(byId.get("mbank")?.nominalRate).toBe(4.99);
    expect(byId.get("unicredit-bank")?.nominalRate).toBe(4.69);
  });

  it("bez tabulky po bot-stěně na WWW a prázdném data zdroji hodí chybu", async () => {
    await expect(
      stubFetchMortgage("<title>Kurzy</title><p>Ověření uživatele …</p>")
    ).rejects.toThrow(/blokace WWW|Kurzy mortgage/i);
  });
});
