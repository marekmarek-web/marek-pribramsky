type CacheEntry<T> = {
  data: T;
  fetchedAtMs: number;
  expiresAtMs: number;
};

type SnapshotEntry = {
  data: unknown;
  fetchedAtMs: number;
};

const cacheStore = new Map<string, CacheEntry<unknown>>();
const lastValidSnapshot = new Map<string, SnapshotEntry>();

/** Do not serve stale scraped snapshots forever when upstream fetch keeps failing. */
export const MAX_SNAPSHOT_AGE_MS = 24 * 60 * 60 * 1000;

export async function getOrFetchWithCache<T>(
  key: string,
  ttlMs: number,
  fetcher: () => Promise<T>
): Promise<T> {
  const now = Date.now();
  const cached = cacheStore.get(key) as CacheEntry<T> | undefined;
  if (cached && cached.expiresAtMs > now) {
    return cached.data;
  }

  try {
    const data = await fetcher();
    cacheStore.set(key, {
      data,
      fetchedAtMs: now,
      expiresAtMs: now + ttlMs,
    });
    lastValidSnapshot.set(key, { data, fetchedAtMs: now });
    return data;
  } catch (error) {
    const snapshot = lastValidSnapshot.get(key);
    if (
      snapshot !== undefined &&
      now - snapshot.fetchedAtMs <= MAX_SNAPSHOT_AGE_MS
    ) {
      return snapshot.data as T;
    }
    throw error;
  }
}
