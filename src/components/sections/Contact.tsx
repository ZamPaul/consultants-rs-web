import Image from 'next/image';
import cta from '@/assets/cta.webp';
import { ContactForm } from '@/components/ContactForm';
import { CTA } from '@/lib/content';

const ICONS = [
  <>
    <path d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z" />
    <circle cx="12" cy="10" r="2.6" />
  </>,
  <>
    <path d="M4 5c0-1 1-2 2-2h2l2 5-2.5 1.5a12 12 0 005 5L14 12l5 2v2c0 1-1 2-2 2A15 15 0 014 5z" />
  </>,
  <>
    <rect x="3" y="5" width="18" height="14" rx="1.5" />
    <path d="M3.5 6.5l8.5 6 8.5-6" />
  </>,
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 6.5V12l3.5 2.2" />
  </>,
];

export function Contact() {
  return (
    <section className="sec ct" id="contact">
      <div className="ct-bg" data-par-box="0.1">
        <Image src={cta} alt="" sizes="100vw" placeholder="blur" />
      </div>
      <div className="wrap">
        <div className="center ct-head" data-fade>
          <span className="eyebrow">{CTA.eyebrow}</span>
          <h2 className="h2" data-split>
            {CTA.headline}
          </h2>
          <p className="lede" style={{ marginTop: 20 }}>
            {CTA.lede}
          </p>
        </div>

        <div className="ct-grid">
          <div data-fade>
            <ul className="ct-list">
              {CTA.details.map((detail, i) => {
                const inner = (
                  <>
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      aria-hidden="true"
                    >
                      {ICONS[i]}
                    </svg>
                    <span>
                      <em>{detail.label}</em>
                      <b>
                        {detail.value.map((line, n) => (
                          <span key={line}>
                            {n > 0 ? <br /> : null}
                            {line}
                          </span>
                        ))}
                      </b>
                    </span>
                  </>
                );
                return (
                  <li key={detail.label}>
                    {'href' in detail && detail.href ? (
                      <a href={detail.href}>{inner}</a>
                    ) : (
                      inner
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
