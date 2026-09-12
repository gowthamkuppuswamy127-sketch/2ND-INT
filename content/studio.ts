/**
 * All site copy outside of the project entries.
 *
 * Contact details below are placeholders in the right shape — replace them
 * with the studio's real address, phone and email before launch.
 */

export const site = {
  name: "Nilayaa Interiors",
  shortName: "Nilayaa",
  tagline: "Interior design studio — Karaikudi & Chennai",
};

export const nav = [
  { href: "/projects", label: "Projects" },
  { href: "/studio", label: "Studio" },
  { href: "/contact", label: "Contact" },
];

export const home = {
  hero: {
    eyebrow: "Interior design studio — Karaikudi & Chennai",
    headline: "Rooms that hold the light",
    subline:
      "We work in lime, teak, stone and brass, and design rooms for the way light moves through them across a day.",
    cta: { href: "/projects", label: "See the work" },
  },
  philosophy: {
    label: "The studio",
    heading: "We design for the hours",
    body: [
      "A room is used differently at seven in the morning than at seven in the evening, and most of the decisions worth making are about that difference — where the light lands, what it lands on, and what the room is for at that hour.",
      "So we start with orientation and daylight before we start with finishes. It is slower at the beginning and considerably faster afterwards, because the expensive changes are the ones made late.",
    ],
    link: { href: "/studio", label: "About the practice" },
  },
  services: {
    label: "What we do",
    heading: "Four kinds of work",
    items: [
      {
        title: "Residential",
        body: "Whole houses and apartments, from the plan to the last door pull.",
      },
      {
        title: "Restoration",
        body: "Older houses brought back into use without being turned into replicas of themselves.",
      },
      {
        title: "Hospitality",
        body: "Small hotels, estates and guest houses, usually well outside a city.",
      },
      {
        title: "Furniture",
        body: "Free-standing pieces, made with the same workshops we build the houses with.",
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
      "The studio has worked since 2016 across Tamil Nadu and Kerala, mostly on houses, and mostly on houses that already exist.",
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
  email: "studio@nilayaa.in",
  phone: "+91 98400 00000",
  studios: [
    {
      name: "Karaikudi",
      lines: ["14 Sekkalai Road", "Karaikudi 630001", "Tamil Nadu"],
    },
    {
      name: "Chennai",
      lines: ["2nd Floor, 18 Cathedral Road", "Chennai 600086", "Tamil Nadu"],
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
