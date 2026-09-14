import Image from 'next/image';
import tower from '@/assets/tower.webp';
import { WHY } from '@/lib/content';
import { SITE } from '@/lib/site';

const ICONS = [
  <>
    <circle cx="12" cy="12" r="8.6" />
    <circle cx="12" cy="12" r="3.6" />
    <circle cx="12" cy="12" r="0.6" fill="currentColor" />
  </>,
  <>
    <path d="M3 11l3-3 4 3 3-2 4 3 4-4" />
    <path d="M3 17l4-3 4 2 3-3 4 2 3-3" />
  </>,
  <>
    <path d="M4 7h16M4 12h16M4 17h16" />
    <circle cx="9" cy="7" r="2" fill="currentColor" stroke="none" />
    <circle cx="15" cy="12" r="2" fill="currentColor" stroke="none" />
    <circle cx="7" cy="17" r="2" fill="currentColor" stroke="none" />
  </>,
  <>
    <path d="M3 17l5.5-5.5 3.5 3.5L21 6" />
    <path d="M15 6h6v6" />
  </>,
];

export function Why() {
  return (
    <section className="sec why" id="why">
      <div className="why-bg">
        <Image src={tower} alt="" sizes="100vw" placeholder="blur" data-par="0.14" />
      </div>
      <div className="wrap">
        <div className="why-grid">
          <div className="why-head" data-fade>
            <span className="eyebrow">{WHY.eyebrow}</span>
            <h2 className="h2" data-split>
              {WHY.headline[0]}
              <br />
              {WHY.headline[1]}
            </h2>
            <p className="lede" style={{ marginTop: 22 }}>
              {WHY.lede}
            </p>
          </div>
          <div data-fade>
            <ul className="why-items" data-stagger>
              {WHY.items.map((item, i) => (
                <li className="why-item" key={item.title}>
                  <span className="why-ico" aria-hidden="true">
                    <svg
                      width="19"
                      height="19"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinejoin="round"
                    >
                      {ICONS[i]}
                    </svg>
                  </span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                  </div>
                </li>
              ))}
            </ul>
            <blockquote className="why-quote">
              <q>{WHY.quote}</q>
              <cite>{SITE.name}</cite>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}
