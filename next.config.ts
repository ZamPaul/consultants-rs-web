import type { NextConfig } from 'next';

/**
 * Legacy redirects deliberately live in `src/proxy.ts`, not here.
 * Config redirects run *after* Next normalises trailing slashes, which turned
 * the old trailing-slash URLs into a two hop chain. Measured, then moved.
 * See the comment in that file before changing this.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Hands trailing-slash canonicalisation to src/proxy.ts, so a legacy URL
  // with a trailing slash resolves in one hop instead of chaining. See there.
  skipTrailingSlashRedirect: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
