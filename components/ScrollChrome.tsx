"use client";

import { useEffect, useRef, useState } from "react";

const SHOW_AFTER = 480;

/**
 * Two small pieces of global scroll chrome, kept in one component since both
 * read the same live scroll position: a hairline bar across the top of the
 * viewport that fills as the page is read, and a scroll-to-top button that
 * appears once there's somewhere to go back to.
 *
 * The progress bar is written straight to the DOM from a rAF callback rather
 * than held in React state. Driven through `useSyncExternalStore`, as it was,
 * the bar's fractional value changed on every scroll event, so the whole
 * component re-rendered at scroll frequency — on a long page that is hundreds
 * of renders per flick, all to set one transform. The button is a boolean and
 * genuinely does belong in state; it only changes twice per page.
 */
export default function ScrollChrome() {
  const barRef = useRef<HTMLDivElement>(null);
  const [pastThreshold, setPastThreshold] = useState(false);

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, doc.scrollTop / max)) : 0;

      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${progress})`;
      }
      // setState with an identical boolean is a no-op in React, so this
      // re-renders on the two crossings and nowhere else.
      setPastThreshold(doc.scrollTop > SHOW_AFTER);
    };

    // Coalesce every scroll and resize event in a frame into one read and one
    // write, which also keeps the layout read out of the event handler itself.
    const onChange = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onChange, { passive: true });
    window.addEventListener("resize", onChange, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onChange);
      window.removeEventListener("resize", onChange);
    };
  }, []);

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5 bg-transparent"
      >
        <div
          ref={barRef}
          className="h-full origin-left bg-brass"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      <button
        type="button"
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
              .matches
              ? "auto"
              : "smooth",
          })
        }
        aria-label="Back to top"
        aria-hidden={!pastThreshold}
        tabIndex={pastThreshold ? 0 : -1}
        className={`fixed bottom-6 right-5 z-40 flex size-11 items-center justify-center rounded-full border border-ink bg-page text-ink shadow-sm transition-[opacity,transform] duration-300 hover:bg-ink hover:text-page sm:bottom-8 sm:right-8 ${
          pastThreshold
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-2 opacity-0"
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="size-4"
        >
          <path d="M6 15l6-6 6 6" />
        </svg>
      </button>
    </>
  );
}
