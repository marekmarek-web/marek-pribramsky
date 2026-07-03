import { describe, expect, it } from "vitest";
import { parseHashTarget, splitHashHref } from "@/lib/navigation/hashScroll";

describe("hashScroll", () => {
  it("parses last segment from malformed double hash", () => {
    expect(parseHashTarget("#spoluprace#kontakt")).toBe("kontakt");
    expect(parseHashTarget("#kontakt")).toBe("kontakt");
  });

  it("splits hash hrefs", () => {
    expect(splitHashHref("/#kontakt")).toEqual({ pathname: "/", hash: "kontakt" });
    expect(splitHashHref("/hypotecnikalkulacka")).toEqual({ pathname: "/hypotecnikalkulacka" });
  });
});
