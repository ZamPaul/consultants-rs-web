import { STATEMENT } from '@/lib/content';

const GOLD = new Set<number>(STATEMENT.goldWords);

export function Statement() {
  const words = STATEMENT.text.split(' ');
  return (
    <section className="sec state" id="statement">
      <div className="wrap">
        <p id="stateText">
          {words.map((word, i) => (
            <span key={i} className={GOLD.has(i) ? 'sw gold' : 'sw'}>
              {word}{' '}
            </span>
          ))}
        </p>
        <div className="state-foot" data-stagger>
          {STATEMENT.points.map((point) => (
            <div key={point.title}>
              <b>{point.title}</b>
              <p>{point.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
