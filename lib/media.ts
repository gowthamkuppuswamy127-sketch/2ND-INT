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
    src: "",
    alt: "Morning light crossing a plastered wall in a Nilayaa interior",
    aspect: "16 / 9",
    tone: "stone",
  },
};

export const siteMedia = {
  homePhilosophy: {
    src: "",
    alt: "A teak screen filtering afternoon light across a lime-plastered wall",
    aspect: "1 / 1",
    tone: "oak",
  },
  homeServices: {
    src: "",
    alt: "Brass hardware detail on a teak cabinet door",
    aspect: "3 / 2",
    tone: "brass",
  },
  homeServicesRoom: {
    src: "",
    alt: "A living room in late light, seen from the doorway",
    aspect: "3 / 2",
    tone: "linen",
  },
  studioPortrait: {
    src: "",
    alt: "The Nilayaa studio team reviewing drawings at a long teak table",
    aspect: "4 / 5",
    tone: "linen",
  },
  studioWorkshop: {
    src: "",
    alt: "Material samples of stone, oak and brass laid out on a workbench",
    aspect: "3 / 2",
    tone: "stone",
  },
  contactRoom: {
    src: "",
    alt: "The studio's reception room in late afternoon light",
    aspect: "3 / 2",
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
    src: "",
    alt: "A courtyard open to the sky at midday",
    aspect: "4 / 5",
    tone: "stone",
  },
  {
    src: "",
    alt: "Morning light falling across a teak dining table",
    aspect: "4 / 5",
    tone: "linen",
  },
  {
    src: "",
    alt: "Afternoon light on a blank lime-plastered living room wall",
    aspect: "3 / 5",
    tone: "oak",
  },
  {
    src: "",
    alt: "A west-facing bedroom shaded against the late sun",
    aspect: "4 / 5",
    tone: "shade",
  },
];
