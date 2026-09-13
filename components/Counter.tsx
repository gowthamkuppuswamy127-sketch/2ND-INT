"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

const DURATION = 1400;

/** Splits "35+" into a target of 35 and a static suffix of "+". Values that
    don't open with a digit (there are none today, but content is free text)
    render as-is rather than animating. */
function parse(value: string) {
  const match = value.match(/^(\d+)(.*)$/);
  if (!match) return null;
  return { target: Number(match[1]), suffix: match[2] };
}

/**
 * Counts up from zero when scrolled into view. The animated span is
 * aria-hidden with a static sr-only twin beside it, so a screen reader
 * never has to guess whether it landed mid-count.
 */
export default function Counter({
  value,
  className = "",
}: {
  value: string;
  className?: string;
}) {
  const parsed = parse(value);
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(parsed ? `0${parsed.suffix}` : value);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    // Reduced motion is handled at render time below (`shown`), not here —
    // an effect that does nothing but setState the already-known final
    // value on every relevant render is exactly what
    // react-hooks/set-state-in-effect warns about.
    if (!parsed || reducedMotion) return;

    const element = ref.current;
    if (!element) return;

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / DURATION, 1);
          const eased = progress === 1 ? 1 : 1 - 2 ** (-10 * progress);
          setDisplay(`${Math.round(eased * parsed.target)}${parsed.suffix}`);
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
    // `parsed` is re-derived from `value` every render; re-running the
    // effect when `value` changes keeps the two in sync.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion, value]);

  if (!parsed) return <span className={className}>{value}</span>;

  const shown = reducedMotion ? value : display;

  return (
    <span className={className}>
      <span ref={ref} aria-hidden="true">
        {shown}
      </span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
