'use client';

import { useEffect } from 'react';

/**
 * The motion layer.
 *
 * Three rules govern this file, all of them learned the hard way in the
 * prototypes:
 *
 * 1. **It loads after paint, never before.** GSAP plus ScrollTrigger plus
 *    SplitText is around 126 KB. In the prototype it was inlined and sat in
 *    the critical path. Here it is a dynamic import fired from an idle
 *    callback, so it is out of the first load bundle entirely and cannot delay
 *    LCP.
 *
 * 2. **Start states are set here, not in CSS.** Nothing on the page is parked
 *    at `opacity: 0` in a stylesheet. If this file never runs, the page is
 *    fully readable. Prototype v1 shipped `.rv { opacity: 0 }` in CSS and a
 *    script failure blanked the whole page.
 *
 * 3. **One element, one tween.** A `[data-fade]` that is also a child of
 *    `[data-stagger]` gets two competing tweens fighting over opacity, which
 *    is what left two service cards invisible in v4. The guard below drops
 *    any `[data-fade]` whose ancestor is staggering.
 */
export function Motion() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduced.matches) return;

    let disposed = false;
    const cleanups: Array<() => void> = [];

    async function start() {
      const [{ gsap }, { ScrollTrigger }, { SplitText }, { default: Lenis }] =
        await Promise.all([
          import('gsap'),
          import('gsap/ScrollTrigger'),
          import('gsap/SplitText'),
          import('lenis'),
        ]);
      if (disposed) return;

      gsap.registerPlugin(ScrollTrigger, SplitText);
      const $$ = <T extends Element>(sel: string) =>
        Array.from(document.querySelectorAll<T>(sel));

      /**
       * Anything already on screen when this layer arrives is left alone.
       *
       * Because the import is deferred to an idle callback, roughly 1.7s have
       * passed and the reader has already seen the top of the page. Applying a
       * reveal to it now would blink content they are mid sentence on back to
       * zero and animate it in a second time. Reveals are for content that has
       * not been seen yet, so the fold at init time is the cut line.
       */
      const fold = window.innerHeight;
      const unseen = (el: Element) => el.getBoundingClientRect().top > fold * 0.92;

      /* ---- smooth scroll -------------------------------------------------
         Off on touch, where the native scroll is already good and hijacking
         it costs more than it gives. */
      const coarse = window.matchMedia('(pointer: coarse)').matches;
      if (!coarse) {
        const lenis = new Lenis({ duration: 1.05, smoothWheel: true });
        const tick = (time: number) => lenis.raf(time * 1000);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);
        lenis.on('scroll', ScrollTrigger.update);
        cleanups.push(() => {
          gsap.ticker.remove(tick);
          lenis.destroy();
        });
      }

      /* ---- reading progress ---------------------------------------------- */
      const prog = document.querySelector('#prog');
      if (prog) {
        gsap.to(prog, {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
        });
      }

      /* ---- masked line reveal --------------------------------------------- */
      for (const el of $$<HTMLElement>('[data-split]').filter(unseen)) {
        const split = new SplitText(el, {
          type: 'lines',
          linesClass: 'ln',
          mask: 'lines',
        });
        gsap.from(split.lines, {
          yPercent: 108,
          duration: 1.05,
          ease: 'power3.out',
          stagger: 0.09,
          scrollTrigger: { trigger: el, start: 'top 86%' },
        });
        cleanups.push(() => split.revert());
      }

      /* ---- simple reveals -------------------------------------------------
         The guard is the v4 fix: two tweens on one element fight over opacity
         and the loser wins. */
      const fades = $$<HTMLElement>('[data-fade]')
        .filter((el) => !el.parentElement?.closest('[data-stagger]'))
        .filter(unseen);
      for (const el of fades) {
        gsap.from(el, {
          opacity: 0,
          y: 26,
          duration: 0.9,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 88%' },
        });
      }

      for (const group of $$<HTMLElement>('[data-stagger]').filter(unseen)) {
        const kids = Array.from(group.children);
        if (!kids.length) continue;
        gsap.from(kids, {
          opacity: 0,
          y: 30,
          duration: 0.85,
          ease: 'power2.out',
          stagger: 0.085,
          scrollTrigger: { trigger: group, start: 'top 88%' },
        });
      }

      /* ---- hero ------------------------------------------------------------ */
      const heroImg = document.querySelector('.hero-bg img');
      if (heroImg) {
        gsap.to(heroImg, {
          yPercent: 9,
          scale: 1.12,
          ease: 'none',
          scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }
      const heroMain = document.querySelector('.hero-main');
      if (heroMain) {
        gsap.to(heroMain, {
          y: -70,
          opacity: 0.1,
          ease: 'none',
          scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom 40%',
            scrub: true,
          },
        });
      }

      /* ---- parallax -------------------------------------------------------- */
      // The hero runs its own scrub below. When the hero image also carried
      // data-par, two tweens fought over yPercent and the photograph visibly
      // squashed on scroll. One element, one tween.
      for (const el of $$<HTMLElement>('[data-par]').filter(
        (el) => !el.closest('.hero'),
      )) {
        const amount = parseFloat(el.dataset.par ?? '0');
        gsap.fromTo(
          el,
          { yPercent: -amount * 50 },
          {
            yPercent: amount * 50,
            ease: 'none',
            scrollTrigger: {
              trigger: el.parentElement ?? el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        );
      }
      for (const el of $$<HTMLElement>('[data-par-box]')) {
        const amount = parseFloat(el.dataset.parBox ?? '0');
        gsap.fromTo(
          el,
          { yPercent: -amount * 50 },
          {
            yPercent: amount * 50,
            ease: 'none',
            scrollTrigger: {
              trigger: el.parentElement ?? el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        );
      }

      /* ---- process rail ----------------------------------------------------
         The fill and the step icons advance together, so the rail is reporting
         where you are rather than decorating the section. */
      const fill = document.querySelector('#stepsFill');
      const steps = $$<HTMLElement>('.step');
      if (fill && steps.length) {
        gsap.fromTo(
          fill,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: '#steps',
              start: 'top 72%',
              end: 'bottom 72%',
              scrub: 0.5,
              onUpdate: (self) => {
                const reached = Math.round(self.progress * steps.length);
                steps.forEach((step, i) => step.classList.toggle('on', i < reached));
              },
            },
          },
        );
      }

      /* ---- statement ------------------------------------------------------- */
      const words = $$<HTMLElement>('#stateText .sw');
      if (words.length) {
        gsap.fromTo(
          words,
          { opacity: 0.16 },
          {
            opacity: 1,
            ease: 'none',
            stagger: 0.5,
            scrollTrigger: {
              trigger: '#stateText',
              start: 'top 78%',
              end: 'bottom 55%',
              scrub: 0.4,
            },
          },
        );
      }

      /* ---- ribbon ----------------------------------------------------------
         Nothing here on purpose. The marquee is a plain CSS animation.

         The previous version rewrote `animationDuration` on every scroll
         frame to nudge its speed. Rewriting that property restarts the
         animation, which is what made it stutter and lurch across the screen.
         A CSS loop runs off the main thread, cannot be desynchronised by
         scrolling, and keeps going if this file never loads. */

      /* ---- counters --------------------------------------------------------
         Text is already the final number, so this only ever runs downward from
         zero and then lands back on the value that was in the HTML. */
      for (const el of $$<HTMLElement>('[data-count]').filter(unseen)) {
        const target = Number(el.dataset.count ?? '0');
        const obj = { n: 0 };
        gsap.to(obj, {
          n: target,
          duration: 1.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          onStart: () => {
            el.textContent = '0';
          },
          onUpdate: () => {
            el.textContent = String(Math.round(obj.n));
          },
          onComplete: () => {
            el.textContent = String(target);
          },
        });
      }

      /* ---- micro interactions -----------------------------------------------
         Pointer-driven only, so they never fire on touch where there is no
         hover state to leave and the tween would stick. */
      if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        for (const btn of $$<HTMLElement>('.btn--gold')) {
          const move = (event: MouseEvent) => {
            const r = btn.getBoundingClientRect();
            gsap.to(btn, {
              x: (event.clientX - r.left - r.width / 2) * 0.24,
              y: (event.clientY - r.top - r.height / 2) * 0.34,
              duration: 0.5,
              ease: 'power3.out',
            });
          };
          // Elastic on the way back, so releasing the button has some snap
          // rather than sliding home limply.
          const leave = () =>
            gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)' });
          btn.addEventListener('mousemove', move);
          btn.addEventListener('mouseleave', leave);
          cleanups.push(() => {
            btn.removeEventListener('mousemove', move);
            btn.removeEventListener('mouseleave', leave);
            gsap.set(btn, { clearProps: 'transform' });
          });
        }

        for (const card of $$<HTMLElement>('.card')) {
          const move = (event: MouseEvent) => {
            const r = card.getBoundingClientRect();
            gsap.to(card, {
              rotateY: ((event.clientX - r.left) / r.width - 0.5) * 6,
              rotateX: (0.5 - (event.clientY - r.top) / r.height) * 6,
              y: -8,
              duration: 0.6,
              ease: 'power3.out',
              transformPerspective: 900,
            });
          };
          const leave = () =>
            gsap.to(card, {
              rotateY: 0,
              rotateX: 0,
              y: 0,
              duration: 0.8,
              ease: 'power3.out',
            });
          card.addEventListener('mousemove', move);
          card.addEventListener('mouseleave', leave);
          cleanups.push(() => {
            card.removeEventListener('mousemove', move);
            card.removeEventListener('mouseleave', leave);
            gsap.set(card, { clearProps: 'transform' });
          });
        }
      }

      /* ---- active nav link -------------------------------------------------- */
      const links = $$<HTMLAnchorElement>('.nav a[href^="#"]');
      for (const link of links) {
        const id = link.getAttribute('href')!.slice(1);
        const section = document.getElementById(id);
        if (!section) continue;
        const setOn = () => {
          links.forEach((l) => l.classList.toggle('on', l === link));
        };
        const st = ScrollTrigger.create({
          trigger: section,
          start: 'top 45%',
          end: 'bottom 45%',
          onEnter: setOn,
          onEnterBack: setOn,
        });
        cleanups.push(() => st.kill());
      }

      ScrollTrigger.refresh();
      const onResize = () => ScrollTrigger.refresh();
      window.addEventListener('resize', onResize);
      cleanups.push(() => {
        window.removeEventListener('resize', onResize);
        ScrollTrigger.getAll().forEach((t) => t.kill());
        gsap.globalTimeline.clear();
      });
    }

    // Fonts first: SplitText measures line boxes, and measuring against a
    // fallback face then reflowing to Geist puts every mask in the wrong place.
    const kick = () => {
      document.fonts.ready.then(() => {
        if (!disposed) void start();
      });
    };
    // requestIdleCallback is absent on older Safari. TypeScript's DOM lib
    // declares it unconditionally, so the runtime check has to read the
    // property off window rather than test the function itself.
    const hasIdle = 'requestIdleCallback' in window;
    const handle = hasIdle
      ? window.requestIdleCallback(kick, { timeout: 1200 })
      : window.setTimeout(kick, 200);

    return () => {
      disposed = true;
      if (hasIdle) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return null;
}
