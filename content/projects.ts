import type { MediaSlot } from "@/lib/media";

export type Project = {
  slug: string;
  /** Studio drawing reference: practice, year, job number. */
  ref: string;
  name: string;
  location: string;
  year: string;
  typology: string;
  summary: string;
  brief: string[];
  materials: string[];
  specs: { label: string; value: string }[];
  cover: MediaSlot;
  gallery: MediaSlot[];
};

export const projects: Project[] = [
  {
    slug: "house-of-seven-courtyards",
    ref: "NI–24–02",
    name: "House of Seven Courtyards",
    location: "Karaikudi, Tamil Nadu",
    year: "2024",
    typology: "Residence",
    summary: "A Chettinad house reopened to its own courtyards.",
    brief: [
      "The house had been closed room by room over forty years — courtyards roofed over, verandas glazed in, the long central hall partitioned into bedrooms. The family wanted the plan back.",
      "We removed what had been added rather than adding anything new. Four of the seven courtyards were reopened to the sky. The athangudi tiles were lifted, catalogued, and relaid where earlier work had cut through them.",
      "The only new material is brass: door pulls, the kitchen counter edge, and a rainwater channel that runs the length of the second courtyard.",
    ],
    materials: [
      "Athangudi tile, relaid",
      "Burma teak, existing",
      "Lime plaster",
      "Brass",
      "Kota stone",
    ],
    specs: [
      { label: "Location", value: "Karaikudi, Tamil Nadu" },
      { label: "Completed", value: "2024" },
      { label: "Area", value: "6,200 sq ft" },
      { label: "Typology", value: "Residence" },
      { label: "Scope", value: "Restoration and interiors" },
    ],
    cover: {
      src: "/photos/living-room-teak-ceiling.png",
      alt: "The main living room, with a teak-panelled ceiling and brass details on the console",
      aspect: "1537 / 1023",
      tone: "stone",
    },
    gallery: [
      {
        src: "/photos/kitchen-bar-blue-tile.webp",
        alt: "A wood-topped breakfast counter beside a patterned tile panel",
        aspect: "1280 / 852",
        tone: "linen",
      },
      {
        src: "/photos/thumb-dining-teak.jpg",
        alt: "The dining room, with a teak table and a traditional cove ceiling",
        aspect: "141 / 235",
        tone: "brass",
      },
      {
        src: "/photos/thumb-bathroom-pink.jpg",
        alt: "A guest bathroom finished in blush tile",
        aspect: "141 / 176",
        tone: "oak",
      },
    ],
  },
  {
    slug: "apartment-on-cathedral-road",
    ref: "NI–24–05",
    name: "Apartment on Cathedral Road",
    location: "Chennai",
    year: "2024",
    typology: "Residence",
    summary: "Two flats joined into one, around a single long window.",
    brief: [
      "Two adjacent flats on the ninth floor, bought a year apart. The brief was one home, and one uninterrupted view west across the Adyar.",
      "We put everything that needed a wall along the east side — kitchen, utility, two bathrooms, storage — and left the west edge entirely clear. Living room, dining and study now read as one fourteen-metre room with a window down its whole length.",
      "Blinds are linen, not roller. In Chennai the afternoon light needs softening, not blocking.",
    ],
    materials: [
      "Lime-washed walls",
      "Teak veneer",
      "Kota stone",
      "Linen",
      "Brass",
    ],
    specs: [
      { label: "Location", value: "Chennai" },
      { label: "Completed", value: "2024" },
      { label: "Area", value: "2,400 sq ft" },
      { label: "Typology", value: "Residence" },
      { label: "Scope", value: "Combination and full interiors" },
    ],
    cover: {
      src: "/photos/home-theatre-cream-b.webp",
      alt: "A media room built into the combined apartment",
      aspect: "1280 / 960",
      tone: "linen",
    },
    gallery: [
      {
        src: "/photos/bedroom-render-design.webp",
        alt: "A bedroom suite on the apartment's quiet side",
        aspect: "1080 / 608",
        tone: "linen",
      },
      {
        src: "/photos/thumb-kitchen-bar.jpg",
        alt: "A breakfast counter with pendant lighting",
        aspect: "141 / 101",
        tone: "oak",
      },
      {
        src: "/photos/thumb-bedroom-blue.jpg",
        alt: "A guest bedroom in soft blue linen",
        aspect: "141 / 101",
        tone: "stone",
      },
    ],
  },
  {
    slug: "the-weavers-house",
    ref: "NI–23–01",
    name: "The Weavers' House",
    location: "Kanchipuram",
    year: "2023",
    typology: "Restoration",
    summary: "A silk-weaving family's house, with the looms kept in place.",
    brief: [
      "Three generations of the family have woven in the front two rooms. The pit looms stay. Everything else was negotiable.",
      "We rebuilt the rear of the house — kitchen, bathrooms, a courtyard for washing and drying — and left the loom rooms structurally untouched, improving only the light. Two clerestory openings on the north wall now give even, non-directional light onto the warp, which is what the work needs.",
      "The house is not a museum. It is a workplace with a family living behind it.",
    ],
    materials: [
      "Country brick",
      "Lime plaster",
      "Reclaimed teak",
      "Athangudi tile",
      "Terracotta",
    ],
    specs: [
      { label: "Location", value: "Kanchipuram" },
      { label: "Completed", value: "2023" },
      { label: "Area", value: "3,100 sq ft" },
      { label: "Typology", value: "Restoration" },
      { label: "Scope", value: "Rear rebuild, loom room light" },
    ],
    cover: {
      src: "/photos/kitchen-render-blue.webp",
      alt: "The rebuilt kitchen, visualised before construction",
      aspect: "1080 / 608",
      tone: "oak",
    },
    gallery: [
      {
        src: "/photos/bedroom-under-construction.webp",
        alt: "The rear of the house, mid-rebuild",
        aspect: "575 / 1020",
        tone: "linen",
      },
      {
        src: "",
        alt: "The new rear courtyard for washing and drying",
        aspect: "3 / 4",
        tone: "stone",
      },
      {
        src: "",
        alt: "Reclaimed teak door in a country brick wall",
        aspect: "4 / 3",
        tone: "shade",
      },
    ],
  },
  {
    slug: "cardamom-house",
    ref: "NI–23–04",
    name: "Cardamom House",
    location: "Munnar, Kerala",
    year: "2023",
    typology: "Hospitality",
    summary: "Eight rooms in a working cardamom estate.",
    brief: [
      "The owners run forty acres of cardamom and wanted eight guest rooms that did not pretend the estate was not there.",
      "Rooms sit in two rows along the contour, so every one looks down the slope rather than at another room. Circulation is external and covered — you walk outside to get to dinner, under a roof, in the rain.",
      "Walls are local granite with a lime pointing. Glazing is minimal and deep-set: at sixteen hundred metres the weather does most of the talking.",
    ],
    materials: [
      "Local granite",
      "Lime pointing",
      "Rosewood",
      "Handloom cotton",
      "Copper",
    ],
    specs: [
      { label: "Location", value: "Munnar, Kerala" },
      { label: "Completed", value: "2023" },
      { label: "Area", value: "8,500 sq ft" },
      { label: "Typology", value: "Hospitality" },
      { label: "Scope", value: "Eight rooms and dining" },
    ],
    cover: {
      src: "/photos/home-theatre-curved.webp",
      alt: "A guest lounge with curved, softly lit walls",
      aspect: "1040 / 473",
      tone: "shade",
    },
    gallery: [
      {
        src: "/photos/thumb-home-theatre.jpg",
        alt: "A screening room for guests",
        aspect: "141 / 101",
        tone: "stone",
      },
      {
        src: "",
        alt: "Deep-set window opening onto the cardamom slope",
        aspect: "3 / 4",
        tone: "oak",
      },
      {
        src: "",
        alt: "Copper basin against dry-laid granite",
        aspect: "4 / 3",
        tone: "brass",
      },
    ],
  },
  {
    slug: "studio-on-millers-road",
    ref: "NI–22–03",
    name: "Studio on Millers Road",
    location: "Bengaluru",
    year: "2022",
    typology: "Workplace",
    summary: "A design practice's own office, built in nine weeks.",
    brief: [
      "A first-floor shell above a tyre shop, taken on a short lease with a fixed, small budget and a hard date.",
      "Nothing is built in. The long work table, the plan chest, the library wall and the meeting table are free-standing and were made off-site in plywood and steel. If the practice moves, the office moves with it.",
      "The only permanent work was to the ceiling: we removed a false ceiling, found a three-and-a-half-metre slab, and left it raw.",
    ],
    materials: [
      "Birch ply",
      "Mild steel",
      "Existing concrete",
      "Cotton dhurrie",
      "Brass",
    ],
    specs: [
      { label: "Location", value: "Bengaluru" },
      { label: "Completed", value: "2022" },
      { label: "Area", value: "1,800 sq ft" },
      { label: "Typology", value: "Workplace" },
      { label: "Scope", value: "Fit-out, free-standing" },
    ],
    cover: {
      src: "/photos/wardrobe-white-wood.webp",
      alt: "Free-standing joinery, shown against a bare wall",
      aspect: "736 / 981",
      tone: "oak",
    },
    gallery: [
      {
        src: "/photos/thumb-living-dining.jpg",
        alt: "The open shell before the fit-out went in",
        aspect: "141 / 235",
        tone: "linen",
      },
      {
        src: "/photos/thumb-tv-unit.jpg",
        alt: "A media wall built from the same plywood as the rest of the fit-out",
        aspect: "141 / 101",
        tone: "oak",
      },
      {
        src: "/photos/thumb-living-green.jpg",
        alt: "A seating corner beside the library wall",
        aspect: "141 / 101",
        tone: "shade",
      },
    ],
  },
  {
    slug: "lime-and-teak-residence",
    ref: "NI–22–06",
    name: "Lime and Teak Residence",
    location: "Fort Kochi",
    year: "2022",
    typology: "Residence",
    summary: "A narrow plot house that cools itself.",
    brief: [
      "Five metres wide, twenty-six deep, with buildings hard on both sides. The only usable light and air come from the two short ends and from above.",
      "A stair courtyard sits at the centre of the plan and runs the full height of the house, open at the top under a louvred cover. Warm air leaves through it; the ground floor stays noticeably cooler than the street.",
      "Walls are lime plaster over country brick — vapour-open, and forgiving of the salt that comes off the water three streets away.",
    ],
    materials: [
      "Country brick",
      "Lime plaster",
      "Burma teak",
      "Mangalore tile",
      "Brass",
    ],
    specs: [
      { label: "Location", value: "Fort Kochi" },
      { label: "Completed", value: "2022" },
      { label: "Area", value: "4,000 sq ft" },
      { label: "Typology", value: "Residence" },
      { label: "Scope", value: "New build and interiors" },
    ],
    cover: {
      src: "/photos/kitchen-sky-blue.webp",
      alt: "A kitchen finished in glazed cabinetry",
      aspect: "765 / 1020",
      tone: "linen",
    },
    gallery: [
      {
        src: "/photos/thumb-kitchen-beige.jpg",
        alt: "A second kitchen, kept narrow to fit the plot",
        aspect: "141 / 101",
        tone: "stone",
      },
      {
        src: "/photos/thumb-kitchen-pink.jpg",
        alt: "The kitchen counter, finished in dark stone",
        aspect: "1 / 1",
        tone: "oak",
      },
      {
        src: "",
        alt: "Brass pull on a teak door",
        aspect: "3 / 4",
        tone: "brass",
      },
    ],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
