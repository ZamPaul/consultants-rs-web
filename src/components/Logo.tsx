import Image from 'next/image';
import { SITE } from '@/lib/site';
import reversed from '@/assets/lion-reversed.webp';
import original from '@/assets/lion-original.webp';

/**
 * Two approved lockups of one mark.
 *
 * The client asked for the logo in its original colours. Taken literally that
 * does not work: the lion's structural line work measures #171C20 against a
 * #0B0B0C header, which is 1.15:1 contrast where a graphic needs 3:1. It would
 * not read as dark and premium, it would be invisible.
 *
 * So, standard brand practice: `ground="dark"` renders the reversed lockup,
 * where the near-black becomes cream and the gold stays exactly the gold it
 * already is. `ground="light"` renders the original. Both are generated from
 * the same source by `scripts/build-logo.py`.
 *
 * Both are generated into src/assets, not public/. Statically imported images
 * get fingerprinted and immutably cached by Next; a copy in public/ as well
 * would ship the same bytes twice, the second time under a name that cannot be
 * cache-busted.
 */
type Props = {
  ground?: 'dark' | 'light';
  /** Rendered height of the mark in px. */
  size?: number;
  /** Set false in the footer, where the wordmark would repeat the address block. */
  wordmark?: boolean;
  className?: string;
  priority?: boolean;
};

export function Logo({
  ground = 'dark',
  size = 38,
  wordmark = true,
  className,
  priority = false,
}: Props) {
  const src = ground === 'dark' ? reversed : original;
  return (
    <span className={className ? `brand ${className}` : 'brand'}>
      <Image
        src={src}
        alt={wordmark ? '' : SITE.lockup}
        height={size}
        width={Math.round((src.width / src.height) * size)}
        priority={priority}
        sizes={`${size * 2}px`}
        aria-hidden={wordmark || undefined}
      />
      {wordmark ? <b>{SITE.lockup}</b> : null}
    </span>
  );
}
