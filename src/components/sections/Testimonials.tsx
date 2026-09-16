'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { CLIENTS, TESTIMONIALS } from '@/lib/content';

/**
 * One quote at a time, with arrows, dots, keyboard and swipe.
 *
 * Without JavaScript the `js` class is never added to <html>, the track keeps
 * its stacked column layout, and all three quotes are simply readable. No
 * content is hidden behind a control that cannot run. Same principle as the
 * FAQ below it.
 */
export function Testimonials() {
  const [i, setI] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const touchX = useRef<number | null>(null);
  const last = TESTIMONIALS.length - 1;

  const go = useCallback(
    (next: number) => setI(next < 0 ? last : next > last ? 0 : next),
    [last],
  );

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === 'ArrowLeft') go(i - 1);
      if (event.key === 'ArrowRight') go(i + 1);
    }
    track.addEventListener('keydown', onKey);
    return () => track.removeEventListener('keydown', onKey);
  }, [i, go]);

  return (
    <section className="sec light light-2" id="clients">
      <div className="wrap">
        <div className="tst-top" data-fade>
          <div>
            <span className="eyebrow">{CLIENTS.eyebrow}</span>
            <h2 className="h2" data-split>
              {CLIENTS.headline}
            </h2>
          </div>
          <div className="tst-nav">
            <button
              type="button"
              onClick={() => go(i - 1)}
              aria-label="Previous testimonial"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden="true"
              >
                <path d="M13 7H2M6 3L2 7l4 4" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </button>
            <button type="button" onClick={() => go(i + 1)} aria-label="Next testimonial">
              <svg
                width="15"
                height="15"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden="true"
              >
                <path d="M1 7h11M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </button>
          </div>
        </div>

        <div
          className="tst-view"
          data-fade
          role="group"
          aria-roledescription="carousel"
          aria-label="Client testimonials"
          tabIndex={0}
          ref={trackRef}
          onTouchStart={(e) => (touchX.current = e.touches[0]?.clientX ?? null)}
          onTouchEnd={(e) => {
            const start = touchX.current;
            const end = e.changedTouches[0]?.clientX;
            if (start == null || end == null) return;
            if (Math.abs(end - start) > 50) go(end < start ? i + 1 : i - 1);
            touchX.current = null;
          }}
        >
          <div className="tst-track" style={{ '--i': i } as React.CSSProperties}>
            {TESTIMONIALS.map((t, n) => (
              <figure
                className="quote-card"
                key={t.name}
                aria-hidden={n !== i || undefined}
              >
                <span className="qm" aria-hidden="true">
                  &ldquo;
                </span>
                <blockquote>{t.quote}</blockquote>
                <figcaption className="who">
                  <b>{t.name}</b>
                  <span>{t.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="dots">
            {TESTIMONIALS.map((t, n) => (
              <button
                type="button"
                key={t.name}
                className={n === i ? 'on' : undefined}
                onClick={() => go(n)}
                aria-label={`Testimonial ${n + 1} of ${TESTIMONIALS.length}`}
                aria-current={n === i || undefined}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
