import { Arrow } from '@/components/Icons';
import { INDUSTRIES } from '@/lib/content';

const ICONS = [
  <>
    <path d="M12 2.5c3 2.2 4.6 5.4 4.6 9 0 1.6-.3 3-.9 4.3H8.3A10.6 10.6 0 017.4 11.5c0-3.6 1.6-6.8 4.6-9z" />
    <path d="M8.3 15.8L6 18.6l2.6-.4M15.7 15.8l2.3 2.8-2.6-.4M10.6 19.8h2.8" />
    <circle cx="12" cy="10" r="1.7" />
  </>,
  <>
    <path d="M4 9.5h16V20H4z" />
    <path d="M3 9.5L5 4h14l2 5.5" />
    <path d="M9.5 20v-5h5v5" />
  </>,
  <>
    <path d="M14.5 6.2a3.8 3.8 0 015.3 5.3l-8 8-5.3-5.3z" />
    <path d="M4 20l2.5-2.5" />
    <circle cx="16.6" cy="8.9" r="1.1" />
  </>,
  <>
    <path d="M5 8h14l-1.2 12H6.2z" />
    <path d="M9 8V6a3 3 0 016 0v2" />
  </>,
  <>
    <path d="M3.5 15.5v-3l2-4.5h13l2 4.5v3" />
    <path d="M3.5 15.5h17v2.8h-3v-2.8M6.5 18.3v-2.8" />
    <circle cx="7.5" cy="12.5" r="1" />
    <circle cx="16.5" cy="12.5" r="1" />
  </>,
  <>
    <path d="M4 21V8l7-4.5L18 8v13" />
    <path d="M8.5 21v-5h5v5M8.5 11h5" />
    <path d="M18 12h2.5v9H18" />
  </>,
  <>
    <path d="M12 3l2 5.2 5.2 2-5.2 2-2 5.2-2-5.2-5.2-2 5.2-2z" />
    <path d="M18.5 16.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z" />
  </>,
  <>
    <circle cx="5.5" cy="12" r="1.5" />
    <circle cx="12" cy="12" r="1.5" />
    <circle cx="18.5" cy="12" r="1.5" />
  </>,
];

export function Industries() {
  return (
    <section className="sec light" id="industries">
      <div className="wrap">
        <div className="ind-grid">
          <div data-fade>
            <span className="eyebrow">{INDUSTRIES.eyebrow}</span>
            <h2 className="h2" data-split>
              {INDUSTRIES.headline}
            </h2>
            <p className="lede" style={{ marginTop: 22 }}>
              {INDUSTRIES.lede}
            </p>
            <p style={{ marginTop: 28 }}>
              <a className="alink" href="#contact">
                Talk About Yours <Arrow />
              </a>
            </p>
          </div>
          <ul className="ind-tiles" data-stagger>
            {INDUSTRIES.tiles.map((tile, i) => (
              <li className="tile" key={tile}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  aria-hidden="true"
                >
                  {ICONS[i]}
                </svg>
                <span>{tile}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
