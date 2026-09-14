'use client';

import { useId, useState } from 'react';
import { FAQ } from '@/lib/content';

/**
 * Every answer is in the DOM at all times, collapsed with a grid row rather
 * than removed. Two reasons: FAQ copy is exactly the content worth having
 * indexed, and without JavaScript the `js` class is absent so the collapse
 * rule never applies and the whole list reads as plain prose.
 */
export function Faq() {
  const [open, setOpen] = useState(0);
  const base = useId();

  return (
    <section className="sec light" id="faq">
      <div className="wrap">
        <div className="faq-grid">
          <aside className="faq-aside" data-fade>
            <span className="eyebrow">{FAQ.eyebrow}</span>
            <h2 className="h2" data-split>
              {FAQ.headline[0]}
              <br />
              {FAQ.headline[1]}
            </h2>
            <p className="lede" style={{ marginTop: 22, maxWidth: '30ch' }}>
              {FAQ.lede}
            </p>
          </aside>

          <div className="fl" data-stagger>
            {FAQ.items.map((item, i) => {
              const isOpen = open === i;
              return (
                <div className="fi" key={item.q} data-open={isOpen || undefined}>
                  <h3>
                    <button
                      type="button"
                      className="fq"
                      aria-expanded={isOpen}
                      aria-controls={`${base}-${i}`}
                      onClick={() => setOpen(isOpen ? -1 : i)}
                    >
                      <span className="fn" aria-hidden="true">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span>{item.q}</span>
                      <span className="pm" aria-hidden="true" />
                    </button>
                  </h3>
                  <div className="fa" id={`${base}-${i}`} role="region">
                    <div>
                      <p>{item.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
