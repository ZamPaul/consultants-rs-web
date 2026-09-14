import Image, { type StaticImageData } from 'next/image';
import s1 from '@/assets/s1.webp';
import s2 from '@/assets/s2.webp';
import s3 from '@/assets/s3.webp';
import { Arrow, Tick } from '@/components/Icons';
import { SERVICES } from '@/lib/content';

const IMAGES: StaticImageData[] = [s1, s2, s3];

export function Services() {
  return (
    <section className="sec light light-2" id="services">
      <div className="wrap">
        <div className="center" data-fade>
          <span className="eyebrow">{SERVICES.eyebrow}</span>
          <h2 className="h2" data-split>
            {SERVICES.headline}
          </h2>
          <p className="lede" style={{ marginTop: 20 }}>
            {SERVICES.lede}
          </p>
        </div>

        <div className="svc" data-stagger>
          {SERVICES.items.map((item, i) => (
            <article className="card" key={item.n}>
              <div className="card-img">
                <Image
                  src={IMAGES[i]!}
                  alt={item.imageAlt}
                  sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
                  placeholder="blur"
                  data-par="0.16"
                />
                <span className="card-n" aria-hidden="true">
                  {item.n}
                </span>
              </div>
              <div className="card-b">
                <h3 className="h3">
                  {item.title[0]}
                  <br />
                  {item.title[1]}
                </h3>
                <p>{item.body}</p>
                <ul className="ticks">
                  {item.points.map((point) => (
                    <li key={point}>
                      <Tick />
                      {point}
                    </li>
                  ))}
                </ul>
                <a className="alink" href="#contact">
                  Learn More <Arrow />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
