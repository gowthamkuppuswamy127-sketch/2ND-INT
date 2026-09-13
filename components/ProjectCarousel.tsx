"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import MediaFrame from "./MediaFrame";
import Reveal from "./Reveal";
import type { Project } from "@/content/projects";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

/**
 * Cards alternate between two sizes so the strip steps along rather than
 * tiling. The aspect overrides whatever the project's own cover carries,
 * because here the rhythm of the row matters more than the crop.
 */
const CARDS = [
  { width: "w-[74vw] sm:w-[40vw] lg:w-[19rem]", aspect: "4 / 5" },
  { width: "w-[82vw] sm:w-[48vw] lg:w-[24rem]", aspect: "4 / 3" },
];

function Arrow({ back = false }: { back?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      className={`mx-auto h-4 w-4 ${back ? "rotate-180" : ""}`}
    >
      <path d="M3 12h18M14 5l7 7-7 7" />
    </svg>
  );
}

/**
 * A horizontally scrolled index of the work. Scrolling is native — swipe on
 * touch, shift-wheel or trackpad on a pointer, and tabbing a card scrolls it
 * into view — so the arrows are an enhancement. They're hidden without
 * JavaScript by the `[data-carousel-controls]` rule in globals.css.
 *
 * The section heading is passed in as children so the copy stays on the page
 * with the rest of it; the arrows have to live here, beside the ref.
 */
export default function ProjectCarousel({
  projects,
  children,
}: {
  projects: Project[];
  children: React.ReactNode;
}) {
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);
  const reducedMotion = usePrefersReducedMotion();

  const sync = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    // A pixel of slack at each end: sub-pixel layout means scrollLeft rarely
    // lands on the exact bound.
    setAtStart(el.scrollLeft <= 1);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
  }, []);

  // Both ends can be true at once — a viewport wide enough to hold every card
  // leaves nothing to scroll, and both arrows correctly go dead.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(el);
    return () => observer.disconnect();
  }, [sync]);

  function step(direction: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;

    // Card widths vary, so move to the next card edge rather than by a fixed
    // distance. Rects are viewport-relative; subtracting the scroller's own
    // origin converts them back into scrollLeft values.
    const origin = el.getBoundingClientRect().left - el.scrollLeft;
    const edges = Array.from(el.children).map(
      (card) => card.getBoundingClientRect().left - origin,
    );

    const left =
      direction === 1
        ? edges.find((edge) => edge > el.scrollLeft + 1)
        : edges.reverse().find((edge) => edge < el.scrollLeft - 1);

    el.scrollTo({
      left: left ?? (direction === 1 ? el.scrollWidth : 0),
      behavior: reducedMotion ? "auto" : "smooth",
    });
  }

  const arrow =
    "flex size-12 items-center justify-center border border-ink transition-colors duration-300 disabled:border-rule disabled:text-ink-muted/50";

  return (
    <>
      <Reveal>
        <div className="flex items-end justify-between gap-6 border-b border-rule pb-6">
          <div>{children}</div>

          <div data-carousel-controls className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => step(-1)}
              disabled={atStart}
              aria-label="Previous projects"
              className={`${arrow} text-ink hover:bg-ink hover:text-page disabled:hover:bg-transparent`}
            >
              <Arrow back />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              disabled={atEnd}
              aria-label="Next projects"
              className={`${arrow} bg-ink text-page hover:bg-transparent hover:text-ink disabled:bg-transparent`}
            >
              <Arrow />
            </button>
          </div>
        </div>
      </Reveal>

      {/* The vertical padding is cancelled by the matching negative margin: it
          exists so a focus ring on a card isn't clipped by the scroll box.
          The right margin lets the strip run off the edge of the page, which
          is what says there is more of it. */}
      <div className="mt-10 md:mt-14">
        <ul
          ref={scrollerRef}
          onScroll={sync}
          className="no-scrollbar -my-2 -mr-5 flex snap-x snap-mandatory gap-5 overflow-x-auto py-2 sm:-mr-8 md:-mr-10"
        >
          {projects.map((project, i) => {
            const card = CARDS[i % CARDS.length];

            return (
              <li
                key={project.slug}
                className={`${card.width} shrink-0 snap-start`}
              >
                <Link
                  href={`/projects/${project.slug}`}
                  className="group block"
                >
                  <MediaFrame
                    slot={{ ...project.cover, aspect: card.aspect }}
                    sizes="(min-width: 1024px) 24rem, (min-width: 640px) 48vw, 82vw"
                    zoom
                  >
                    {/* Decorative: the link already announces the project. */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                    >
                      <span className="label flex size-24 items-center justify-center rounded-full bg-page/90 text-ink">
                        View
                      </span>
                    </span>
                  </MediaFrame>

                  <div className="mt-5 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="display-sm transition-transform duration-300 ease-out group-hover:translate-x-1 group-focus-visible:translate-x-1">
                        {project.name}
                      </h3>
                      <p className="label mt-2">{project.location}</p>
                    </div>
                    <p className="label shrink-0 tabular-nums">{project.year}</p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
