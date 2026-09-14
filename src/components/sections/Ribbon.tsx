import { RIBBON } from '@/lib/content';

/**
 * Three copies of the word list so the track can translate by exactly one
 * copy and loop seamlessly. Phase 3 links its speed to scroll velocity; until
 * then it runs on a plain CSS animation, which reduced-motion already stops.
 */
export function Ribbon() {
  return (
    <div className="ribbon" aria-hidden="true">
      <div className="ribbon-t" id="ribbon">
        {[0, 1, 2].flatMap((copy) =>
          RIBBON.map((word) => <span key={`${copy}-${word}`}>{word}</span>),
        )}
      </div>
    </div>
  );
}
