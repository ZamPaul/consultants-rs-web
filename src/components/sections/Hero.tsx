import { getImageProps } from 'next/image';
import heroDesktop from '@/assets/hero-desktop.webp';
import heroMobile from '@/assets/hero-mobile.webp';
import { Arrow } from '@/components/Icons';
import { HERO } from '@/lib/content';
import { SITE } from '@/lib/site';

const MOBILE_UP = '(min-width: 760px)';

export function Hero() {
  /**
   * Real art direction: a landscape frame on desktop, a portrait crop on a
   * phone, and only one of them downloaded.
   *
   * `next/image` alone cannot do this, and the usual workaround of rendering
   * both and hiding one with `display: none` still costs the visitor both
   * files. `getImageProps` gives us the optimised srcsets to hang off a real
   * <picture>, so the browser picks one source and fetches nothing else.
   */
  const common = { alt: HERO.imageAlt, sizes: '100vw', priority: true, quality: 82 };
  const { props: desktop } = getImageProps({
    ...common,
    src: heroDesktop,
    width: 1672,
    height: 941,
  });
  const { props: mobile } = getImageProps({
    ...common,
    src: heroMobile,
    width: 941,
    height: 1672,
  });

  return (
    <section className="hero" id="hero">
      {/*
        No data-par here. The hero has its own dedicated scrub in the motion
        layer, and when this element also carried data-par the two tweens
        fought over yPercent and the image visibly squashed on scroll. One
        element, one tween: the same rule that fixed the service cards in v4.
      */}
      <div className="hero-bg">
        <picture>
          <source media={MOBILE_UP} srcSet={desktop.srcSet} />
          <source srcSet={mobile.srcSet} />
          <img {...mobile} alt={HERO.imageAlt} decoding="async" />
        </picture>
      </div>

      <div className="hero-side" aria-hidden="true">
        {HERO.rail.map((word) => (
          <span key={word}>{word}</span>
        ))}
        <b>{SITE.name}</b>
      </div>

      <div className="wrap hero-main">
        <span className="eyebrow" data-fade>
          {HERO.eyebrow}
        </span>
        <h1 className="h1" data-split>
          {HERO.headline[0]}
          <br />
          {HERO.headline[1]}
        </h1>
        <p className="lede hero-lede" data-fade>
          {HERO.lede}
        </p>
        <div className="hero-cta" data-fade>
          <a className="btn btn--gold" href="#contact">
            <span>
              Start a Conversation <Arrow />
            </span>
          </a>
          <a className="btn btn--out" href="#services">
            <span>Our Services</span>
          </a>
        </div>
      </div>

      <div className="hero-scroll" aria-hidden="true">
        <i />
        <span>Scroll</span>
      </div>
    </section>
  );
}
