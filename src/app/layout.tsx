import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://consultantsrs.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      'Consultants RS | Business Launch, Marketing and Advertising in Fairfield, CT',
    template: '%s | Consultants RS',
  },
  description:
    'Consultants RS helps entrepreneurs and businesses turn ideas into successful ventures, build market presence, and create long term growth.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'Consultants RS',
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
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
