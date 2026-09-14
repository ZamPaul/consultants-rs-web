import { SITE } from '@/lib/site';

/**
 * All page copy lives here, typed, in one file. Not a CMS, because two people
 * and a brochure site do not need one, and not scattered through JSX, because
 * then a wording change becomes a hunt.
 *
 * Client rule for this project: American English, and no dashes anywhere in
 * user-facing copy. There is one deliberate hyphen, in "Multi-Channel
 * Marketing", which is a compound adjective rather than punctuation.
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
    'Helping entrepreneurs and established businesses launch, position, and grow with practical strategy and hands on support.',
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
        { href: '#services', label: 'Business Launch and Setup' },
        { href: '#services', label: 'Marketing and Promotion' },
        { href: '#services', label: 'Advertising Campaigns' },
      ],
    },
  ],
  legal: [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
  ],
  /**
   * Placeholders. The client has approved shipping these as-is for now and
   * will supply real profiles later. They must be real or removed before
   * launch: dead icons on a live site read as abandoned.
   */
  socials: [
    { label: 'LinkedIn', href: '#' },
    { label: 'Instagram', href: '#' },
    { label: 'Facebook', href: '#' },
    { label: 'YouTube', href: '#' },
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
  headline: ['Your Vision.', 'Our Expertise.'],
  lede: 'Consultants RS helps entrepreneurs and businesses turn ideas into successful ventures, build market presence, and create long term growth.',
  imageAlt: 'A business owner looking out over the city from a high floor office',
  rail: ['Strategy', 'People', 'Opportunity', 'Growth'],
} as const;

/**
 * Change 03 from sign off: these three came out of the hero and now have
 * their own band directly beneath it.
 *
 * Standing warning, carried from every prototype doc: not one of these has
 * been verified. The client has approved shipping them for now and changing
 * them later. "100% Client Satisfaction" in the Impact section further down
 * is an absolute performance claim about a real business and is the one to
 * remove first if anything is ever challenged.
 */
export const FIGURES = [
  { value: 50, suffix: '+', label: 'Businesses Supported' },
  { value: 100, suffix: '%', label: 'Client Focused' },
  { text: 'Global', label: 'Perspective' },
] as const;

export const ABOUT = {
  eyebrow: 'About Consultants RS',
  headline: ['More Than Consultants.', 'Your Growth Partner.'],
  body: [
    'We work alongside ambitious entrepreneurs and businesses at every stage, from launch to long term growth, offering practical solutions, strategic guidance, and a hands on approach that helps you overcome challenges and unlock real opportunities.',
    'Founded by Raza Hussain and Shane Mills, Consultants RS was built for owners who would rather be told the truth than be told what they want to hear.',
  ],
  pills: ['Launch', 'Position', 'Promote', 'Grow'],
  imageAlt: 'Curved modern architecture',
  quote: 'Businesses thrive when the right people stand behind them.',
  cite: 'Consultants RS',
} as const;

export const SERVICES = {
  eyebrow: 'Our Core Services',
  headline: 'Three Solutions. Endless Possibilities.',
  lede: 'Everything you need to launch, position, and grow, under one roof.',
  items: [
    {
      n: '01',
      title: ['Business Launch', '& Setup'],
      body: 'Turn your idea into a fully operational business with the right foundation under it.',
      points: [
        'Business Registration',
        'Licensing & Compliance',
        'Business Structure',
        'Operational Setup',
        'Launch Strategy',
      ],
      imageAlt: 'Signing business formation documents',
    },
    {
      n: '02',
      title: ['Marketing', '& Promotion'],
      body: 'Build your brand, reach the right audience, and create real momentum behind it.',
      points: [
        'Brand Development',
        'Social Media Management',
        'Multi-Channel Marketing',
        'Customer Acquisition',
        'Market Positioning',
      ],
      imageAlt: 'Social platforms on a smartphone',
    },
    {
      n: '03',
      title: ['Advertising', 'Campaigns'],
      body: 'Put your message in front of the people most likely to act on it, and measure what comes back.',
      points: [
        'Campaign Strategy',
        'Paid Advertising',
        'Creative Production',
        'Audience Targeting',
        'Performance Tracking',
      ],
      imageAlt: 'A city billboard at dusk',
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
  text: 'We start businesses. We make them known. We buy the attention that fills them. Three services, run end to end, by the two people you actually meet.',
  points: [
    {
      title: 'No handoffs',
      body: 'Registration, brand and paid media under one roof. Nothing gets lost between three vendors who have never spoken to each other.',
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

/**
 * The client chose to keep this band as well as the new Figures band under the
 * hero. "100% Client Satisfaction" is an absolute performance claim about a
 * real business and remains unverified. It is the first thing to remove if it
 * is ever challenged.
 */
export const IMPACT = {
  eyebrow: 'Real People, Real Results',
  headline: ['Real Businesses.', 'Real Impact.'],
  figures: [
    { value: 50, suffix: '+', label: 'Projects Completed' },
    { value: 100, suffix: '%', label: 'Client Satisfaction' },
    { value: 7, suffix: '+', label: 'Industries Supported' },
  ],
} as const;

export const PROCESS = {
  eyebrow: 'Our Process',
  headline: 'From Vision to Results.',
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
      body: 'Implement with precision and expertise, alongside you.',
    },
    { n: '04', title: 'Grow', body: 'Optimize, scale, and create new opportunities.' },
  ],
} as const;

export const WHY = {
  eyebrow: 'Why Consultants RS',
  headline: ['The Difference', 'Is in Our Approach.'],
  lede: 'We do not just offer services. We build lasting partnerships through strategy, experience, and commitment.',
  items: [
    {
      title: 'Strategic Thinking',
      body: 'We look beyond individual tasks and focus on the bigger picture.',
    },
    {
      title: 'Hands On Partnership',
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
  headline: 'Built for Ambitious Businesses.',
  lede: 'We work with a diverse range of industries, bringing tailored solutions and real world experience to every project.',
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

/** Permission confirmed by the client for all three, to be revisited later. */
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
  headline: ['Built on Experience.', 'Driven by Your Ambition.'],
  body: [
    'Consultants RS was founded by Raza Hussain and Shane Mills with a simple goal: to help businesses succeed. What started as a few projects and local support has grown into a full service consulting firm, offering strategic guidance to businesses at every stage of growth.',
    'Every engagement still runs through the two of them and a vetted network of specialists, which is why they would rather do three things properly than list nine and hope.',
  ],
  /** Monogram panel retained by client decision until headshots are supplied. */
  people: [
    { initials: 'RH', name: 'Raza Hussain', role: 'Co Founder' },
    { initials: 'SM', name: 'Shane Mills', role: 'Co Founder' },
  ],
  note: 'Founder photography to be supplied',
} as const;

export const FAQ = {
  eyebrow: 'Questions',
  headline: ['Answered Before', 'You Ask.'],
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
      a: 'From one person about to file their first paperwork to established operators running several locations. Size matters less than whether you want to be told the truth about your business, because that is the only way we know how to work.',
    },
  ],
} as const;

export const CTA = {
  eyebrow: "Let's Work Together",
  headline: 'Your Next Move Starts Here.',
  lede: "Whether you are launching, repositioning, or looking for your next stage of growth, let's talk about what is possible.",
  details: [
    { label: 'Our Location', value: ['268 Post Road, Suite 200', 'Fairfield, CT 06824'] },
    { label: 'Get in Touch', value: [SITE.phone], href: SITE.phoneHref },
    { label: 'Email Us', value: [SITE.email], href: `mailto:${SITE.email}` },
    { label: 'Availability', value: ['24 hours, 7 days'] },
  ],
} as const;
