import { SITE } from '@/lib/site';

/**
 * All page copy lives here, typed, in one file. Not a CMS, because two people
 * and a brochure site do not need one, and not scattered through JSX, because
 * then a wording change becomes a hunt.
 *
 * Two client rules govern this file:
 *   1. American English, and no em or en dashes anywhere. Hyphens in compound
 *      adjectives are punctuation, not dashes, and are correct: "long-term",
 *      "hands-on", "real-world", "full-service", "Multi-Channel".
 *   2. Section headings carry no trailing full stop. A period that separates
 *      two lines of a heading stays, because it is doing work.
 */
export const NAV = [
  { href: '#top', label: 'Home' },
  { href: '#services', label: 'Services' },
  { href: '#about', label: 'About' },
  { href: '#why', label: 'Why Us' },
  { href: '#contact', label: 'Contact' },
] as const;

/** The menu carries one more entry than the desktop bar, as it did in v5. */
export const MENU = [
  { href: '#top', label: 'Home' },
  { href: '#services', label: 'Services' },
  { href: '#about', label: 'About' },
  { href: '#why', label: 'Why Us' },
  { href: '#industries', label: 'Industries' },
  { href: '#contact', label: 'Contact' },
] as const;

export const FOOTER = {
  tagline: ['Strategy', 'Support', 'Business', 'Success'],
  blurb:
    'Helping entrepreneurs and established businesses launch, position, and grow with practical strategy and hands-on support.',
  columns: [
    {
      title: 'Explore',
      links: [
        { href: '#top', label: 'Home' },
        { href: '#services', label: 'Services' },
        { href: '#about', label: 'About' },
        { href: '#why', label: 'Why Us' },
        { href: '#industries', label: 'Industries' },
        { href: '#contact', label: 'Contact' },
      ],
    },
    {
      title: 'Services',
      links: [
        { href: '#services', label: 'Business Launch & Setup' },
        { href: '#services', label: 'Marketing & Promotion' },
        { href: '#services', label: 'Advertising Campaigns' },
      ],
    },
  ],
  legal: [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
  ],
} as const;

export const CONTACT = {
  phone: SITE.phone,
  phoneHref: SITE.phoneHref,
  email: SITE.email,
  address: `${SITE.street}, ${SITE.locality}, ${SITE.region} ${SITE.postalCode}`,
} as const;

export const HERO = {
  eyebrow: 'Ideas. Strategy. Real Growth.',
  headline: ['Your Vision.', 'Our Expertise'],
  lede: 'Consultants RS LLC helps entrepreneurs and businesses turn ideas into successful ventures, build market presence, and achieve long-term growth.',
  imageAlt: 'A corner office at sunset looking out over a city skyline',
  rail: ['Strategy', 'People', 'Opportunity', 'Growth'],
} as const;

/**
 * The hero's three counters, in their own band beneath it.
 *
 * Standing warning, carried from every prototype doc: not one of these has
 * been verified. The client has approved shipping them for now and changing
 * them later. "100% Client Satisfaction" in the Impact section further down is
 * an absolute performance claim about a real business and is the one to remove
 * first if anything is ever challenged.
 */
export const FIGURES = [
  { value: 50, suffix: '+', label: 'Businesses Supported' },
  { value: 100, suffix: '%', label: 'Client-Focused' },
  { text: 'Global', label: 'Perspective' },
] as const;

export const ABOUT = {
  eyebrow: 'About Consultants RS LLC',
  headline: ['More Than Consultants.', 'Your Growth Partner'],
  body: [
    'We work alongside ambitious entrepreneurs and businesses at every stage, from launch to long-term growth, offering practical solutions, strategic guidance, and a hands-on approach that helps you overcome challenges and unlock real opportunities.',
    'Founded by Raza Hussain and Shane Mills, Consultants RS LLC was built for owners who would rather be told the truth than be told what they want to hear.',
  ],
  pills: ['Launch', 'Position', 'Promote', 'Grow'],
  imageAlt: 'Curved modern architecture',
  quote: 'Businesses thrive when the right people stand behind them.',
  cite: SITE.name,
} as const;

export const SERVICES = {
  eyebrow: 'Our Core Services',
  headline: ['Three Solutions.', 'One Clear Direction'],
  lede: 'Everything you need to launch, position, and grow under one roof.',
  items: [
    {
      n: '01',
      title: ['Business Launch', '& Setup'],
      body: 'Turn your idea into a fully operational business with the right foundation beneath it.',
      imageAlt: 'Signing business formation documents at a desk overlooking the city',
    },
    {
      n: '02',
      title: ['Marketing', '& Promotion'],
      body: 'Build your brand, reach the right audience, and create real momentum behind it.',
      imageAlt: 'Reviewing performance charts on a laptop in a high floor office',
    },
    {
      n: '03',
      title: ['Advertising', 'Campaigns'],
      body: 'Put your message in front of the people most likely to act on it, and measure what comes back.',
      imageAlt: 'A large illuminated advertising screen on a city street at dusk',
    },
  ],
} as const;

export const RIBBON = [
  'Business Launch',
  'Marketing',
  'Advertising',
  'Licensing',
  'Brand Strategy',
  'Lead Generation',
] as const;

export const STATEMENT = {
  /** Word indices rendered in gold. Phase 3 scrubs the line on scroll. */
  goldWords: [2, 6, 10],
  text: 'We start businesses. We make them known. We turn attention into opportunity. Three services, run end to end, by the two people you actually meet.',
  points: [
    {
      title: 'No handoffs',
      body: 'Registration, branding, and paid media under one roof. Nothing gets lost between three vendors who have never spoken to each other.',
    },
    {
      title: 'No account managers',
      body: 'You work with Raza and Shane. The people who answer the phone are the people doing the work.',
    },
    {
      title: 'No business hours',
      body: 'Filing deadlines, launch dates and live campaigns do not wait for Monday morning. Neither do we.',
    },
  ],
} as const;

export const IMPACT = {
  eyebrow: 'Real People, Real Results',
  headline: ['Real Businesses.', 'Real Impact'],
  imageAlt: '',
  figures: [
    { value: 50, suffix: '+', label: 'Projects Completed' },
    { value: 100, suffix: '%', label: 'Client Satisfaction' },
    { value: 7, suffix: '+', label: 'Industries Supported' },
  ],
} as const;

export const PROCESS = {
  eyebrow: 'Our Process',
  headline: 'From Vision to Results',
  lede: 'A clear, strategic process designed to turn your goals into measurable success.',
  steps: [
    {
      n: '01',
      title: 'Discover',
      body: 'Understand your business, goals, and challenges.',
    },
    {
      n: '02',
      title: 'Plan',
      body: 'Create a tailored strategy and a roadmap you can follow.',
    },
    {
      n: '03',
      title: 'Execute',
      body: 'Execute with precision and expertise, working alongside you.',
    },
    {
      n: '04',
      title: 'Grow',
      body: 'Optimize, scale, and create new opportunities for your business.',
    },
  ],
} as const;

export const WHY = {
  eyebrow: 'Why Consultants RS LLC',
  headline: ['The Difference', 'Is in Our Approach'],
  lede: 'We do not just offer services. We build lasting partnerships through strategy, experience, and commitment.',
  items: [
    {
      title: 'Strategic Thinking',
      body: 'We look beyond individual tasks and focus on the bigger picture.',
    },
    {
      title: 'Hands-On Partnership',
      body: 'We work alongside you, not from the sidelines.',
    },
    {
      title: 'Tailored Solutions',
      body: 'Every business is unique. So are our strategies.',
    },
    {
      title: 'Built for Growth',
      body: 'Our approach creates a foundation that evolves with your business.',
    },
  ],
  quote: 'Different industries. A stronger tomorrow.',
} as const;

export const INDUSTRIES = {
  eyebrow: 'Industries We Support',
  headline: 'Built for Ambitious Businesses',
  lede: 'We work with a diverse range of industries, bringing tailored solutions and real-world experience to every project.',
  tiles: [
    'Startups',
    'Local Businesses',
    'Service Providers',
    'Retail',
    'Automotive',
    'Property & Construction',
    'Emerging Brands',
    'And More',
  ],
} as const;

export const CLIENTS = {
  eyebrow: 'Client Testimonials',
  headline: 'What Our Clients Say',
} as const;

/**
 * Permission confirmed by the client for all three, to be revisited later.
 *
 * Two of these say "Consultants RS" rather than "Consultants RS LLC". That is
 * deliberate: they are attributed quotations from named people, and rewriting
 * someone's words to insert a legal suffix they did not say is not a copy
 * change, it is a fabrication. Left verbatim.
 */
export const TESTIMONIALS = [
  {
    quote:
      'Consultants RS provided invaluable guidance for our business launch and registration process.',
    name: 'Waqar T.',
    role: 'Owner, Empires 1 Ride',
  },
  {
    quote:
      'Their multi-channel marketing strategies elevated our brand positioning and visibility.',
    name: 'Katie Mac',
    role: 'Learning with Miss Mac',
  },
  {
    quote:
      'We received expert support from Consultants RS for our product development and market entry strategy.',
    name: 'Gaieb',
    role: 'GRS Roadrunners',
  },
] as const;

export const FOUNDERS = {
  eyebrow: 'About Us',
  headline: ['Built on Experience.', 'Driven by Your Ambition'],
  body: [
    'Consultants RS LLC was founded by Raza Hussain and Shane Mills with a simple goal: to help businesses succeed. What started as a few projects and local support has grown into a full-service consulting firm, offering strategic guidance to businesses at every stage of growth.',
    "Every engagement is led by the two of them and supported by a vetted network of specialists. That's why they would rather do three things properly than list nine and hope.",
  ],
  people: [
    { initials: 'RH', name: 'Raza Hussain', role: 'Co-Founder' },
    { initials: 'SM', name: 'Shane Mills', role: 'Co-Founder' },
  ],
} as const;

export const FAQ = {
  eyebrow: 'Questions',
  headline: ['Answered Before', 'You Ask'],
  lede: 'The things people ask us most, answered the way we would answer them on a call.',
  items: [
    {
      q: 'What actually happens on the first call?',
      a: 'You talk, we listen, and we tell you honestly whether we are the right fit. If the job sits outside what we do well, we will say so and usually point you toward someone who does it better. That conversation does not cost you anything.',
    },
    {
      q: 'What is the difference between marketing and advertising here?',
      a: 'Marketing decides what you say and who you say it to. Advertising pays to put that message in front of people and measures what comes back. Most businesses need the first sorted out before the second is worth spending money on, which is why we treat them as two services rather than one blurred package.',
    },
    {
      q: 'How long does it take to get a new business registered?',
      a: 'It depends on the entity type, the state, and how clean your paperwork is when it reaches us. Licensing and permits usually set the real timeline, not the formation itself. We give you the realistic date at the planning stage rather than the best case one.',
    },
    {
      q: 'Do you work with businesses outside Connecticut?',
      a: 'Yes. We are based in Fairfield and most of our clients are in the Northeast, but registration, brand and campaign work all run remotely. Where a filing needs local knowledge we bring in a specialist we have already vetted rather than guessing.',
    },
    {
      q: 'Do I have to use all three services?',
      a: 'No. Plenty of clients come to us only to get registered, or only to fix advertising that is burning money. The three fit together when you need them to and stand on their own when you do not.',
    },
    {
      q: 'What size of business do you take on?',
      a: 'We work with everyone from one person about to file their first paperwork to established operators running several locations. Size matters less than whether you want to be told the truth about your business, because that is the only way we know how to work.',
    },
  ],
} as const;

export const CTA = {
  eyebrow: "Let's Work Together",
  headline: 'Your Next Move Starts Here',
  lede: "Whether you are launching, repositioning, or looking for your next stage of growth, let's talk about what is possible.",
  details: [
    { label: 'Our Location', value: ['268 Post Road, Suite 200', 'Fairfield, CT 06824'] },
    { label: 'Get in Touch', value: [SITE.phone], href: SITE.phoneHref },
    { label: 'Email Us', value: [SITE.email], href: `mailto:${SITE.email}` },
    { label: 'Availability', value: ['24/7'] },
  ],
} as const;
