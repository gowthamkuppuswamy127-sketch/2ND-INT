"use client";

import Image from "next/image";
import Link from "next/link";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { TONE_FIELDS, type MediaSlot } from "@/lib/media";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

/** `navigator.connection` is still unshipped in Safari, so it's read
    defensively rather than typed as always-present. */
type ConnectionInfo = { saveData?: boolean; effectiveType?: string };

/** Below this, the pin-and-grow treatment doesn't run at all — see the
    layout effect for why matching this against a real breakpoint check,
    rather than Tailwind's `md:` alone, matters here. */
const DESKTOP_QUERY = "(min-width: 768px)";

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
 * The home page hero.
 *
 * Mobile is one full-bleed picture that starts moving — see the mobile-only
 * notes below. Desktop (768px and up) additionally pins the frame while it
 * grows from a floating card into that same full-bleed picture as the
 * visitor scrolls — the "unboxing" effect the site had before, rebuilt.
 *
 * The earlier version of this effect was replaced outright rather than
 * fixed in place, because it had three unrelated bugs bundled into one
 * component: content hidden until an animation finished, JavaScript fighting
 * the browser's own scrolling, and a full React re-render on every wheel
 * tick. Rebuilding it here means solving each one on its own terms rather
 * than patching the version that caused them:
 *
 *   1. Content hidden until the animation finished. The old version held the
 *      headline and button at `opacity: 0` until scrolling had driven a
 *      `progress` value to exactly 1. Here the text block is a normal,
 *      always-visible child of the section — its position never depends on
 *      `progress`, only the card's size does. It ships visible in the
 *      server-rendered HTML and rises in on the `.hero-in` CSS animation,
 *      identically to the mobile hero, whether or not JavaScript ever runs.
 *
 *   2. JavaScript fighting the browser's scrolling. The old version called
 *      `e.preventDefault()` on wheel/touch events and manually accumulated a
 *      fake scroll position, then called `window.scrollTo(0, 0)` on real
 *      scroll events to hold the page in place — the page was never actually
 *      scrolling during the effect. Here the "hold in place" half of that is
 *      `position: sticky` on the pinned section, which is a one-line CSS
 *      declaration the browser handles natively; nothing here calls
 *      `preventDefault` or `scrollTo`. The visitor's scroll gesture is real
 *      and un-intercepted throughout — a fast flick blows straight through
 *      the whole effect, a slow scroll plays it out, and scrolling back up
 *      reverses it, all for free, because `progress` below is read from the
 *      real, current scroll position on every frame rather than accumulated
 *      from intercepted deltas.
 *
 *   3. A full re-render on every wheel tick. `progress` never touches React
 *      state. It is read from `getBoundingClientRect()` in a
 *      `requestAnimationFrame` callback — at most once per frame, coalescing
 *      however many scroll events fired since the last one — and written
 *      straight to the card's own `style`, the same rAF-batched, ref-driven
 *      pattern already used in `<ScrollChrome>` and `<Header>`.
 */
export default function HeroMedia({
  videoSrc,
  poster,
  heroText,
  cta,
  scrollCue,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
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

  // Drives the card's size from the real scroll position. Runs as a layout
  // effect rather than a plain one so the very first frame the browser paints
  // on the client already has the correct size for wherever the page happens
  // to be scrolled to (usually the top, i.e. small) — a plain effect would
  // paint once at the server's default (full-bleed) and visibly snap down a
  // frame later.
  //
  // Below the desktop breakpoint this leaves the card alone entirely: no
  // inline size is ever set, so the mobile CSS classes (full-bleed, no pin)
  // apply exactly as if this effect didn't exist. The same is true with
  // JavaScript disabled or not yet loaded on any device — the card's only
  // built-in state is full-bleed, so "nothing has run yet" and "this isn't
  // supported" both fail safe to the same finished-looking hero verified for
  // the no-JS case.
  useIsomorphicLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const card = cardRef.current;
    if (!wrapper || !card) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // The wrapper's extra scroll height exists only to give this effect
      // room to play out. With the effect off, that height would just be
      // dead space to scroll through for no visible change — collapsed by
      // the matching rule in globals.css, so nothing here needs to run.
      return;
    }

    // Re-measured on resize rather than assumed constant: the card's resting
    // size is proportional to the viewport, and the pin range depends on the
    // wrapper's own height, which the `md:h-[...]` class changes at the
    // breakpoint itself.
    //
    // These two formulas are deliberately identical to the `.js .hero-card`
    // rule in globals.css (min(42vw, 640px) / min(50vh, 460px)) — that rule
    // is what the card actually looks like at the moment this effect first
    // runs (progress 0, unscrolled), painted by the stylesheet rather than
    // this effect. Matching the numbers means this effect's first `apply()`
    // computes the exact same box the browser already painted, so there is
    // nothing to visibly correct on mount — only real scrolling moves it
    // away from here. Change one, change the other.
    let minWidth = 0;
    let minHeight = 0;
    const maxRadius = 28;

    const measure = () => {
      minWidth = Math.min(window.innerWidth * 0.42, 640);
      minHeight = Math.min(window.innerHeight * 0.5, 460);
    };

    let frame = 0;
    const apply = () => {
      frame = 0;

      if (!window.matchMedia(DESKTOP_QUERY).matches) {
        // Let the mobile classes fully own the card's size again — clears
        // whatever a wider viewport had written here before a resize down.
        card.style.width = "";
        card.style.height = "";
        card.style.margin = "";
        card.style.borderRadius = "";
        return;
      }

      // getBoundingClientRect() rather than a cached offsetTop: it reflects
      // the element's real position against the current viewport on every
      // call, which is what makes this self-correcting on resize and safe to
      // read from a rAF callback without separately tracking scroll deltas.
      const rect = wrapper.getBoundingClientRect();
      const pinRange = wrapper.offsetHeight - window.innerHeight;
      // -rect.top is exactly the distance the wrapper has scrolled past the
      // viewport's top edge — the same quantity `position: sticky` uses
      // internally to decide when to release, so this stays in lockstep with
      // the actual pin without the two ever being computed separately.
      const progress =
        pinRange > 0 ? Math.min(1, Math.max(0, -rect.top / pinRange)) : 1;

      const width = minWidth + progress * (window.innerWidth - minWidth);
      const height = minHeight + progress * (window.innerHeight - minHeight);

      // inset-0 (from the className) plus an explicit size smaller than that
      // box, plus auto margins, centers the card with no left/top/translate
      // arithmetic of its own — and degrades to exactly full-bleed the
      // moment width/height are cleared, with nothing else to unwind.
      card.style.margin = "auto";
      card.style.width = `${width}px`;
      card.style.height = `${height}px`;
      card.style.borderRadius = `${maxRadius * (1 - progress)}px`;
    };

    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(apply);
    };

    const onResize = () => {
      measure();
      schedule();
    };

    measure();
    apply();

    // Passive, and neither handler ever calls preventDefault or scrollTo —
    // the browser's own scrolling is never touched, only read.
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const posterOk = Boolean(poster.src) && !posterFailed;

  return (
    /* Mobile: wraps the section with no height of its own, so it has zero
       effect — the section below renders exactly as if this div weren't
       there. Desktop: stretched to 200dvh, giving the sticky section 100dvh
       of scroll room to release from before normal content resumes.
       `id` lets <Header> find it and time its own solid-background switch
       off the end of this hero rather than a fixed viewport fraction — see
       useScrolledPastHero in Header.tsx. */
    <div id="home-hero" ref={wrapperRef} className="relative md:h-[200dvh]">
      {/* overflow-hidden, not a height cap: the layers below are sized in
          dvh, which moves as a mobile address bar shows and hides. Clipping
          to this box means that movement can never paint into the section
          underneath. `hero-pin-stage` has no styling of its own — it exists
          so the reduced-motion rule in globals.css can un-stick this by
          class rather than by assuming this exact DOM shape. */}
      <section className="hero-pin-stage relative isolate flex min-h-[86dvh] items-end overflow-hidden md:sticky md:top-0 md:h-dvh md:min-h-0 md:items-center">
        {/* Desktop only, and only visible for as long as the card below is
            smaller than the viewport: whatever isn't yet covered by the
            growing card shows this instead of a hole. Mobile never sees it —
            the card there is always full-bleed. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 hidden md:block"
          style={{ backgroundImage: TONE_FIELDS.shade }}
        />

        {/* The card. `inset-0` makes it full-bleed by default — the mobile
            state, the no-JS state, and the reduced-motion state are all
            simply "nothing overrides this." The layout effect above adds an
            explicit width/height plus `margin: auto` to float it as a
            smaller, centred, rounded box, and removes them again to hand
            control straight back to `inset-0`. */}
        <div
          ref={cardRef}
          className="hero-card absolute inset-0 overflow-hidden md:shadow-2xl md:shadow-ink/40"
        >
          {posterOk ? (
            <Image
              src={poster.src}
              alt={poster.alt}
              fill
              preload
              sizes="100vw"
              className="object-cover"
              onError={() => setPosterFailed(true)}
            />
          ) : (
            /* Same never-broken idiom as <MediaFrame>: a missing or 404'd
               asset falls back to a tonal plate rather than a broken-image
               box. */
            <div
              aria-hidden="true"
              className="absolute inset-0"
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
            className={`pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              videoReady ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Two scrims, not one. The flat tint holds the whole frame down so
              the header's light type clears contrast over any part of the
              picture; the gradient adds weight only where the headline
              actually sits, so a bright marble floor underneath it can't
              wash the type out. Nested inside the card (rather than the
              section) so they resize and clip to its rounded corners exactly
              together with the photo underneath, at every size in between. */}
          <div aria-hidden="true" className="absolute inset-0 bg-ink/35" />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink/80 via-ink/35 to-transparent md:h-full md:from-ink/60 md:via-ink/25"
          />
        </div>

        {/* One wrapper, one animation. Headline, button and cue are all
            inside it, so they arrive as a single beat rather than a stagger —
            and the animation is CSS off page load, not JS off hydration.
            z-20 keeps it above the card at every size the card takes, rather
            than depending on DOM order alone. */}
        <div className="hero-in shell relative z-20 w-full pb-16 pt-32 text-left md:pb-24 md:text-center">
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
    </div>
  );
}
