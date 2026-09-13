"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { TONE_FIELDS, heroVideo } from "@/lib/media";
import { home } from "@/content/studio";

// useLayoutEffect only on the client. This component is statically
// prerendered, and React's server renderer warns on useLayoutEffect (it has
// no DOM to run against) — the warning is dev-only and stripped in
// production, but this keeps `next dev` clean too.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function Hero() {
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoConfigured = Boolean(heroVideo.src) && !videoFailed;

  useIsomorphicLayoutEffect(() => {
    const el = videoRef.current;
    if (!el || !videoConfigured) return;

    // Checked live here, not via a React-level reduced-motion hook: a hook
    // backed by useSyncExternalStore has to assume motion is allowed on its
    // first hydration pass (there's no OS preference on the server to read),
    // then corrects itself in a later, separate render. This effect's first
    // run happens as part of that same first pass, before the correction
    // lands — so gating on the hook's value here would still start the
    // fetch for a reduced-motion visitor before React catches up.
    // window.matchMedia has no such lag: it's a direct, synchronous read of
    // the real preference, correct from the first call.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // `src` is assigned here, never as a JSX attribute. This page is
    // statically prerendered, so a `src` written into JSX ships already in
    // the served HTML — the browser starts that fetch while still parsing,
    // before any of this can run at all. Assigning it only here means the
    // request never happens until we've confirmed motion is allowed, and
    // this listener is always attached before it does.
    const handleError = () => setVideoFailed(true);
    el.addEventListener("error", handleError);
    el.src = heroVideo.src;
    el.load();

    return () => el.removeEventListener("error", handleError);
  }, [videoConfigured]);

  return (
    // Header floats over this as an absolute overlay on the home route, so it
    // no longer reserves its own ~5rem of flow height — the hero fills the
    // full viewport instead of svh-minus-header.
    <section className="relative flex min-h-svh items-end overflow-hidden">
      <div className="absolute inset-0">
        {heroVideo.poster.src ? (
          // preload: this is the page's LCP element — a `<link>` goes in the
          // `<head>` so the fetch starts immediately. Same prop MediaFrame
          // exposes for its own LCP case; v16 renamed it from `priority`
          // (node_modules/next/dist/docs/01-app/03-api-reference/
          // 02-components/image.md).
          <Image
            src={heroVideo.poster.src}
            alt={heroVideo.poster.alt}
            fill
            preload
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div
            aria-hidden="true"
            className="h-full w-full"
            style={{ backgroundImage: TONE_FIELDS[heroVideo.poster.tone] }}
          />
        )}

        {/* No src in JSX — see the effect above for why. An empty <video>
            paints nothing, so the poster/tonal field beneath stays fully
            visible until (and unless) the effect assigns a source. */}
        {videoConfigured && (
          <video
            ref={videoRef}
            poster={heroVideo.poster.src || undefined}
            preload="auto"
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        {/* Scrim. The headline sits bottom-left, so weight the gradient there
            rather than flattening the whole frame. Also what keeps the
            transparent header's nav legible for the frame it floats over. */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgb(28 28 29 / 0.72) 0%, rgb(28 28 29 / 0.45) 38%, rgb(28 28 29 / 0.15) 72%, rgb(28 28 29 / 0.08) 100%)",
          }}
        />
      </div>

      {/* Scroll cue. An anchor, not a click handler — `scroll-behavior:
          smooth` on <html> (globals.css) does the animating, and it's a
          real link that still works with JS off or motion reduced. */}
      <a
        href="#intro"
        aria-label="Scroll to learn more"
        className="absolute inset-x-0 bottom-7 z-10 hidden animate-[hero-in_800ms_cubic-bezier(0.22,1,0.36,1)_520ms_both] justify-center sm:flex"
      >
        <span className="animate-cue flex size-12 items-center justify-center rounded-full border border-page/45 text-page transition-colors duration-300 hover:border-page hover:bg-page hover:text-ink">
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="size-4"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </a>

      <div className="relative mx-auto w-full max-w-[80rem] px-5 pb-16 pt-32 sm:px-8 md:px-10 md:pb-24 md:pt-40">
        <p className="label animate-[hero-in_800ms_cubic-bezier(0.22,1,0.36,1)_both] text-page/75">
          {home.hero.eyebrow}
        </p>

        <h1 className="display-hero mt-6 max-w-[16ch] animate-[hero-in_800ms_cubic-bezier(0.22,1,0.36,1)_120ms_both] text-page">
          {home.hero.headline}
        </h1>

        <p className="mt-7 max-w-[48ch] animate-[hero-in_800ms_cubic-bezier(0.22,1,0.36,1)_240ms_both] text-[1.0625rem] leading-relaxed text-page/85">
          {home.hero.subline}
        </p>

        <div className="mt-10 animate-[hero-in_800ms_cubic-bezier(0.22,1,0.36,1)_360ms_both]">
          <Link
            href={home.hero.cta.href}
            className="label inline-block border border-page/40 px-8 py-4 text-page transition-colors duration-300 hover:border-page hover:bg-page hover:text-ink"
          >
            {home.hero.cta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
