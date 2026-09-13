"use client";

import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  window.addEventListener("resize", onChange, { passive: true });
  return () => {
    window.removeEventListener("scroll", onChange);
    window.removeEventListener("resize", onChange);
  };
}

function getProgress() {
  const { scrollTop, scrollHeight, clientHeight } =
    document.documentElement;
  const max = scrollHeight - clientHeight;
  return max > 0 ? Math.min(1, Math.max(0, scrollTop / max)) : 0;
}

/**
 * Two small pieces of global scroll chrome, kept in one component since
 * both read the same live scroll position: a hairline bar across the very
 * top of the viewport that fills as the page is read, and a
 * scroll-to-top button that appears once there's somewhere to go back to.
 * Both are `useSyncExternalStore`-driven — see Header's `useScrolledPastHero`
 * for why that's correct from the first client read rather than a render
 * behind.
 */
export default function ScrollChrome() {
  const progress = useSyncExternalStore(subscribe, getProgress, () => 0);
  const pastThreshold = useSyncExternalStore(
    subscribe,
    () => window.scrollY > 480,
    () => false,
  );

  return (
    <>
      <div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-50 h-0.5 bg-transparent"
      >
        <div
          className="h-full bg-brass transition-transform duration-150 ease-out"
          style={{
            transform: `scaleX(${progress})`,
            transformOrigin: "left",
          }}
        />
      </div>

      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
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
