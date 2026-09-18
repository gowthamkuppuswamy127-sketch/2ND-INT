"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

const OFFSETS = {
  up: { x: "0", y: "14px" },
  left: { x: "-22px", y: "0" },
  right: { x: "22px", y: "0" },
} as const;

type Props = {
  children: React.ReactNode;
  /** Stagger, in ms. */
  delay?: number;
  /** Which edge the content drifts in from. Elementor's classic "Fade In
      Left/Right/Up" set — used to give alternating photo/text rows a sense
      of the two sides settling toward each other. */
  direction?: keyof typeof OFFSETS;
  /**
   * For content that is already on screen when the page opens — a page
   * header, the plate beside it. Renders with no reveal wiring at all, so
   * the content is simply visible at first paint.
   *
   * The hidden state is set by a render-blocking stylesheet rule keyed on
   * `.js`, which lands before any component code runs. For anything below
   * the fold that is exactly right. For the first screenful it meant the
   * heading a visitor was waiting for stayed at `opacity: 0` until React had
   * hydrated, an IntersectionObserver had fired and a 700ms transition had
   * finished — measured on /studio and /contact, that put LCP near a full
   * second on pages whose entire payload is under 90KB.
   */
  immediate?: boolean;
  className?: string;
};

export default function Reveal({
  children,
  delay = 0,
  direction = "up",
  immediate = false,
  className = "",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion || immediate) return;

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [reducedMotion, immediate]);

  // No `data-reveal`, so the stylesheet's hidden state never matches it and
  // the content paints with everything else. The wrapper still renders, so
  // the surrounding layout (grid cells, flex children) is unchanged.
  if (immediate) {
    return <div className={className}>{children}</div>;
  }

  const shown = seen || reducedMotion;
  const offset = OFFSETS[direction];

  return (
    <div
      ref={ref}
      data-reveal
      data-shown={shown ? "true" : "false"}
      style={{
        transitionDelay: delay ? `${delay}ms` : undefined,
        "--reveal-x": offset.x,
        "--reveal-y": offset.y,
      } as React.CSSProperties}
      className={className}
    >
      {children}
    </div>
  );
}
