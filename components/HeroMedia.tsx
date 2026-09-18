"use client";

import Image from "next/image";
import Link from "next/link";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { TONE_FIELDS, type MediaSlot } from "@/lib/media";

/** `navigator.connection` is still unshipped in Safari, so it's read
    defensively rather than typed as always-present. */
type ConnectionInfo = { saveData?: boolean; effectiveType?: string };

type Props = {
  /** Muted, looping, decorative footage. Fetched only once the checks in the
      effect below pass — the poster carries the hero on its own otherwise. */
  videoSrc: string;
  /** The video's own opening frame. Rendered through next/image (so it is
      served as an optimised, correctly-sized webp/avif) and marked `preload`,
      which makes it the LCP element: the hero is a finished picture at first
      paint, and the video, when it arrives, starts on the same frame. */
  poster: MediaSlot;
  /** The page's `<h1>`. */
  heroText: ReactNode;
  cta?: { href: string; label: string };
  /** Small cue under the hero saying there's more below. Decorative. */
  scrollCue?: string;
};

/**
 * The home page hero: one full-bleed picture that starts moving.
 *
 * This replaced a scroll-hijacking "expand on scroll" treatment. That version
 * opened with the headline at `opacity: 0` and the footage in a 300x400 card,
 * and only assembled itself once the visitor had scrolled through a wheel
 * handler that called `preventDefault()` and `window.scrollTo(0, 0)` on every
 * event. Three things were wrong with it and all three are fixed here:
 *
 *   1. The hero arrived in pieces — backdrop first, headline and button only
 *      after React had hydrated and framer-motion had run. Everything now
 *      ships in the served HTML and rises in on one shared CSS animation
 *      (`.hero-in`), so headline, button and cue appear together, in the same
 *      beat, whether or not JavaScript ever loads.
 *   2. It fought the scroll. Nothing here listens to wheel, touch or scroll
 *      at all, so the page scrolls natively at full frame rate.
 *   3. It re-rendered on every wheel tick and re-registered five listeners
 *      each time. There is no per-frame state left to re-render.
 */
export default function HeroMedia({
  videoSrc,
  poster,
  heroText,
  cta,
  scrollCue,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [posterFailed, setPosterFailed] = useState(false);

  // `src` is assigned here and never as a JSX attribute. This component is
  // statically prerendered, so a src written into JSX ships in the served
  // HTML and the browser starts fetching it while it is still parsing the
  // document — ahead of the poster that the hero actually needs first.
  // Assigning it after mount also means the request never fires at all for
  // the visitors screened out below.
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !videoSrc) return;

    // Decorative footage is not worth 2.5MB to someone who asked for less
    // motion or is paying for their bytes. The poster is the frame this
    // video opens on, so opting out costs nothing but the movement.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const connection = (navigator as Navigator & { connection?: ConnectionInfo })
      .connection;
    if (connection?.saveData) return;
    if (connection?.effectiveType && /(^|-)2g$/.test(connection.effectiveType)) {
      return;
    }

    const handleReady = () => {
      setVideoReady(true);
      // Autoplay can still be refused (a browser-level setting, low power
      // mode). The poster is already on screen underneath, so a rejection
      // needs no handling beyond not throwing.
      void el.play().catch(() => {});
    };

    // Held until the page has finished loading. Started on mount instead, the
    // video's first bytes go out while the poster — the LCP element, and the
    // thing the visitor is waiting to see — is still in flight, and the two
    // share the connection: measured on a phone profile, kicking it off at
    // mount pushed LCP from ~360ms to ~840ms for footage nobody can watch
    // until it is decoded anyway.
    let cancelled = false;
    const start = () => {
      if (cancelled) return;
      el.addEventListener("canplay", handleReady);
      el.src = videoSrc;
      el.load();
    };

    if (document.readyState === "complete") {
      start();
    } else {
      window.addEventListener("load", start, { once: true });
    }

    return () => {
      cancelled = true;
      window.removeEventListener("load", start);
      el.removeEventListener("canplay", handleReady);
    };
  }, [videoSrc]);

  const posterOk = Boolean(poster.src) && !posterFailed;

  return (
    /* overflow-hidden, not a height cap: the layers below are sized in dvh,
       which moves as a mobile address bar shows and hides. Clipping to this
       box means that movement can never paint into the section underneath. */
    <section className="relative isolate flex min-h-[86dvh] items-end overflow-hidden md:min-h-[100dvh] md:items-center">
      {posterOk ? (
        <Image
          src={poster.src}
          alt={poster.alt}
          fill
          preload
          sizes="100vw"
          className="-z-10 object-cover"
          onError={() => setPosterFailed(true)}
        />
      ) : (
        /* Same never-broken idiom as <MediaFrame>: a missing or 404'd asset
           falls back to a tonal plate rather than a broken-image box. */
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10"
          style={{ backgroundImage: TONE_FIELDS[poster.tone] }}
        />
      )}

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
        className={`pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover transition-opacity duration-700 ${
          videoReady ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Two scrims, not one. The flat tint holds the whole frame down so the
          header's light type clears contrast over any part of the picture;
          the gradient adds weight only where the headline actually sits, so
          a bright marble floor underneath it can't wash the type out. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-ink/35" />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-gradient-to-t from-ink/80 via-ink/35 to-transparent md:h-full md:from-ink/60 md:via-ink/25"
      />

      {/* One wrapper, one animation. Headline, button and cue are all inside
          it, so they arrive as a single beat rather than a stagger — and the
          animation is CSS off page load, not JS off hydration. */}
      <div className="hero-in shell relative w-full pb-16 pt-32 text-left md:pb-24 md:text-center">
        <h1 className="display-hero max-w-none text-[2.25rem] text-page [text-shadow:0_2px_28px_rgb(0_0_0_/_0.45)] md:mx-auto md:max-w-[15ch]">
          {heroText}
        </h1>

        {cta && (
          <Link
            href={cta.href}
            className="label btn-outline mt-7 inline-block md:mt-9"
          >
            {cta.label}
          </Link>
        )}

        {scrollCue && (
          <p
            aria-hidden="true"
            className="label mt-12 flex items-center gap-2 text-page/90 md:mt-16 md:justify-center"
          >
            {scrollCue}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="animate-cue size-4"
            >
              <path d="M12 5v14M6 13l6 6 6-6" />
            </svg>
          </p>
        )}
      </div>
    </section>
  );
}
