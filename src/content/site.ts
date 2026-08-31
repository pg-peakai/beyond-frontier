/**
 * Single source of truth for site copy.
 * Swap BRAND and any string here without touching components.
 */

export const BRAND = {
  name: "Beyond Frontier",
  short: "Beyond Frontier",
  tagline: "Training data for machines that work with their hands.",
  meta:
    "Beyond Frontier captures real-world human labor footage — egocentric video, synchronized IMU, human-audited annotation — as training data for embodied AI and VLA models.",
  location:
    "Headquartered in India. Capture nationwide. Supplying labs globally.",
  email: "pg@byndfrntr.com",
};

/**
 * Vendor intake — a separate product at vendors.byndfrntr.com.
 * Every link out of this site carries a short, stable `src` slug so the intake
 * can attribute the application. First touch wins there, so do not add a second
 * slug to an existing entry point; add a new one. Never rebuild any part of the
 * intake form here — the phone number must be verified on the page that sends
 * the OTP.
 */
export const VENDORS = {
  base: "https://vendors.byndfrntr.com/",
  /** Slugs in use: website-hero, website-partners, website-footer. */
  link: (src: "website-hero" | "website-partners" | "website-footer") =>
    `https://vendors.byndfrntr.com/?src=${src}`,
};

export const NAV = [
  { label: "Data", href: "/#labs" },
  { label: "Buyers", href: "/buyers" },
  { label: "Partners", href: "/partners" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

/** The nav splits around the centred wordmark; the last item becomes the CTA. */
export const NAV_LEFT = NAV.slice(0, 2);
export const NAV_RIGHT = NAV.slice(2, 4);
export const NAV_CTA = { label: "Request access", href: "/contact" };

export const HOME = {
  hero: {
    headline: [
      "Intelligence has never touched anything.",
      "We help AGI touch grass.",
    ],
    sub: "Beyond Frontier builds the intelligence layer for robotics.",
    primary: { label: "Request a dataset", href: "/contact" },
    secondary: {
      label: "Become a capture partner",
      href: "https://vendors.byndfrntr.com/?src=website-hero",
    },
  },

  network: {
    label: "Network",
    /** Line two sets in the display italic, same size as line one. */
    headline: "The physical world isn't online.",
    headlineAccent: "a network that reaches where the labs can't",
    body: "Contributors across factories, workshops and worksites. Millions of hours of real physical work, recorded at production speed.",
    cta: { label: "Request a custom dataset", href: "/contact" },
    meter: "Live captures · streaming from the floor",
    /**
     * Capture sites plotted on the globe. The one nearest the centre of the
     * sphere surfaces in the live card as it rotates past.
     * `video` is an optional path under /public — drop clips in and they play
     * muted on loop while that site is fronted.
     */
    sites: [
      { city: "Coimbatore", country: "IN", lat: 11.0, lon: 76.96 },
      { city: "Ludhiana", country: "IN", lat: 30.9, lon: 75.86 },
      { city: "Pune", country: "IN", lat: 18.52, lon: 73.86 },
      { city: "Ahmedabad", country: "IN", lat: 23.03, lon: 72.58 },
      { city: "Chennai", country: "IN", lat: 13.08, lon: 80.27 },
      { city: "Surat", country: "IN", lat: 21.17, lon: 72.83 },
      { city: "Kanpur", country: "IN", lat: 26.45, lon: 80.33 },
      { city: "Jamshedpur", country: "IN", lat: 22.8, lon: 86.18 },
      { city: "Dhaka", country: "BD", lat: 23.81, lon: 90.41 },
      { city: "Hanoi", country: "VN", lat: 21.03, lon: 105.85 },
      { city: "Bangkok", country: "TH", lat: 13.76, lon: 100.5, featured: true, video: "/clips/stereo.mp4" },
      { city: "Jakarta", country: "ID", lat: -6.21, lon: 106.85 },
      { city: "Shenzhen", country: "CN", lat: 22.54, lon: 114.06 },
      { city: "Busan", country: "KR", lat: 35.18, lon: 129.08 },
      { city: "Osaka", country: "JP", lat: 34.69, lon: 135.5 },
      { city: "Manila", country: "PH", lat: 14.6, lon: 120.98 },
      { city: "Melbourne", country: "AU", lat: -37.81, lon: 144.96 },
      { city: "Istanbul", country: "TR", lat: 41.01, lon: 28.98, featured: true, video: "/clips/narration.mp4" },
      { city: "Cairo", country: "EG", lat: 30.04, lon: 31.24 },
      { city: "Nairobi", country: "KE", lat: -1.29, lon: 36.82 },
      { city: "Lagos", country: "NG", lat: 6.52, lon: 3.38 },
      { city: "Casablanca", country: "MA", lat: 33.57, lon: -7.59 },
      { city: "Barcelona", country: "ES", lat: 41.39, lon: 2.17 },
      { city: "Porto", country: "PT", lat: 41.15, lon: -8.61 },
      { city: "Milan", country: "IT", lat: 45.46, lon: 9.19 },
      { city: "Leipzig", country: "DE", lat: 51.34, lon: 12.37 },
      { city: "Gdansk", country: "PL", lat: 54.35, lon: 18.65 },
      { city: "Manchester", country: "GB", lat: 53.48, lon: -2.24 },
      { city: "Detroit", country: "US", lat: 42.33, lon: -83.05 },
      { city: "Monterrey", country: "MX", lat: 25.69, lon: -100.32 },
      { city: "Mexico City", country: "MX", lat: 19.43, lon: -99.13, featured: true, video: "/clips/egocentric.mp4" },
      { city: "Bogota", country: "CO", lat: 4.71, lon: -74.07 },
      { city: "Sao Paulo", country: "BR", lat: -23.55, lon: -46.63 },
    ] as {
      city: string;
      country: string;
      lat: number;
      lon: number;
      /** Featured stops are the ones the globe pauses on, in list order. */
      featured?: boolean;
      /** Path under /public. Plays muted on loop while this stop is held. */
      video?: string;
    }[],
  },

  experience: {
    label: "For the labs",
    headline: "Intelligence needs",
    headlineAccent: "experience.",
    body: "Real human work, captured where it happens and transformed into rich, usable training data for machines learning to operate in the physical world.",
    cta: { label: "Enter the labs", href: "/contact" },
    /** Sits directly above the timeline. */
    rail: "Real world → robot intelligence",
    timeline: [
      {
        time: "00:00",
        title: "Environment ready",
        detail: "Space, objects, tasks configured.",
      },
      {
        time: "00:42",
        title: "Task staged",
        detail: "Real-world workflows set in motion.",
      },
      {
        time: "02:15",
        title: "Experience captured",
        detail: "RGB · Depth · Motion · Audio.",
      },
      {
        time: "08:30",
        title: "Intent annotated",
        detail: "What happened. Why it happened.",
      },
      {
        time: "36:00",
        title: "Training ready",
        detail: "Validated · Structured · Ready.",
      },
    ],
    /**
     * The deck sits stacked and fans out on hover. `image` is an optional path
     * under /public; without one the card renders its placeholder plate.
     */
    cards: [
      {
        code: "BF / 001",
        kicker: "Production floor",
        title: "Where work happens",
        image: "/cards/bf-001-long.png",
      },
      {
        code: "BF / 002",
        kicker: "Human perspective",
        title: "From the human angle",
        image: "/cards/bf-002-long.png",
      },
      {
        code: "BF / 003",
        kicker: "Four streams",
        title: "More than a video",
        image: "/cards/bf-003-long.png",
      },
      {
        code: "BF / 004",
        kicker: "Audited hours",
        title: "Experience, made trainable",
        image: "/cards/bf-004-long.png",
      },
    ] as {
      code: string;
      kicker: string;
      title: string;
      image?: string;
    }[],
  },

  captureSite: {
    label: "Join the verified network",
    headline: "Your floor already does the work.",
    headlineAccent: "Now make it worth more.",
    body: "We bring the rigs, operators and training. Your workers keep doing the work they already do — while approved hours become physical-AI training data.",
    cta: { label: "Become a Capture Site", href: "/partners" },
    badge: {
      title: "Zero capex",
      body: "We handle setup, operations & support",
    },
    /** Readout pinned over the floor photo. */
    feed: {
      label: "Live capture feed",
      rows: [
        { key: "STEREO", value: "29.78 FPS" },
        { key: "DEPTH", value: "1.64 M" },
        { key: "IMU", value: "200 HZ" },
      ],
    },
    stepsLabel: "How it works for you",
    steps: [
      {
        icon: "cycle",
        title: "Existing work",
        body: "Capture happens during real production.",
        note: ["No workflow changes.", "No downtime."],
      },
      {
        icon: "kit",
        title: "We set it up",
        body: "Rigs, operators, training and support.",
        note: ["Zero capex.", "Zero hassle."],
      },
      {
        icon: "earn",
        title: "Earn more",
        body: "Approved hours create a new income stream.",
        note: ["Sites and workers", "get paid."],
      },
      {
        icon: "control",
        title: "You stay in control",
        body: "Consent, privacy and IP protection built in.",
        note: ["You approve what", "leaves your floor."],
      },
    ] as {
      icon: "cycle" | "kit" | "earn" | "control";
      title: string;
      body: string;
      note: string[];
    }[],
  },

  labs: {
    headline: "Built for the labs",
    headlineAccent: "building AGI",
    meter: "Captured · Enriched · Annotated · Audited",
    /**
     * `image` or `video` are optional paths under /public, revealed on row
     * hover. A video only plays while its row is hovered.
     */
    items: [
      {
        name: "Egocentric",
        body: "See the work from the hands that do it.",
        detail:
          "The worker's perspective captures the objects, tools and actions that matter.",
        video: "/clips/egocentric.mp4",
      },
      {
        name: "Stereo",
        body: "Give the machine a sense of space.",
        detail:
          "Depth turns a flat image into a physical environment.",
        video: "/clips/stereo.mp4",
      },
      {
        name: "Motion",
        body: "Teach it how things move.",
        detail:
          "Frame-synced motion captures the dynamics of every action.",
        video: "/clips/motion.mp4",
      },
      {
        name: "Narration",
        body: "Give the action a reason.",
        detail: "Human narration adds the intent behind what happened.",
        video: "/clips/narration.mp4",
      },
    ] as {
      name: string;
      body: string;
      detail: string;
      image?: string;
      video?: string;
    }[],
  },

  thesis: {
    label: "The thesis",
    title:
      "Every frontier lab has the same bottleneck now, and it isn't compute and it isn't architecture.",
    body: [
      "It's that a model has never picked anything up.",
      "The internet is a record of what humans said and saw. It is almost silent on what humans did — the force applied, the wrist rotation, the half-second correction when a part slips. That signal was never written down, because nobody was recording it.",
      "So the labs are stuck training on video that shows the outcome and hides the action.",
    ],
    kicker: "We record the action.",
  },

  doing: {
    label: "What we actually do",
    title: "We run capture operations inside real workplaces.",
    body: [
      "Factory floors, construction interiors, workshops, trade sites. Real workers doing paid work at production speed, wearing our rigs.",
      "Not staged. Not a lab. Not a teleoperated arm pretending to be a person.",
      "The output is action-conditioned data: egocentric video, synchronized IMU at 200Hz+, wrist-cam and stereo depth where the task demands it, and human-audited annotation on every hour we ship.",
    ],
    stats: [
      { value: "200Hz+", label: "IMU, synchronized to frame" },
      { value: "100%", label: "Hours audited by a person" },
      { value: "1,000s", label: "Hour pipelines running now" },
    ],
  },

  moat: {
    label: "Why operators win",
    title: "Video is a commodity. Access is not.",
    body: [
      "Anyone can scrape video, buy it, license it.",
      "Getting fifty workers in a metal fabrication plant to wear head rigs for a month is a logistics problem, a trust problem, and a consent problem — and it takes years to build the relationships that make it routine.",
    ],
    pull: "We own the pipeline, not the corpus. That's the TSMC position, not the Getty position. Corpora get copied. Capacity doesn't.",
  },

  whatYouGet: {
    label: "What you get",
    title: "Five things in every delivery.",
    items: [
      {
        title: "Egocentric video",
        body: "Head-mounted, first-person, at working speed.",
      },
      {
        title: "Motion",
        body: "IMU at 200Hz+, synchronized to frame. Wrist-cam and stereo depth on request.",
      },
      {
        title: "Annotation",
        body: "Vision-language models draft, human auditors correct. Every hour reviewed by a person.",
      },
      {
        title: "Quality reports",
        body: "Per-dataset filter and blur QC, rejected-clip breakdown, task distribution. You see what you're buying before you buy it.",
      },
      {
        title: "Consent",
        body: "Documented, worker-level, on every participant.",
      },
    ],
  },

  domains: {
    label: "Domains we cover",
    items: [
      "Metal fabrication",
      "Construction & interior finishing",
      "Textiles & weaving",
      "Assembly & packing",
      "Vocational trades",
      "Custom domains on request",
    ],
    note: "If your model needs a task we don't cover yet, we can usually stand up capture in weeks. That's the point of owning the pipeline.",
  },

  how: {
    label: "How it works",
    steps: [
      {
        title: "Brief",
        body: "You tell us the task family, the modality tier, the hours, and your rejection criteria.",
      },
      {
        title: "Scope",
        body: "We come back with a capture plan, diversity guarantees, timeline, and price per approved hour.",
      },
      {
        title: "Capture",
        body: "We deploy to real sites. You get a pilot batch first.",
      },
      {
        title: "QC and delivery",
        body: "Filtered, annotated, reported, delivered. You pay for approved hours only.",
      },
    ],
  },

  cta: {
    title: "Tell us what your model can't do yet.",
    body: "Most conversations start with a failure mode, not a spec. Send us the failure mode.",
    action: { label: "Talk to us", href: "/contact" },
  },
};

export const BUYERS = {
  eyebrow: "For buyers",
  headline: ["Data for models", "that have to touch things."],
  intro: [
    "If you're training a VLA or a world model, you already know where it breaks. It generalizes across scenes and collapses across hands. It has seen ten thousand kitchens and never felt a knife bind.",
    "We supply the missing half.",
  ],
  tiers: {
    label: "Capture tiers",
    items: [
      {
        tier: "Tier 1",
        title: "Egocentric",
        body: "Head-mounted first-person video. The baseline. Highest hours per rupee.",
        specs: ["First-person video", "Working speed", "Highest volume"],
      },
      {
        tier: "Tier 2",
        title: "Egocentric + motion",
        body: "Adds synchronized IMU at 200Hz+. For anything where trajectory matters more than appearance.",
        specs: ["Everything in Tier 1", "IMU @ 200Hz+", "Frame-synchronized"],
      },
      {
        tier: "Tier 3",
        title: "Multi-view",
        body: "Adds wrist-cam and stereo depth. For manipulation policies that need geometry, not just pixels.",
        specs: ["Everything in Tier 2", "Wrist camera", "Stereo depth"],
      },
    ],
  },
  terms: {
    label: "Commercial terms",
    items: [
      "Priced per approved hour, not per raw hour.",
      "Pilot batch before scale, always.",
      "Rejection rights defined in the SOW. If it fails your criteria, you don't pay for it.",
      "Licensing structured to your needs — exclusive, non-exclusive, or field-limited.",
    ],
  },
  scale: {
    label: "Scale",
    body: "We're currently running multi-thousand-hour pipelines across industrial and trade domains, with capture partners embedded on-site. Ask for current capacity.",
  },
  cta: { label: "Request scoping call", href: "/contact" },
};

export const PARTNERS = {
  eyebrow: "For capture partners",
  headline: ["Your floor", "is a dataset."],
  intro: [
    "You do not have to own the site. Most of our partners are people who can arrange access — through a contact at a plant, a contractor they have worked with for years, a workshop that trusts them. If you can open a door to real work being done, that is the hard part, and it is the part we pay for.",
    "Factories, warehouses, kitchens, retail floors, construction. We handle the hardware, the training, the consent process, the QC and the buyer relationships. You arrange access and coordination. You are paid per accepted hour.",
    "No disruption to production. Workers wear a light head rig and do their normal job.",
  ],
  handled: {
    label: "What we handle",
    items: [
      "Rigs and setup",
      "Worker onboarding and consent",
      "Data offload and transport",
      "QC and rejection handling",
      "Buyer contracts and payment",
    ],
  },
  cta: {
    label: "Apply to record",
    href: "https://vendors.byndfrntr.com/?src=website-partners",
  },
  /** Sets expectations for the intake at vendors.byndfrntr.com. Keep this in
   *  step with that flow: it is phone-first, and its length varies with how
   *  many environments an applicant picks — so never state a step count. */
  apply: {
    label: "How applying works",
    items: [
      {
        title: "Starts with a phone number",
        body: "No password and no account to create. You verify a number by one-time code, and that number is how you get back in — from any device.",
      },
      {
        title: "Around ten minutes",
        body: "It saves as you go. Leave it half done, come back on the same number, and pick up where you stopped.",
      },
      {
        title: "You rank what you can reach",
        body: "Order the environments you can record in — factories, warehouses, kitchens, retail, construction — with locations, how fast you could deploy, and a short sample video for each.",
      },
      {
        title: "Paid per accepted hour",
        body: "Not per promise, and not per hour shot. Footage that clears QC is what earns. Refer another partner and you earn again when their footage is accepted.",
      },
    ],
  },
};

export const ABOUT = {
  eyebrow: "About",
  headline: ["We're building the supply side", "of physical intelligence."],
  body: [
    "Every major shift in AI has been unlocked by someone doing unglamorous data work first. ImageNet before AlexNet. Web crawls before GPT. Annotated driving footage before autonomy.",
    "Embodied AI is at that moment now. The models are ready. The data isn't there.",
    "So we went to where the work is. Not to a lab in San Francisco — to factory floors and job sites, where millions of people perform exactly the tasks robots are meant to learn, every single day, and where none of it has ever been recorded in a form a model can use.",
    "That's an operational problem before it's a technical one. It means relationships with plant owners. Consent frameworks that respect the people wearing the cameras. Logistics for moving hundreds of storage cards across a country. Annotation teams who understand the domain. QC that a frontier lab will actually accept.",
    "We've spent our time building that machine rather than talking about it.",
  ],
  principles: {
    label: "Principles",
    items: [
      {
        title: "Real work only",
        body: "No staged capture, no actors. If it wasn't going to happen anyway, we don't record it.",
      },
      {
        title: "Workers consent and workers get paid",
        body: "Every participant knows what's being recorded and why.",
      },
      {
        title: "We ship what we promise",
        body: "Approved hours, not raw hours. Reports before invoices.",
      },
      {
        title: "Operators, not brokers",
        body: "We own the capture. That's the whole business.",
      },
    ],
  },
  where: {
    label: "Where we are",
    body: "Headquartered in India, operating across industrial and trade sites nationally, supplying AI labs and robotics companies globally.",
  },
  ctas: [
    { label: "Work with us", href: "/contact" },
    { label: "Join the team", href: "/contact?intent=careers" },
  ],
  careers: "We need people who like hard logistics more than clean abstractions.",
};

export const CONTACT = {
  eyebrow: "Contact",
  headline: ["Tell us the task, the hours,", "and the failure mode."],
  body: "Tell us the task, the hours, and the failure mode you're trying to fix. We'll come back with a capture plan.",
  intents: [
    { value: "dataset", label: "Request a dataset" },
    { value: "partner", label: "Become a capture partner" },
    { value: "careers", label: "Join the team" },
    { value: "other", label: "Something else" },
  ],
};
