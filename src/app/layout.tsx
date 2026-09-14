import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { SITE, SITE_URL } from '@/lib/site';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      'Consultants RS | Business Launch, Marketing and Advertising in Fairfield, CT',
    template: `%s | ${SITE.name}`,
  },
  description:
    'Consultants RS helps entrepreneurs and businesses turn ideas into successful ventures, build market presence, and create long term growth.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: SITE.name,
    title: 'Your Vision. Our Expertise.',
    description:
      'Business launch and setup, marketing and promotion, advertising campaigns. Fairfield, Connecticut.',
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
