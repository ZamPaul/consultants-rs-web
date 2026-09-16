'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Logo } from '@/components/Logo';
import { MENU, NAV } from '@/lib/content';
import { scrollToHash } from '@/lib/scroll';
import { SITE } from '@/lib/site';

function Arrow() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M1 7h11M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [stuck, setStuck] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const sheetId = useId();

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    burgerRef.current?.focus();
  }, []);

  useEffect(() => {
    document.body.classList.toggle('lock', open);
    return () => document.body.classList.remove('lock');
  }, [open]);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey)
        return;
      const link = (event.target as HTMLElement | null)?.closest?.('a[href^="#"]');
      if (!(link instanceof HTMLAnchorElement)) return;
      const hash = link.getAttribute('href');
      if (!hash || hash === '#') return;
      if (scrollToHash(hash)) {
        event.preventDefault();
        setOpen(false);
      }
    }
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  useEffect(() => {
    if (!open) return;
    const sheet = sheetRef.current;
    sheet?.querySelector<HTMLAnchorElement>('a')?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        close();
        return;
      }
      if (event.key !== 'Tab' || !sheet) return;
      // Keep tabbing inside the panel while it covers the page.
      const focusable = sheet.querySelectorAll<HTMLElement>('a[href], button');
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, close]);

  return (
    <>
      <header className={stuck ? 'hdr stuck' : 'hdr'} id="hdr">
        <div className="wrap">
          <a
            className="brand-link"
            href="#top"
            aria-label={`${SITE.lockup}, back to top`}
          >
            <Logo ground="light" size={44} priority />
          </a>

          <nav className="nav" aria-label="Primary">
            {NAV.map((item) => (
              <a key={item.label} href={item.href}>
                {item.label}
                <i aria-hidden="true" />
              </a>
            ))}
          </nav>

          <div className="hdr-end">
            <a className="btn btn--gold hdr-cta" href="#contact">
              <span>
                Let&rsquo;s Talk <Arrow />
              </span>
            </a>
            {/*
              Change 01 from sign off: the burger sits on the right on mobile.
              It is last in the DOM and .hdr-end is pushed right, so the visual
              order and the tab order agree. The CTA drops out below 860px
              rather than fighting the burger for the same corner.
            */}
            <button
              ref={burgerRef}
              className="burger"
              type="button"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls={sheetId}
              onClick={() => (open ? close() : setOpen(true))}
            >
              <i aria-hidden="true" />
              <i aria-hidden="true" />
              <i aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/*
        The curtain. A clip-path on the panel, not a slide, so the content is
        revealed in place rather than dragged in.

        Easing and timings are v5's, which were picked numerically rather than
        by feel: the first attempt was 95% open in 130ms of a 660ms transition,
        so it snapped and only the fade read as motion. Measured in page with
        rAF, this curve reads 15% at 184ms, 55% at 300ms, 94% at 551ms.

        It is pure CSS here, deliberately. In v5 the item stagger was GSAP, and
        a GSAP failure meant the links never faded in. The transition-delay
        ladder in globals.css does the same job with no dependency, and it also
        removes the close-flash bug by construction: the curtain's own
        transition-delay holds it open until the items have left.
      */}
      <div
        id={sheetId}
        ref={sheetRef}
        className="sheet"
        data-open={open}
        inert={!open}
        aria-label="Menu"
      >
        <nav className="sheet-nav" aria-label="Mobile">
          {MENU.map((item, i) => (
            <a
              className="sl sheet-item"
              key={item.label}
              href={item.href}
              style={{ '--i': i, '--r': MENU.length - 1 - i } as React.CSSProperties}
            >
              {item.label}
              <em>{String(i + 1).padStart(2, '0')}</em>
            </a>
          ))}
        </nav>
        <div className="sheet-end">
          <a
            className="btn btn--gold sheet-item"
            href="#contact"
            style={{ '--i': MENU.length, '--r': 0 } as React.CSSProperties}
          >
            <span>Start a Conversation</span>
          </a>
        </div>
      </div>
    </>
  );
}
