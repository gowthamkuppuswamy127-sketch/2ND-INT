import MediaFrame from "./MediaFrame";
import { projects } from "@/content/projects";
import type { MediaSlot } from "@/lib/media";

/** Every tile shares the row's height; width falls out of each photo's own
    aspect ratio, so a wide shot reads as a broad tile and a portrait one as
    a narrow strip — nothing here is ever cropped to a size it doesn't fit. */
const ROW_HEIGHT = "h-40 sm:h-56";

/** Renders a slot list twice back-to-back and marks the repeat's tiles
    aria-hidden — a marquee's whole second copy exists only so the loop has
    no seam, and a screen reader has no reason to hear every photo twice. */
function Row({
  slots,
  direction,
}: {
  slots: MediaSlot[];
  direction?: "right";
}) {
  return (
    <div className={`marquee-row overflow-hidden ${ROW_HEIGHT}`}>
      <div
        className={`marquee-track flex w-max gap-4 ${ROW_HEIGHT}`}
        data-direction={direction}
      >
        {[slots, slots].map((set, copy) => (
          <div
            key={copy}
            className={`flex gap-4 ${ROW_HEIGHT}`}
            aria-hidden={copy === 1}
          >
            {set.map((slot, i) => (
              <div
                key={i}
                style={{ aspectRatio: slot.aspect }}
                className={`${ROW_HEIGHT} shrink-0`}
              >
                <MediaFrame slot={slot} sizes="18rem" className="h-full" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Two rows of project photography scrolling continuously in opposite
 * directions — paused on hover/focus (globals.css), and reduced to a single
 * static frame under prefers-reduced-motion by the same global rule every
 * other animation in the site respects.
 */
export default function GalleryMarquee() {
  const top = projects.map((p) => p.cover);
  const bottom = projects.map((p) => p.gallery[0]).filter(Boolean);

  return (
    <div className="space-y-4">
      <Row slots={top} />
      <Row slots={bottom} direction="right" />
    </div>
  );
}
