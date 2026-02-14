/**
 * IntersectionObserver helper for fade-in-up animations.
 * Respects prefers-reduced-motion.
 */
export function initFadeInObserver(options?: { rootMargin?: string; threshold?: number }) {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    document.querySelectorAll('.animate-fade-in-up').forEach((el) => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    {
      rootMargin: options?.rootMargin ?? '0px 0px -40px 0px',
      threshold: options?.threshold ?? 0.1,
    }
  );

  document.querySelectorAll('.animate-fade-in-up').forEach((el) => observer.observe(el));
}
