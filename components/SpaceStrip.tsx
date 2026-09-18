import MediaFrame from "./MediaFrame";
import Reveal from "./Reveal";
import { home } from "@/content/studio";
import { homeSpaces } from "@/lib/media";

/**
 * The four plates as a tight cinematic filmstrip: wide 16:9 frames pulled
 * flush against each other with only a hairline gap, tag and caption both
 * burned into the plate itself over a bottom scrim rather than living in
 * external caption text. Reads as one continuous reel rather than four
 * separate cards.
 *
 * Copy comes from `home.spaces.items`, photography from `homeSpaces`, paired
 * by index.
 */
export default function SpaceStrip() {
  return (
    <ul className="grid grid-cols-2 gap-[2px] md:grid-cols-4">
      {home.spaces.items.map((item, i) => (
        <li key={item.tag} className="flex">
          <Reveal delay={i * 90} className="flex flex-1">
            <MediaFrame
              slot={homeSpaces[i]}
              sizes="(min-width: 768px) 25vw, 50vw"
              className="flex-1"
            >
              <span className="label absolute right-2 top-2 bg-page px-2.5 py-1.5 text-ink md:right-3 md:top-3">
                {item.tag}
              </span>

              {/* Scrim + caption burned into the plate, bottom-anchored —
                  the filmstrip has no room below the image for a separate
                  caption row. */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent px-3 pb-2.5 pt-8 md:px-4 md:pb-3">
                <p className="label text-white/70">
                  /{String(i + 1).padStart(2, "0")}
                </p>
                <p className="mt-0.5 max-w-[28ch] text-[0.8125rem] leading-snug text-white md:text-[0.875rem]">
                  {item.caption}
                </p>
              </div>
            </MediaFrame>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
