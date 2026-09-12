import MediaFrame from "./MediaFrame";
import Reveal from "./Reveal";
import { home } from "@/content/studio";
import { homeSpaces } from "@/lib/media";

/**
 * The four plates as a stepped row: two near the top, the third lifted and
 * taller, the fourth dropped below both. The offsets apply from md up only —
 * on a stacked or paired layout a stagger reads as broken alignment rather
 * than as rhythm.
 *
 * Copy comes from `home.spaces.items`, photography from `homeSpaces`, paired
 * by index.
 */
const OFFSETS = ["", "md:mt-14", "md:-mt-10", "md:mt-24"];

export default function SpaceStrip() {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-5 md:gap-y-12">
      {home.spaces.items.map((item, i) => (
        <li key={item.tag} className={`flex ${OFFSETS[i]}`}>
          <Reveal delay={i * 90} className="flex flex-1 flex-col">
            <MediaFrame
              slot={homeSpaces[i]}
              sizes="(min-width: 768px) 23vw, (min-width: 640px) 45vw, 100vw"
            >
              {/* Page-coloured — 16.7:1 on ink. Held off the corner so a
                  sliver of plate always frames it: flush, its fill meets the
                  ground and the tag reads as a bite out of the plate rather
                  than a label on it. */}
              <span className="label absolute right-2 top-2 bg-page px-2.5 py-1.5 text-ink md:right-3 md:top-3">
                {item.tag}
              </span>
            </MediaFrame>

            {/* Paired up, plates in a row are different heights, so captions
                hang from the bottom of the row — otherwise a taller plate
                drops its caption below its neighbour's and the numbering
                reads out of order. From md the row is the stagger itself, and
                each caption sits under its own plate again. */}
            <div className="mt-auto flex flex-col gap-1 pt-4 sm:flex-row sm:items-start sm:gap-4 md:mt-4 md:pt-0">
              <p className="label shrink-0 tabular-nums">
                /{String(i + 1).padStart(2, "0")}
              </p>
              <p className="max-w-[26ch] text-[0.8125rem] leading-relaxed text-ink-muted sm:text-[0.875rem]">
                {item.caption}
              </p>
            </div>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
