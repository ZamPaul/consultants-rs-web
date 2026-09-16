import { Arrow } from '@/components/Icons';
import { FOUNDERS } from '@/lib/content';

export function Founders() {
  return (
    <section className="sec" id="founders">
      <div className="wrap">
        <div className="fnd-grid">
          {/*
            Monogram panel. The client has confirmed there will be no founder
            photography, so this is the finished treatment rather than a
            placeholder, and the "to be supplied" strip has been removed.
          */}
          <div className="fnd-panel" data-fade>
            {FOUNDERS.people.map((person) => (
              <div className="fnd-cell" key={person.initials}>
                <span className="fnd-mk" aria-hidden="true">
                  {person.initials}
                </span>
                <b>{person.name}</b>
                <span>{person.role}</span>
              </div>
            ))}
          </div>

          <div data-fade>
            <span className="eyebrow">{FOUNDERS.eyebrow}</span>
            <h2 className="h2" data-split>
              {FOUNDERS.headline[0]}
              <br />
              {FOUNDERS.headline[1]}
            </h2>
            {FOUNDERS.body.map((para, i) => (
              <p className="lede" key={i} style={{ marginTop: i === 0 ? 22 : 16 }}>
                {para}
              </p>
            ))}
            <p style={{ marginTop: 30 }}>
              <a className="alink" href="#contact">
                Work With Us <Arrow />
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
