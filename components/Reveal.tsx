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
  className?: string;
};

export default function Reveal({
  children,
  delay = 0,
  direction = "up",
  className = "",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

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
  }, [reducedMotion]);

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
