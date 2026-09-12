"use client";

import Link from "next/link";
import { TONE_FIELDS, heroVideo } from "@/lib/media";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { home } from "@/content/studio";

export default function Hero() {
  const reducedMotion = usePrefersReducedMotion();
  const playVideo = Boolean(heroVideo.src) && !reducedMotion;

  return (
    <section className="relative flex min-h-[calc(100svh-5rem)] items-end overflow-hidden">
      <div className="absolute inset-0">
        {heroVideo.poster.src ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={heroVideo.poster.src}
            alt={heroVideo.poster.alt}
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            aria-hidden="true"
            className="h-full w-full"
            style={{ backgroundImage: TONE_FIELDS[heroVideo.poster.tone] }}
          />
        )}

        {playVideo && (
          <video
            src={heroVideo.src}
            poster={heroVideo.poster.src || undefined}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        {/* Scrim. The headline sits bottom-left, so weight the gradient there
            rather than flattening the whole frame. */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgb(20 17 15 / 0.72) 0%, rgb(20 17 15 / 0.45) 38%, rgb(20 17 15 / 0.15) 72%, rgb(20 17 15 / 0.08) 100%)",
          }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-[80rem] px-5 pb-16 pt-28 sm:px-8 md:px-10 md:pb-24">
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
