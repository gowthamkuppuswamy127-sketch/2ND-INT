"use client";

import Image from "next/image";
import { useState } from "react";
import { TONE_FIELDS, type MediaSlot } from "@/lib/media";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

type Props = {
  src: string;
  poster: MediaSlot;
  className?: string;
};

/**
 * Full-bleed, muted autoplaying loop — the video counterpart to
 * <MediaFrame>. Reduced motion and a failed video load both rest on the
 * poster frame (falling further back to its tonal field if that's missing
 * too), so this never shows a broken box — same never-broken idiom as the
 * hero video.
 */
export default function VideoBand({ src, poster, className = "" }: Props) {
  const [videoFailed, setVideoFailed] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const showVideo = Boolean(src) && !videoFailed && !prefersReducedMotion;

  return (
    <div
      className={`relative w-full overflow-hidden bg-surface ${className}`}
      style={{ aspectRatio: poster.aspect }}
    >
      {showVideo ? (
        <div className="pointer-events-none absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={poster.src || undefined}
            aria-hidden="true"
            className="h-full w-full object-cover"
            controls={false}
            disablePictureInPicture
            disableRemotePlayback
            onError={() => setVideoFailed(true)}
          >
            <source src={src} type="video/mp4" />
          </video>
        </div>
      ) : poster.src ? (
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
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border border-rule"
      />
    </div>
  );
}
