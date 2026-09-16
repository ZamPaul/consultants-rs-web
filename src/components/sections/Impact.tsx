import { getImageProps } from 'next/image';
import impactDesktop from '@/assets/impact-desktop.webp';
import impactMobile from '@/assets/impact-mobile.webp';
import { IMPACT } from '@/lib/content';

const MOBILE_UP = '(min-width: 760px)';

export function Impact() {
  const common = { alt: '', sizes: '100vw', quality: 82 };
  const { props: desktop } = getImageProps({
    ...common,
    src: impactDesktop,
    width: 1672,
    height: 941,
  });
  const { props: mobile } = getImageProps({
    ...common,
    src: impactMobile,
    width: 941,
    height: 1672,
  });

  return (
    <section className="sec impact" id="impact">
      <div className="impact-bg" data-par-box="0.1">
        <picture>
          <source media={MOBILE_UP} srcSet={desktop.srcSet} />
          <source srcSet={mobile.srcSet} />
          <img {...mobile} alt="" decoding="async" />
        </picture>
      </div>
      <div className="wrap">
        <div className="impact-grid">
          <div data-fade>
            <span className="eyebrow">{IMPACT.eyebrow}</span>
            <h2 className="h2" data-split>
              {IMPACT.headline[0]}
              <br />
              {IMPACT.headline[1]}
            </h2>
          </div>
          <dl className="figs" data-stagger>
            {IMPACT.figures.map((f) => (
              <div className="fig" key={f.label}>
                <dt className="fig-v tnum">
                  <span data-count={f.value}>{f.value}</span>
                  {f.suffix}
                </dt>
                <dd className="fig-l">{f.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
