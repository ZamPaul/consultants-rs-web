import { PROCESS } from '@/lib/content';

const ICONS = [
  <>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="M15.4 15.4L21 21" />
  </>,
  <>
    <path d="M6 3h8l4 4v14H6z" />
    <path d="M14 3v4h4M9 12h6M9 16h6" />
  </>,
  <>
    <circle cx="12" cy="12" r="3.2" />
    <path d="M12 3v2.4M12 18.6V21M21 12h-2.4M5.4 12H3M18.4 5.6l-1.7 1.7M7.3 16.7l-1.7 1.7M18.4 18.4l-1.7-1.7M7.3 7.3L5.6 5.6" />
  </>,
  <>
    <path d="M3 20h18" />
    <path d="M6 20v-6M11 20V9M16 20v-8M21 20V5" />
  </>,
];

export function Process() {
  return (
    <section className="sec light" id="process">
      <div className="wrap">
        <div className="center" data-fade>
          <span className="eyebrow">{PROCESS.eyebrow}</span>
          <h2 className="h2" data-split>
            {PROCESS.headline}
          </h2>
          <p className="lede" style={{ marginTop: 20 }}>
            {PROCESS.lede}
          </p>
        </div>
        <ol className="steps" id="steps">
          {/* The rail is decorative; Phase 3 scrubs #stepsFill along it. */}
          <div className="steps-line" aria-hidden="true">
            <i id="stepsFill" />
          </div>
          {PROCESS.steps.map((step, i) => (
            <li className="step" key={step.n}>
              <span className="step-ico" aria-hidden="true">
                <svg
                  width="21"
                  height="21"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.3"
                >
                  {ICONS[i]}
                </svg>
              </span>
              <em>{step.n}</em>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
