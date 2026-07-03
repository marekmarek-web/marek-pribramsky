export const HASH_HEADER_OFFSET = 88;
const PENDING_HASH_KEY = "pb_pending_hash";
const MAX_RETRIES = 50;
const RETRY_MS = 100;

/** Vezme poslední platný fragment — `#spoluprace#kontakt` → `kontakt`. */
export function parseHashTarget(rawHash: string): string | null {
  if (!rawHash?.trim()) return null;
  const segments = rawHash.split("#").map((s) => s.trim()).filter(Boolean);
  return segments.length > 0 ? segments[segments.length - 1]! : null;
}

export function getHashTargetFromLocation(): string | null {
  if (typeof window === "undefined") return null;
  return parseHashTarget(window.location.hash);
}

/** Opraví neplatný URL hash na jeden fragment. */
export function normalizeLocationHash(targetId: string): void {
  if (typeof window === "undefined") return;
  const expected = `#${targetId}`;
  if (window.location.hash === expected) return;
  const url = `${window.location.pathname}${window.location.search}${expected}`;
  window.history.replaceState(null, "", url);
}

export function stashPendingHash(targetId: string): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(PENDING_HASH_KEY, targetId);
  } catch {
    /* private mode */
  }
}

export function takePendingHash(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const v = sessionStorage.getItem(PENDING_HASH_KEY);
    if (v) sessionStorage.removeItem(PENDING_HASH_KEY);
    return v;
  } catch {
    return null;
  }
}

export function splitHashHref(href: string): { pathname: string; hash?: string } {
  const hashIndex = href.indexOf("#");
  if (hashIndex === -1) return { pathname: href || "/" };
  const pathname = href.slice(0, hashIndex) || "/";
  const rawHash = href.slice(hashIndex);
  const hash = parseHashTarget(rawHash);
  return hash ? { pathname, hash } : { pathname };
}

export function scrollToHashTarget(
  targetId: string,
  opts?: { behavior?: ScrollBehavior; attempt?: number },
): void {
  if (typeof window === "undefined" || !targetId) return;
  const attempt = opts?.attempt ?? 0;
  const el = document.getElementById(targetId);
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - HASH_HEADER_OFFSET;
    window.scrollTo({
      top: Math.max(0, top),
      behavior: opts?.behavior ?? (attempt === 0 ? "auto" : "smooth"),
    });
    return;
  }
  if (attempt < MAX_RETRIES) {
    window.setTimeout(
      () => scrollToHashTarget(targetId, { ...opts, attempt: attempt + 1 }),
      RETRY_MS,
    );
  }
}

export function scrollToHashFromLocation(opts?: { behavior?: ScrollBehavior }): string | null {
  const pending = takePendingHash();
  const target = pending ?? getHashTargetFromLocation();
  if (!target) return null;
  normalizeLocationHash(target);
  scrollToHashTarget(target, opts);
  return target;
}
