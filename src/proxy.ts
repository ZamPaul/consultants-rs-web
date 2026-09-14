import { NextResponse, type NextRequest } from 'next/server';

/**
 * Legacy URL redirects and trailing-slash canonicalisation.
 * (Next 16 renamed `middleware` to `proxy`.)
 *
 * Why this is here rather than in `next.config.ts`, measured against a real
 * `next start` rather than assumed:
 *
 *   Config redirects run *after* Next's own trailing-slash normalisation, so
 *   `/our-services/` resolved as 308 -> `/our-services`, then 308 -> `/#services`.
 *   A two hop chain. The old four page site linked every page *with* a
 *   trailing slash, so that chain was the path essentially every real inbound
 *   link would have taken.
 *
 *   Proxy runs earlier, but Next still normalised the slash first. The fix is
 *   `skipTrailingSlashRedirect` in next.config.ts, which hands that job to us.
 *   We then do both: one 301 for a legacy URL in either form, and a plain
 *   308 normalisation for everything else, so nothing is lost by taking it on.
 *
 * 301 rather than Next's default 308 for the legacy URLs: for GET-only
 * marketing URLs it is the signal every crawler and link checker understands
 * without argument.
 */
const LEGACY: Record<string, string> = {
  '/about-us': '/#about',
  '/our-services': '/#services',
  '/contact-us': '/#contact',
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const bare = pathname.replace(/\/+$/, '');

  const target = LEGACY[bare.toLowerCase()];
  if (target) {
    return NextResponse.redirect(new URL(target, request.url), 301);
  }

  // We own trailing-slash canonicalisation now, so keep doing it.
  // Built from the origin rather than by mutating a cloned nextUrl: with
  // skipTrailingSlashRedirect on, mutating the clone left the slash in place
  // and produced a redirect to itself. That is an infinite loop on any 404
  // path ending in a slash, and it was caught by testing `/nope/`.
  if (bare !== '' && bare !== pathname) {
    return NextResponse.redirect(
      new URL(`${bare}${request.nextUrl.search}`, request.nextUrl.origin),
      308,
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Everything except Next internals, the metadata routes, and anything
    // with a file extension. A one page site, so this is a cheap check.
    '/((?!_next/|favicon\\.ico|robots\\.txt|sitemap\\.xml|.*\\.[\\w]+$).*)',
  ],
};
