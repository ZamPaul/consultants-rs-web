import { FIGURES } from '@/lib/content';

/**
 * Change 03 from sign off: the hero's three counters, lifted into their own
 * band directly beneath it.
 *
 * The client chose to keep the Impact figures further down the page as well.
 * Worth remembering that "50+ Businesses Supported" here and "50+ Projects
 * Completed" there sit close enough for a reader to notice they are probably
 * the same fifty.
 *
 * Values render as their final text. Phase 3 will count them up from zero on
 * first view, but the resting state is the real number, so the band reads
 * correctly with no JavaScript and in a screenshot.
 */
export function Figures() {
  return (
    <section className="sec figures" id="figures" aria-label="By the numbers">
      <div className="wrap">
        <dl className="fig-row" data-stagger>
          {FIGURES.map((f) => (
            <div className="fig" key={f.label}>
              <dt className="fig-v tnum">
                {'value' in f ? (
                  <>
                    <span data-count={f.value}>{f.value}</span>
                    {f.suffix}
                  </>
                ) : (
                  f.text
                )}
              </dt>
              <dd className="fig-l">{f.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
