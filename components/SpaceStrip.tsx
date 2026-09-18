import MediaFrame from "./MediaFrame";
import Reveal from "./Reveal";
import { home } from "@/content/studio";
import { homeSpaces } from "@/lib/media";

/**
 * Two rows of unequal pairs — a wide plate beside a narrower one, then the
 * pattern flipped on the row below (kitchen+dining, then bath+bedroom) —
 * instead of four equal columns. Every plate is still landscape; a shared
 * height per breakpoint (not the aspect value) is what actually fixes each
 * row's proportions, so the width split alone carries the rhythm.
 *
 * Copy comes from `home.spaces.items`, photography from `homeSpaces`, paired
 * by index.
 */
const SPANS = ["sm:col-span-7", "sm:col-span-5", "sm:col-span-5", "sm:col-span-7"];
const FRAME_HEIGHT = "h-[240px] sm:h-[280px] lg:h-[360px]";

export default function SpaceStrip() {
  return (
    <ul className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-12">
      {home.spaces.items.map((item, i) => (
        <li key={item.tag} className={`flex min-w-0 ${SPANS[i]}`}>
          <Reveal delay={i * 90} className="flex min-w-0 flex-1 flex-col">
            <MediaFrame
              slot={homeSpaces[i]}
              sizes="(min-width: 1024px) 45vw, (min-width: 640px) 55vw, 100vw"
              className={FRAME_HEIGHT}
            >
              <span className="label absolute right-2 top-2 bg-page px-2.5 py-1.5 text-ink md:right-3 md:top-3">
                {item.tag}
              </span>
            </MediaFrame>

            <div className="mt-4 flex flex-col gap-1 sm:flex-row sm:items-start sm:gap-4">
              <p className="label shrink-0 tabular-nums">
                /{String(i + 1).padStart(2, "0")}
              </p>
              <p className="max-w-[32ch] text-[0.8125rem] leading-relaxed text-ink-muted sm:text-[0.875rem]">
                {item.caption}
              </p>
            </div>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
