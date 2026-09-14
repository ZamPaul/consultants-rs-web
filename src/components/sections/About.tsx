import Image from 'next/image';
import arch from '@/assets/arch.webp';
import { Arrow } from '@/components/Icons';
import { ABOUT } from '@/lib/content';

export function About() {
  return (
    <section className="sec light" id="about">
      <div className="wrap">
        <div className="ab">
          <div data-fade>
            <span className="eyebrow">{ABOUT.eyebrow}</span>
            <h2 className="h2" data-split>
              {ABOUT.headline[0]}
              <br />
              {ABOUT.headline[1]}
            </h2>
            {ABOUT.body.map((para, i) => (
              <p className="lede" key={i} style={{ marginTop: i === 0 ? 24 : 16 }}>
                {para}
              </p>
            ))}
            <p style={{ marginTop: 30 }}>
              <a className="alink" href="#founders">
                Our Story <Arrow />
              </a>
            </p>
            <ul className="ab-pills" data-stagger>
              {ABOUT.pills.map((pill) => (
                <li key={pill}>{pill}</li>
              ))}
            </ul>
          </div>

          <div className="ab-media" data-fade>
            <figure>
              <Image
                src={arch}
                alt={ABOUT.imageAlt}
                sizes="(max-width: 900px) 100vw, 40vw"
                placeholder="blur"
                data-par="0.14"
              />
            </figure>
            <blockquote className="ab-quote">
              <q>{ABOUT.quote}</q>
              <cite>{ABOUT.cite}</cite>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}
