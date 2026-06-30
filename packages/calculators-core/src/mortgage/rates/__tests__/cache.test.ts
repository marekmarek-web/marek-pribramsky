import { describe, expect, it, vi } from "vitest";
import { getOrFetchWithCache } from "../cache";

describe("rates cache fallback", () => {
  it("returns last valid snapshot when provider fails", async () => {
    const key = `test-${Date.now()}`;
    const first = await getOrFetchWithCache(key, 1, async () => [{ rate: 4.5 }]);
    expect(first[0].rate).toBe(4.5);

    await new Promise((resolve) => setTimeout(resolve, 5));

    const failingFetcher = vi.fn(async () => {
      throw new Error("provider down");
    });
    const fallback = await getOrFetchWithCache(key, 1, failingFetcher);

    expect(fallback[0].rate).toBe(4.5);
    expect(failingFetcher).toHaveBeenCalledTimes(1);
  });

  it("does not serve snapshots older than MAX_SNAPSHOT_AGE_MS", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-01T10:00:00Z"));
    const key = `stale-${Date.now()}`;

    await getOrFetchWithCache(key, 1, async () => [{ rate: 4.5 }]);

    vi.setSystemTime(new Date("2026-06-03T10:00:00Z"));

    await expect(
      getOrFetchWithCache(key, 1, async () => {
        throw new Error("provider down");
      }),
    ).rejects.toThrow("provider down");

    vi.useRealTimers();
  });
});
