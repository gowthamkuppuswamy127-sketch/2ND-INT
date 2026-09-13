"use client";

import { useEffect, useState } from "react";
import { home } from "@/content/studio";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

const AUTOPLAY_MS = 6000;

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

/* Two stacked star rows, the top one clipped to the rated percentage —
   cheaper than five separately-filled icons and reads identically. */
function Stars({ value, of }: { value: string; of: string }) {
  const percent = Math.max(
    0,
    Math.min(100, (Number(value) / Number(of)) * 100),
  );
  const row = (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" aria-hidden="true" className="size-3.5">
          <path
            fill="currentColor"
            d="M10 1.4 12.5 7l6.1.7-4.5 4.2 1.2 6-5.3-3-5.3 3 1.2-6-4.5-4.2L7.5 7 10 1.4Z"
          />
        </svg>
      ))}
    </div>
  );

  return (
    <span aria-hidden="true" className="relative inline-flex text-rule">
      {row}
      <span
        className="absolute inset-y-0 left-0 overflow-hidden text-brass"
        style={{ width: `${percent}%` }}
      >
        {row}
      </span>
    </span>
  );
}

/**
 * A single active quote, cross-faded rather than carted sideways — the
 * quotes vary a good deal in length, and a slide makes that visible as a
 * wobble. Autoplay pauses on hover/focus and never runs at all under
 * reduced motion; the arrows always work regardless.
 */
export default function Testimonials() {
  const { items, rating } = home.testimonials;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const count = items.length;

  useEffect(() => {
    if (reducedMotion || paused) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [reducedMotion, paused, count]);

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="flex flex-wrap items-end justify-between gap-6">
        <p aria-hidden="true" className="display-hero text-[3.5rem] leading-none text-brass/30">
          “
        </p>

        <div className="flex items-center gap-3">
          <p className="text-3xl font-semibold tabular-nums text-ink">
            {rating.value}
          </p>
          <div>
            <Stars value={rating.value} of={rating.of} />
            <p className="mt-1 text-[0.75rem] text-ink-muted">{rating.label}</p>
          </div>
        </div>
      </div>

      <div className="relative min-h-[11rem] -mt-2 sm:min-h-[8rem]">
        {items.map((item, i) => (
          <blockquote
            key={item.name}
            aria-hidden={i !== index}
            className={`transition-opacity duration-500 ${
              i === index
                ? "opacity-100"
                : "pointer-events-none absolute inset-0 top-0 opacity-0"
            }`}
          >
            <p className="max-w-[46ch] text-xl leading-relaxed text-ink sm:text-2xl">
              {item.quote}
            </p>
            <footer className="mt-6 flex items-center gap-3">
              <p className="text-[0.9375rem] font-semibold text-ink">
                {item.name}
              </p>
              <span aria-hidden="true" className="h-px w-6 bg-rule" />
              <p className="text-[0.8125rem] text-ink-muted">{item.detail}</p>
            </footer>
          </blockquote>
        ))}
      </div>

      <div className="mt-10 flex items-center gap-6">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIndex((i) => (i - 1 + count) % count)}
            aria-label="Previous testimonial"
            className="flex size-11 items-center justify-center border border-ink text-ink transition-colors duration-300 hover:bg-ink hover:text-page"
          >
            <Arrow back />
          </button>
          <button
            type="button"
            onClick={() => setIndex((i) => (i + 1) % count)}
            aria-label="Next testimonial"
            className="flex size-11 items-center justify-center border border-ink bg-ink text-page transition-colors duration-300 hover:bg-transparent hover:text-ink"
          >
            <Arrow />
          </button>
        </div>

        <p aria-hidden="true" className="label tabular-nums">
          {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
        </p>
      </div>
    </div>
  );
}
