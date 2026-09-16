/**
 * Canonical origin for metadata, OG tags and the sitemap.
 *
 * This used to be `process.env.NEXT_PUBLIC_SITE_URL ?? fallback`, which broke
 * the first Vercel build: `??` only falls back on null and undefined, and
 * Vercel hands an unset-but-declared variable through as an empty string. That
 * produced `new URL('')`, ERR_INVALID_URL, and a failed build on /_not-found.
 *
 * Three rules learned from that:
 *   1. `||`, not `??`, for anything that can arrive as an empty string.
 *   2. Fall back to the deployment URL, so previews get correct metadata
 *      instead of claiming to be production.
 *   3. Metadata must never be able to fail a build. If the value is somehow
 *      still unparseable, use the fallback rather than throwing.
 */
const FALLBACK = 'https://consultantsrs.com';

function normalise(value: string | undefined): string | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    return new URL(withScheme).origin;
  } catch {
    return null;
  }
}

/**
 * IMPORTANT: this value is where every absolute URL on the page points, and
 * that includes the Open Graph image.
 *
 * It bit us once already. `NEXT_PUBLIC_SITE_URL` was set to the real domain
 * while the site was still only deployed to its vercel.app URL, so the tag
 * read `https://www.consultantsrs.com/opengraph-image.jpg` and the scraper
 * fetched a 404 from the old WordPress site. Title and description showed;
 * the image did not.
 *
 * So: leave `NEXT_PUBLIC_SITE_URL` unset until DNS actually points the domain
 * at this deployment, and the chain below resolves to the URL the site is
 * genuinely reachable at. Set it on cutover day, not before.
 *
 * Preview deployments ignore it outright and reference themselves, because a
 * preview claiming to be production is wrong in every case.
 */
const isPreview = process.env.VERCEL_ENV === 'preview';

export const SITE_URL: string =
  (isPreview ? null : normalise(process.env.NEXT_PUBLIC_SITE_URL)) ||
  normalise(process.env.VERCEL_URL) ||
  normalise(process.env.VERCEL_PROJECT_PRODUCTION_URL) ||
  FALLBACK;

export const SITE = {
  /** The business name, used in prose, metadata and structured data. */
  name: 'Consultants RS LLC',
  legalName: 'Consultants RS LLC',
  /**
   * The header and footer lockup. Deliberately without "LLC": that was an
   * explicit instruction earlier in the project and the later "use the full
   * name everywhere" note was about body copy, so the two are kept separate
   * rather than one silently overriding the other. Flip this to SITE.name if
   * the mark should carry it too.
   */
  lockup: 'Consultants RS',
  phone: '(914) 906-6800',
  phoneHref: 'tel:+19149066800',
  email: 'info@consultantsrs.com',
  street: '268 Post Road, Suite 200',
  locality: 'Fairfield',
  region: 'CT',
  postalCode: '06824',
  country: 'US',
} as const;
