"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { TONE_FIELDS, type MediaSlot } from "@/lib/media";

/** `navigator.connection` is still unshipped in Safari, so it's read
    defensively rather than typed as always-present. */
type ConnectionInfo = { saveData?: boolean; effectiveType?: string };

type Props = {
  src: string;
  poster: MediaSlot;
  className?: string;
};

/**
 * Full-bleed, muted autoplaying loop — the video counterpart to
 * <MediaFrame>. Reduced motion, a metered connection and a failed load all
 * rest on the poster frame (falling further back to its tonal field if that's
 * missing too), so this never shows a broken box.
 *
 * The footage is fetched only once the band is near the viewport. It used to
 * ship `<source src=…>` with `preload="auto"` in the prerendered HTML, which
 * meant the browser began pulling 4.7MB of video during the initial parse of
 * the home page — for a band that sits roughly six screens down, competing
 * for bandwidth with the hero the visitor was actually looking at. That one
 * request was the bulk of the page's 7.9MB load.
 */
export default function VideoBand({ src, poster, className = "" }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [wanted, setWanted] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  // Gate 1 — is this visitor owed a video at all?
  useEffect(() => {
    if (!src) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const connection = (navigator as Navigator & { connection?: ConnectionInfo })
      .connection;
    if (connection?.saveData) return;
    if (connection?.effectiveType && /(^|-)2g$/.test(connection.effectiveType)) {
      return;
    }

    const el = wrapRef.current;
    if (!el) return;

    // Gate 2 — are they anywhere near it? A screen of margin, so the fade is
    // already done by the time the band is actually reached.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setWanted(true);
      },
      { rootMargin: "100% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [src]);

  // Assigned here rather than in JSX for the same reason as <HeroMedia>: a
  // src in the markup is fetched during document parse, which is exactly what
  // this component is avoiding.
  useEffect(() => {
    const el = videoRef.current;
    if (!wanted || !el || failed) return;

    const handleReady = () => {
      setReady(true);
      void el.play().catch(() => {});
    };
    const handleError = () => setFailed(true);

    el.addEventListener("canplay", handleReady);
    el.addEventListener("error", handleError);
    el.src = src;
    el.load();

    return () => {
      el.removeEventListener("canplay", handleReady);
      el.removeEventListener("error", handleError);
    };
  }, [wanted, src, failed]);

  return (
    <div
      ref={wrapRef}
      className={`relative w-full overflow-hidden bg-surface ${className}`}
      style={{ aspectRatio: poster.aspect }}
    >
      {poster.src ? (
        <Image
          src={poster.src}
          alt={poster.alt}
          fill
          sizes="100vw"
          className="object-cover"
        />
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ backgroundImage: TONE_FIELDS[poster.tone] }}
        />
      )}

      {/* Sits over the poster and cross-fades in, so there is never a gap
          between the still and the motion — and never a blank box if the
          video is skipped or fails. */}
      {wanted && !failed && (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          aria-hidden="true"
          tabIndex={-1}
          controls={false}
          disablePictureInPicture
          disableRemotePlayback
          className={`pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            ready ? "opacity-100" : "opacity-0"
          }`}
        />
      )}

      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border border-rule"
      />
    </div>
  );
}
