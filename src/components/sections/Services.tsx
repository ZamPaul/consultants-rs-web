import Image, { type StaticImageData } from 'next/image';
import service1 from '@/assets/service1.webp';
import service2 from '@/assets/service2.webp';
import service3 from '@/assets/service3.webp';
import { Arrow } from '@/components/Icons';
import { SERVICES } from '@/lib/content';

const IMAGES: StaticImageData[] = [service1, service2, service3];

export function Services() {
  return (
    <section className="sec light light-2" id="services">
      <div className="wrap">
        <div className="center" data-fade>
          <span className="eyebrow">{SERVICES.eyebrow}</span>
          <h2 className="h2" data-split>
            {SERVICES.headline[0]}
            <br />
            {SERVICES.headline[1]}
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
