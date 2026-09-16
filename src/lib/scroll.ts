/**
 * One place that owns in-page navigation.
 *
 * Two problems this fixes:
 *
 * 1. On mobile the menu links did nothing. Clicking one let the browser's
 *    default hash jump run while React was still closing the panel and
 *    `body.lock` still had `overflow: hidden` on it, so the jump was
 *    swallowed and the page stayed put.
 *
 * 2. On desktop the links jumped instantly rather than gliding. Lenis is
 *    driving the scroll there, and it does not intercept anchor clicks, so
 *    the native jump fought the smooth scroller.
 *
 * So anchors are handled explicitly: cancel the default, close whatever is
 * open, then scroll through Lenis when it exists and through the native
 * smooth behaviour when it does not.
 */
type LenisLike = {
  scrollTo: (
    target: number | string | HTMLElement,
    opts?: Record<string, unknown>,
  ) => void;
};

let lenis: LenisLike | null = null;

export function registerLenis(instance: LenisLike | null): void {
  lenis = instance;
}

/** Height of the fixed header, so a section never lands underneath it. */
function headerOffset(): number {
  const header = document.querySelector<HTMLElement>('.hdr');
  return (header?.offsetHeight ?? 70) + 8;
}

export function scrollToHash(hash: string): boolean {
  const id = hash.replace(/^#/, '');
  const target = id === 'top' ? null : document.getElementById(id);
  if (id !== 'top' && !target) return false;

  /**
   * The absolute document position is computed here and handed over as a
   * plain number.
   *
   * Passing Lenis an element plus an `offset` landed sections 172px short of
   * where they belong: between the element resolution, the `offset` option
   * and the `scroll-margin-top` in the stylesheet, more than one thing was
   * adjusting the same target. A number cannot be reinterpreted.
   */
  const y = target
    ? Math.max(0, target.getBoundingClientRect().top + window.scrollY - headerOffset())
    : 0;

  if (lenis) {
    lenis.scrollTo(y, { duration: 1.1 });
  } else {
    window.scrollTo({
      top: y,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
    });
  }

  // Keep the URL honest without letting the browser jump again.
  if (id === 'top') history.replaceState(null, '', window.location.pathname);
  else history.replaceState(null, '', `#${id}`);
  return true;
}
