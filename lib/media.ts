/**
 * Every image on the site flows through this file's types and the <MediaFrame>
 * component, so photography can be swapped in without touching layout.
 *
 * To add a real photo: set `src`. Until then the slot paints a tonal field
 * sized by `aspect`, so the swap causes no layout shift.
 *
 * Site-level slots live below. Project photography lives beside its project in
 * content/projects.ts.
 *
 * Remote URLs additionally need their host added to `images.remotePatterns`
 * in next.config.ts. Files dropped into /public need no config — reference
 * them as "/name.jpg".
 */

export type Tone = "linen" | "stone" | "oak" | "brass" | "shade";

export type MediaSlot = {
  /** Leave "" until real photography is supplied. */
  src: string;
  alt: string;
  /** CSS aspect-ratio. Drives the box in both placeholder and photo states. */
  aspect: string;
  tone: Tone;
};

/**
 * Tonal fields drawn from the palette. Decorative only — never carries text.
 *
 * Each is a light study rather than a flat swatch: a soft source from the upper
 * left, a fall-off to the lower right. A flat block reads as a failed image;
 * raking light reads as an intentional plate while photography is pending.
 */
export const TONE_FIELDS: Record<Tone, string> = {
  linen: [
    "radial-gradient(115% 85% at 20% 8%, rgb(255 253 248 / 0.95) 0%, rgb(255 253 248 / 0) 58%)",
    "radial-gradient(90% 70% at 92% 100%, rgb(120 104 84 / 0.18) 0%, rgb(120 104 84 / 0) 60%)",
    "linear-gradient(152deg, #efe9df 0%, #e6ddcf 58%, #dbd0bf 100%)",
  ].join(", "),
  stone: [
    "radial-gradient(115% 85% at 18% 10%, rgb(253 250 244 / 0.9) 0%, rgb(253 250 244 / 0) 56%)",
    "radial-gradient(90% 70% at 94% 100%, rgb(97 84 68 / 0.22) 0%, rgb(97 84 68 / 0) 62%)",
    "linear-gradient(152deg, #e9e2d6 0%, #ded4c4 58%, #cbbfab 100%)",
  ].join(", "),
  oak: [
    "radial-gradient(110% 80% at 22% 10%, rgb(250 240 224 / 0.82) 0%, rgb(250 240 224 / 0) 54%)",
    "radial-gradient(90% 75% at 96% 100%, rgb(78 60 40 / 0.28) 0%, rgb(78 60 40 / 0) 60%)",
    "linear-gradient(152deg, #dcc7a9 0%, #cbb08d 58%, #b5966f 100%)",
  ].join(", "),
  brass: [
    "radial-gradient(110% 80% at 24% 8%, rgb(247 229 199 / 0.78) 0%, rgb(247 229 199 / 0) 52%)",
    "radial-gradient(90% 75% at 96% 100%, rgb(58 42 26 / 0.32) 0%, rgb(58 42 26 / 0) 60%)",
    "linear-gradient(152deg, #c9a97f 0%, #b08d62 58%, #8f6f49 100%)",
  ].join(", "),
  shade: [
    "radial-gradient(110% 85% at 20% 6%, rgb(196 174 146 / 0.34) 0%, rgb(196 174 146 / 0) 55%)",
    "radial-gradient(85% 70% at 95% 100%, rgb(0 0 0 / 0.4) 0%, rgb(0 0 0 / 0) 62%)",
    "linear-gradient(152deg, #4a423a 0%, #332c26 58%, #1e1a16 100%)",
  ].join(", "),
};

/**
 * Hero video. Muted, looping, decorative — the poster carries the meaning.
 * Leave `src` empty and the poster frame stands alone; the hero never breaks.
 */
export const heroVideo: { src: string; poster: MediaSlot } = {
  // Wired to the file supplied for the hero. Drop it in at this exact path —
  // public/a_Create_a_photorealis.mp4 — and it starts playing with no further
  // code change; <Hero> already falls back to the poster/tonal field if this
  // 404s, so nothing breaks in the meantime.
  src: "/a_Create_a_photorealis.mp4",
  poster: {
    // Extracted from the video's own first frame (`ffmpeg -i … -vframes 1`),
    // not a separate photograph. That makes the poster pixel-identical to
    // where the video actually starts, so there's no flash or tone-field
    // placeholder before playback begins — just one continuous image that
    // starts moving.
    src: "/hero-poster.jpg",
    alt: "Morning light crossing a plastered wall in a Nilayaa interior",
    aspect: "16 / 9",
    tone: "stone",
  },
};

/**
 * Full-bleed background plate behind the hero's scroll-expand animation
 * (`<ScrollExpandMedia>`). Drop the supplied render in at this exact path —
 * public/hero-scroll.png — and it appears with no further code change; the
 * tonal field stands in until then, so the hero never shows a broken image.
 */
export const heroScrollBackground: MediaSlot = {
  src: "/hero-scroll.png",
  alt: "A softly lit Nilayaa interior render",
  aspect: "16 / 9",
  tone: "stone",
};

export const siteMedia = {
  /* Not currently placed on the page — kept ready for whenever the intro
     section grows a supporting image. */
  homePhilosophy: {
    src: "",
    alt: "A teak screen filtering afternoon light across a lime-plastered wall",
    aspect: "1 / 1",
    tone: "oak",
  },
  homeFeatureBand: {
    src: "/photos/bedroom-platform-dark.webp",
    alt: "A bedroom finished in charcoal lacquer, with a floating stone-topped nightstand",
    aspect: "795 / 1020",
    tone: "shade",
  },
  /* A wide, quiet breathing-room strip between the project carousel and the
     testimonials — no heading, no caption, just one more finished room. */
  homeBand: {
    src: "/photos/kitchen-marble-pantry.webp",
    alt: "A finished kitchen in book-matched marble, the full width of the room",
    aspect: "1280 / 576",
    tone: "linen",
  },
  studioPortrait: {
    src: "/photos/study-wood-slat.webp",
    alt: "A study finished in walnut-toned wood panelling, lit from one side",
    aspect: "679 / 1020",
    tone: "linen",
  },
  studioWorkshop: {
    src: "/photos/materials-stone-teak.webp",
    alt: "Travertine stone, reclaimed wood and ceramic — the material palette the studio works in",
    aspect: "1320 / 743",
    tone: "stone",
  },
  contactRoom: {
    src: "/photos/foyer-marble-shelf.webp",
    alt: "A foyer in book-matched marble, with a backlit open teak shelving unit",
    aspect: "1280 / 960",
    tone: "shade",
  },
} satisfies Record<string, MediaSlot>;

/**
 * The four plates in the home page strip, in order. Paired by index with
 * `home.spaces.items` in content/studio.ts — keep the two arrays the same
 * length and the same order.
 *
 * The aspects are deliberately uneven: the third plate is the tall one the
 * strip steps up to. Changing them changes the rhythm of the row.
 */
export const homeSpaces: MediaSlot[] = [
  {
    src: "/photos/kitchen-olive-green.webp",
    alt: "Morning light on a glazed tile backsplash and olive cabinetry",
    aspect: "1080 / 598",
    tone: "stone",
  },
  {
    src: "/photos/dining-teak-crockery.webp",
    alt: "A teak dining room, sited to catch the morning light",
    aspect: "1280 / 852",
    tone: "linen",
  },
  {
    src: "/photos/bathroom-cream-tile.webp",
    alt: "Grey stone tile, softened by steam and morning light",
    aspect: "802 / 1020",
    tone: "oak",
  },
  {
    src: "/photos/bedroom-floral-blind.webp",
    alt: "A west-facing bedroom shaded against the late sun",
    aspect: "679 / 1020",
    tone: "shade",
  },
];

/**
 * Photography for the two photo cells in <ProcessGrid> (steps 1 and 3 of
 * the homepage's four-step teaser — the other two are text-only cells).
 */
export const homeProcess: MediaSlot[] = [
  {
    src: "/photos/thumb-kitchen-construction.jpg",
    alt: "An early site visit, before the kitchen walls are finished",
    aspect: "141 / 118",
    tone: "stone",
  },
  {
    src: "/photos/thumb-wardrobe-construction.jpg",
    alt: "Cabinetry going in during a first-fix site visit",
    aspect: "141 / 118",
    tone: "oak",
  },
  {
    src: "/photos/kitchen-render-design.webp",
    alt: "A kitchen visualised before the cabinets were built",
    aspect: "1080 / 864",
    tone: "linen",
  },
];

/**
 * One photo per entry in `home.services.items`, same length and order —
 * the panel the services accordion swaps to when its matching row is
 * hovered or focused.
 */
export const homeServicePanels: MediaSlot[] = [
  {
    src: "/photos/bedroom-sage-green.webp",
    alt: "A finished bedroom, seen from the doorway of its main room",
    aspect: "1280 / 821",
    tone: "linen",
  },
  {
    src: "/photos/thumb-wardrobe-bw.jpg",
    alt: "Custom joinery finished in lacquer and walnut veneer",
    aspect: "141 / 176",
    tone: "shade",
  },
  {
    src: "/photos/home-theatre-cream-a.webp",
    alt: "A shared lounge, screening-room style",
    aspect: "1280 / 960",
    tone: "stone",
  },
  {
    src: "/photos/wardrobe-dresser-mirror.webp",
    alt: "A dresser and wardrobe unit finished in ivory lacquer and oak",
    aspect: "1 / 1",
    tone: "oak",
  },
];

/**
 * Portrait slots for `home.experts.roles`, paired by index — same
 * length, same order. Tonal fields stand in until real portraits exist.
 */
export const homeExperts: MediaSlot[] = [
  {
    src: "",
    alt: "Portrait of the studio's principal designer",
    aspect: "4 / 5",
    tone: "linen",
  },
  {
    src: "",
    alt: "Portrait of the studio's site lead",
    aspect: "4 / 5",
    tone: "stone",
  },
  {
    src: "",
    alt: "Portrait of the studio's workshop lead",
    aspect: "4 / 5",
    tone: "oak",
  },
];
