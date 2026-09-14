import { Logo } from '@/components/Logo';
import { CONTACT, FOOTER } from '@/lib/content';
import { SITE } from '@/lib/site';

const ICONS: Record<string, string> = {
  LinkedIn:
    'M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.76V21h-4v-5.6c0-1.34-.03-3.07-1.9-3.07-1.9 0-2.2 1.46-2.2 2.97V21h-4z',
  Facebook:
    'M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5h1.65V3.6c-.29-.04-1.27-.12-2.41-.12-2.38 0-4.01 1.45-4.01 4.13v2.29H7.5V13h2.78v8z',
  YouTube:
    'M21.6 7.2s-.2-1.4-.8-2c-.76-.8-1.6-.8-2-.85C16 4.2 12 4.2 12 4.2h-.01s-4 0-6.8.2c-.4.05-1.24.05-2 .85-.6.6-.8 2-.8 2S2.2 8.8 2.2 10.5v1.6c0 1.6.2 3.3.2 3.3s.2 1.4.8 2c.76.8 1.76.77 2.2.86 1.6.15 6.8.2 6.8.2s4 0 6.8-.21c.4-.05 1.24-.05 2-.85.6-.6.8-2 .8-2s.2-1.6.2-3.3v-1.6c0-1.7-.2-3.3-.2-3.3zM9.9 14.2V8.6l5.2 2.8z',
};

function Social({ label, href }: { label: string; href: string }) {
  const path = ICONS[label];
  return (
    <a href={href} aria-label={label}>
      {path ? (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d={path} />
        </svg>
      ) : (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          aria-hidden="true"
        >
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
        </svg>
      )}
    </a>
  );
}

export function SiteFooter() {
  return (
    <footer className="ft">
      <div className="wrap">
        <div className="ft-top">
          <div className="ft-brand">
            <Logo ground="dark" size={44} />
            <div className="ft-tag">
              {FOOTER.tagline.map((word, i) => (
                <span key={word}>
                  {word}
                  {i < FOOTER.tagline.length - 1 ? <i aria-hidden="true">|</i> : null}
                </span>
              ))}
            </div>
            <p className="ft-blurb">{FOOTER.blurb}</p>
            <div className="socials">
              {FOOTER.socials.map((s) => (
                <Social key={s.label} {...s} />
              ))}
            </div>
          </div>

          {FOOTER.columns.map((col) => (
            <div key={col.title}>
              <h2 className="ft-h">{col.title}</h2>
              <ul>
                {col.links.map((link, i) => (
                  <li key={`${link.label}-${i}`}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h2 className="ft-h">Get in Touch</h2>
            <ul>
              <li>
                <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>
              </li>
              <li>
                <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
              </li>
              <li>
                <address>{CONTACT.address}</address>
              </li>
            </ul>
          </div>
        </div>

        <div className="ft-bot">
          <small>
            &copy; {new Date().getFullYear()} {SITE.legalName}. All rights reserved.
          </small>
          <nav className="ft-legal" aria-label="Legal">
            {FOOTER.legal.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
