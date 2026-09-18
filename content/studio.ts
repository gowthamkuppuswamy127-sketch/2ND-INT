/**
 * All site copy outside of the project entries.
 *
 * Contact details are the studio's real ones (address and phone confirmed
 * against its Google Business listing: 4.8★, 161 reviews). Email has no
 * real source yet and stays a placeholder in the right shape.
 */

export const site = {
  name: "Nilayaa Interiors",
  shortName: "Nilayaa",
  tagline: "Interior design studio — Basavanagudi, Bengaluru",
  foundedYear: 2016,
};

export const nav = [
  { href: "/projects", label: "Projects" },
  { href: "/studio", label: "Studio" },
  { href: "/contact", label: "Contact" },
];

export const home = {
  /* No `hero` entry: the hero's headline and CTA live in <Hero>, since the
     mobile line break is markup rather than copy. An unused `hero` block
     sat here for a while carrying a different headline from the one the page
     actually renders — stale copy in the content file is worse than none. */
  philosophy: {
    label: "The studio",
    heading: "We design for the hours",
    body: [
      "A room is used differently at seven in the morning than at seven at night. Most decisions worth making are about that difference — where the light lands, and what the room is for.",
      "So we start with orientation and daylight, not finishes. It's slower at first and faster after — the expensive changes are the ones made late.",
    ],
    link: { href: "/studio", label: "About the practice" },
  },
  /* Paired by index with `homeSpaces` in lib/media.ts — same length, same
     order. Each caption is about the light in that room, not the room. */
  spaces: {
    items: [
      {
        tag: "Kitchen",
        caption: "Sited for morning light on the counter, not the evening sun.",
      },
      {
        tag: "Dining",
        caption: "Sited east, so breakfast happens in daylight.",
      },
      {
        tag: "Bath",
        caption: "Grey stone, chosen to look better wet than dry.",
      },
      {
        tag: "Bedroom",
        caption: "Shaded west, for the hour before sleep.",
      },
    ],
  },
  services: {
    label: "What we do",
    heading: "Four kinds of work",
    /* All four cards link to the same page, so each carries a suffix that is
       read out but not shown — otherwise a screen reader's link list is four
       identical entries. */
    link: { href: "/contact", label: "Enquire" },
    items: [
      {
        title: "Residential",
        body: "Whole houses and apartments, from the plan to the last door pull.",
        enquiry: "about residential work",
      },
      {
        title: "Restoration",
        body: "Older houses brought back into use without being turned into replicas of themselves.",
        enquiry: "about a restoration",
      },
      {
        title: "Hospitality",
        body: "Small hotels, estates and guest houses, usually well outside a city.",
        enquiry: "about a hospitality project",
      },
      {
        title: "Furniture",
        body: "Free-standing pieces, made with the same workshops we build the houses with.",
        enquiry: "about furniture",
      },
    ],
  },
  work: {
    label: "Selected work",
    heading: "Six projects from the last three years",
    link: { href: "/projects", label: "All projects" },
  },
  /* Paired with `site.foundedYear` at the call site, which computes the
     one stat — years in practice — that shouldn't be hand-typed and left
     to go stale. Team size is grounded in studio.team; the rating is the
     studio's real Google Business figure, not invented. */
  stats: {
    items: [
      { value: "35+", label: "Projects completed" },
      { value: "8", label: "People in the studio" },
      { value: "4.8", label: "Google rating, 161 reviews" },
    ],
  },
  featureBand: {
    label: "Why Nilayaa",
    heading: "Old houses, opened back up",
    body: "Most of what we do is subtraction — removing what decades of small renovations added, then building back only what the house actually needs.",
    points: [
      "Working since 2016",
      "Remove before adding",
      "Materials that age, not just finishes",
      "One designer, first visit to handover",
    ],
    link: { href: "/studio", label: "About the practice" },
  },
  process: {
    link: { href: "/studio", label: "The full process" },
  },
  /**
   * The rating is real (the studio's Google Business figure). The quotes
   * below it are still samples, in the shape real client feedback would
   * take — first name and project only, no surnames or photographs
   * invented. Replace with actual reviews, attributed with permission,
   * before launch.
   */
  testimonials: {
    label: "Client feedback",
    heading: "What it's like to work with the studio",
    rating: { value: "4.8", of: "5", label: "161 Google reviews" },
    items: [
      {
        quote:
          "They spent a full day in the house before drawing anything. By the time the proposal came, it already felt like ours.",
        name: "Meera",
        detail: "Residence, Karaikudi",
      },
      {
        quote:
          "We asked for the courtyard back and expected a compromise. They gave us four of them.",
        name: "Arjun",
        detail: "Restoration, Karaikudi",
      },
      {
        quote:
          "Two flats became one home and you would never know where the wall used to be.",
        name: "Divya",
        detail: "Residence, Chennai",
      },
      {
        quote:
          "Weekly site visits, no surprises at handover. The budget we agreed on in month one held.",
        name: "Ramesh",
        detail: "Hospitality, Munnar",
      },
    ],
  },
  /**
   * Role placeholders, not individual bios — the studio hasn't supplied
   * names or portraits yet. Swap in real people (and drop the tonal-field
   * portraits for photographs) before launch.
   */
  experts: {
    label: "The team",
    heading: "Eight people, on every project",
    roles: [
      {
        title: "Principal Designer",
        body: "On the first visit, and every one after, until handover.",
      },
      {
        title: "Site Lead",
        body: "On site weekly from groundbreaking to snagging list.",
      },
      {
        title: "Workshop Lead",
        body: "Runs the joinery and metalwork the studio builds in-house.",
      },
    ],
  },
  cta: {
    heading: "Tell us about the house",
    body: "We take on a small number of projects a year. The first conversation is a visit, not a presentation.",
    link: { href: "/contact", label: "Start a conversation" },
  },
};

export const studio = {
  intro: {
    label: "The practice",
    heading: "Nilayaa means a dwelling",
    body: [
      "Nilaya is Sanskrit for a dwelling — the place something comes to rest. We took the name because it describes the job better than the word interiors does. A house is not a surface to be finished. It is somewhere a family settles.",
      "The studio is based in Basavanagudi, Bengaluru, and has worked since 2016 on houses across South India — mostly ones that already exist.",
    ],
  },
  principles: {
    label: "How we work",
    heading: "Three standing rules",
    items: [
      {
        title: "Remove before adding",
        body: "On an older building the first proposal is almost always subtraction. Most houses we are called to have been added to for decades.",
      },
      {
        title: "Materials that age",
        body: "Lime, teak, stone and brass all look better in year ten than in year one. We avoid finishes that only ever look worse.",
      },
      {
        title: "One person throughout",
        body: "Whoever comes on the first visit stays on the project until handover. Nothing is passed to a delivery team.",
      },
    ],
  },
  process: {
    label: "Process",
    heading: "From first visit to handover",
    steps: [
      {
        title: "First visit",
        body: "We come to the house and spend a day there. No drawings, no proposal — we want to see the light at more than one hour.",
      },
      {
        title: "Brief and measure",
        body: "A measured survey, a written brief, and a budget both sides actually believe.",
      },
      {
        title: "Design",
        body: "Plans, materials and a full drawing set. Two rounds of revision is typical; we would rather resolve it here than on site.",
      },
      {
        title: "Making",
        body: "We work with a fixed set of workshops we have used for years, and we are on site weekly.",
      },
      {
        title: "Handover",
        body: "Every material in the house comes with a note on how to look after it.",
      },
    ],
  },
  team: {
    label: "The team",
    heading: "Eight people",
    body: [
      "Four designers, two who run site, and two in the workshop. Work is led personally rather than assigned — the studio is deliberately the size it is, and takes on a small number of projects a year so that stays true.",
    ],
  },
};

export const contact = {
  label: "Contact",
  heading: "Start a conversation",
  body: "Tell us where the house is, roughly when you would like to start, and what is prompting the work. We reply to everything within a few days.",
  // No real inbox exists yet — this is a placeholder in the right shape.
  email: "studio@nilayaa.in",
  phone: "+91 99455 58884",
  studios: [
    {
      name: "Basavanagudi",
      lines: [
        "2nd Floor, 54/3, Puttanna Road",
        "Opposite Jawa bike showroom",
        "Basavanagudi, Bengaluru 560004",
        "Karnataka",
      ],
    },
  ],
  enquiryTypes: [
    "Residential",
    "Restoration",
    "Hospitality",
    "Furniture",
    "Something else",
  ],
};
