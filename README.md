# consultants-rs-web

Single page marketing site for Consultants RS, Fairfield CT.
Next.js 16 App Router, Tailwind v4, Supabase, Resend, deployed on Vercel.

The build plan lives in `docs/build-plan.html`. Read it before changing
anything in `next.config.ts` or the schema.

## Running it

```
pnpm install
cp .env.example .env.local   # fill in
pnpm dev
```

## The three rules that matter

1. **Nothing in the browser talks to Postgres.** There is one Supabase client,
   in `src/lib/supabase/server.ts`, it holds the service role key, and it is
   guarded by `server-only`. There is no anon key and no RLS. If you ever find
   yourself adding `NEXT_PUBLIC_SUPABASE_ANON_KEY`, stop.

2. **The database write and the emails are not wired in series.** On a free
   tier Supabase project the database can be asleep. If the insert fails the
   emails still send, the payload goes to `email_outbox`, and Sentry raises. A
   lead reaching a human matters more than a lead reaching a table.

3. **The legacy redirects in `next.config.ts` are load bearing.** The old site
   had `/about-us/`, `/our-services/` and `/contact-us/` indexed. Deleting
   those redirects 404s every inbound link the business has.

## Layout

```
src/app/globals.css   design tokens, ported from prototype v5
src/app/layout.tsx    fonts, metadata
src/lib/env.ts        env validated at boot, server only
src/lib/schema.ts     the one Zod schema, shared by form and server action
src/lib/ref.ts        CRS-YYMM-XXXX enquiry references
supabase/migrations/  applied with the Supabase CLI, never by hand
```

## Notes

- Fonts come from the official `geist` package, which wraps `next/font/local`.
  Self hosted, no build time network call, no runtime request to Google.
- `src/assets/Logo.svg` is not a vector. It is a wrapper around two embedded
  1594x1604 PNGs with no drawn geometry. `scripts/build-logo.py` recovers the
  artwork and renders the two lockups; run it if the source art is replaced.
- Image imports resolve through `src/types/assets.d.ts`, which is committed on
  purpose. Next puts those declarations in the gitignored `next-env.d.ts`, so
  without this file `pnpm run typecheck` fails on a clean checkout.
- GSAP is free for commercial use including SplitText as of 3.13. It is
  dynamically imported after first paint and must stay out of the first load
  bundle.
- `pnpm run format:check` runs in CI. Run `pnpm run format` before pushing.
