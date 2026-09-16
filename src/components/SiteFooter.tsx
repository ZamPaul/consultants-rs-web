import { Logo } from '@/components/Logo';
import { CONTACT, FOOTER } from '@/lib/content';
import { SITE } from '@/lib/site';

export function SiteFooter() {
  return (
    <footer className="ft">
      <div className="wrap">
        <div className="ft-top">
          <div className="ft-brand">
            <Logo ground="light" size={56} />
            <div className="ft-tag">
              {FOOTER.tagline.map((word, i) => (
                <span key={word}>
                  {word}
                  {i < FOOTER.tagline.length - 1 ? <i aria-hidden="true">|</i> : null}
                </span>
              ))}
            </div>
            <p className="ft-blurb">{FOOTER.blurb}</p>
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
          {FOOTER.legal.length > 0 ? (
            <nav className="ft-legal" aria-label="Legal">
              {FOOTER.legal.map((link) => (
                <a key={link.href} href={link.href}>
                  {link.label}
                </a>
              ))}
            </nav>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
