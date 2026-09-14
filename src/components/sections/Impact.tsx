import Image from 'next/image';
import earth from '@/assets/earth.webp';
import { IMPACT } from '@/lib/content';

export function Impact() {
  return (
    <section className="sec impact" id="impact">
      <div className="impact-bg" data-par-box="0.1">
        <Image src={earth} alt="" sizes="100vw" placeholder="blur" />
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
