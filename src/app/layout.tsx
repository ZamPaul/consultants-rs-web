import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { SITE, SITE_URL } from '@/lib/site';
import './globals.css';

/**
 * One title and one description for the whole site, by request.
 *
 * No `template`: a template only earns its place once there are child routes
 * with their own titles, and there is one page here.
 *
 * The Open Graph image is `src/app/opengraph-image.jpg`. Next's file
 * convention picks it up automatically and emits `og:image` and
 * `twitter:image` with absolute URLs built from `metadataBase`, which is what
 * every scraper requires. Keeping it in `src/assets` would have meant
 * importing it and hand-building that absolute URL, and a relative one is the
 * single most common reason an unfurl shows no image at all.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Consultants RS LLC | Business Consulting & Growth Solutions',
  description:
    'Consultants RS LLC helps entrepreneurs and businesses launch, grow, and build market presence through strategic business setup, marketing, and advertising solutions.',
  applicationName: SITE.name,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: SITE.name,
    locale: 'en_US',
    title: 'Consultants RS LLC | Business Consulting & Growth Solutions',
    description:
      'Consultants RS LLC helps entrepreneurs and businesses launch, grow, and build market presence through strategic business setup, marketing, and advertising solutions.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Consultants RS LLC | Business Consulting & Growth Solutions',
    description:
      'Consultants RS LLC helps entrepreneurs and businesses launch, grow, and build market presence through strategic business setup, marketing, and advertising solutions.',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#0B0B0C',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      // The inline script below adds a `js` class to <html> before React
      // hydrates, so the client className legitimately differs from the
      // server's and React logs a hydration mismatch. This is exactly what
      // suppressHydrationWarning is for; it applies to this element's own
      // attributes only, not to anything inside it.
      suppressHydrationWarning
    >
      <body>
        {/*
          Runs before anything below it paints. Collapse rules for the FAQ and
          the testimonial track are scoped to `.js`, so without this the page
          renders every answer and every quote as plain readable prose rather
          than hiding content behind controls that cannot run. This also gives
          the Phase 3 motion layer a hook for its start states, which is the
          fix we had to retrofit in v1.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
        {children}
      </body>
    </html>
  );
}
