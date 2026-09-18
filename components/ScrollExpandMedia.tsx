"use client";

import Image from "next/image";
import { ReactNode, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { TONE_FIELDS, type Tone } from "@/lib/media";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

interface ScrollExpandMediaProps {
  mediaType?: "video" | "image";
  mediaSrc: string;
  posterSrc?: string;
  bgImageSrc: string;
  bgImageAlt: string;
  /** Tonal field shown while `bgImageSrc` is loading or if it 404s — same
      fallback idiom as <MediaFrame> and <Hero>, so a missing asset never
      shows a broken image. */
  bgTone?: Tone;
  title?: string;
  date?: string;
  scrollToExpand?: string;
  textBlend?: boolean;
  children?: ReactNode;
}

const ScrollExpandMedia = ({
  mediaType = "video",
  mediaSrc,
  posterSrc,
  bgImageSrc,
  bgImageAlt,
  bgTone = "stone",
  title,
  date,
  scrollToExpand,
  textBlend,
  children,
}: ScrollExpandMediaProps) => {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [showContent, setShowContent] = useState<boolean>(false);
  const [mediaFullyExpanded, setMediaFullyExpanded] = useState<boolean>(false);
  const [touchStartY, setTouchStartY] = useState<number>(0);
  const [isMobileState, setIsMobileState] = useState<boolean>(false);
  const [videoFailed, setVideoFailed] = useState<boolean>(false);
  const [bgImageFailed, setBgImageFailed] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const isYouTube = mediaType === "video" && mediaSrc.includes("youtube.com");
  const isLocalVideo = mediaType === "video" && !isYouTube;
  const bgImageOk = Boolean(bgImageSrc) && !bgImageFailed;

  // Reduced motion rests at the fully-expanded, fully-shown state instead of
  // the scroll-driven one — derived here rather than synced through an
  // effect, so there's no extra render-then-correct step. The effect below
  // never attaches its listeners in this case, so the underlying
  // `scrollProgress` state is simply never moved off its initial 0 — which
  // is also why the title's translate-apart effect further down, reading
  // that same raw state, naturally stays put instead of needing its own
  // reduced-motion branch.
  const effectiveProgress = prefersReducedMotion ? 1 : scrollProgress;
  const contentVisible = prefersReducedMotion || showContent;

  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleWheel = (e: WheelEvent) => {
      if (mediaFullyExpanded && e.deltaY < 0 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        e.preventDefault();
        const scrollDelta = e.deltaY * 0.0009;
        const newProgress = Math.min(
          Math.max(scrollProgress + scrollDelta, 0),
          1,
        );
        setScrollProgress(newProgress);

        if (newProgress >= 1) {
          setMediaFullyExpanded(true);
          setShowContent(true);
        } else if (newProgress < 0.75) {
          setShowContent(false);
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      setTouchStartY(e.touches[0].clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartY) return;

      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;

      if (mediaFullyExpanded && deltaY < -20 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        e.preventDefault();
        // Higher sensitivity scrolling back (deltaY < 0) than forward —
        // mobile trackpad/touch deltas otherwise feel sluggish in reverse.
        const scrollFactor = deltaY < 0 ? 0.008 : 0.005;
        const scrollDelta = deltaY * scrollFactor;
        const newProgress = Math.min(
          Math.max(scrollProgress + scrollDelta, 0),
          1,
        );
        setScrollProgress(newProgress);

        if (newProgress >= 1) {
          setMediaFullyExpanded(true);
          setShowContent(true);
        } else if (newProgress < 0.75) {
          setShowContent(false);
        }

        setTouchStartY(touchY);
      }
    };

    const handleTouchEnd = (): void => {
      setTouchStartY(0);
    };

    const handleScroll = (): void => {
      if (!mediaFullyExpanded) {
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [scrollProgress, mediaFullyExpanded, touchStartY, prefersReducedMotion]);

  useEffect(() => {
    const checkIfMobile = (): void => {
      setIsMobileState(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // `src` is assigned here, never as a JSX attribute — this component is
  // statically prerendered, so a `src` written into JSX ships already in
  // the served HTML and the browser fetches it while still parsing. Doing
  // it here means the request never fires for a reduced-motion visitor,
  // and the poster attribute (set eagerly, in JSX) carries the frame in
  // the meantime — same split as <Hero>'s own video wiring.
  useIsomorphicLayoutEffect(() => {
    const el = videoRef.current;
    if (!el || !isLocalVideo || !mediaSrc || videoFailed) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const handleError = () => setVideoFailed(true);
    el.addEventListener("error", handleError);
    el.src = mediaSrc;
    el.load();

    return () => el.removeEventListener("error", handleError);
  }, [isLocalVideo, mediaSrc, videoFailed]);

  const mediaWidth = 300 + effectiveProgress * (isMobileState ? 650 : 1250);
  const mediaHeight = 400 + effectiveProgress * (isMobileState ? 200 : 400);
  const textTranslateX = scrollProgress * (isMobileState ? 180 : 150);

  const firstWord = title ? title.split(" ")[0] : "";
  const restOfTitle = title ? title.split(" ").slice(1).join(" ") : "";

  return (
    <div className="transition-colors duration-700 ease-in-out overflow-x-hidden">
      <section className="relative flex flex-col items-center justify-start min-h-[100dvh]">
        <div className="relative w-full flex flex-col items-center min-h-[100dvh]">
          <motion.div
            className="absolute inset-0 z-0 h-full"
            initial={{ opacity: 0 }}
            // Floored, not faded to 0: the date/scrollToExpand caption sits
            // in the sliver below the media box, outside it — at full
            // expansion that sliver is all that's left of this layer, so a
            // full fade would strip its only scrim and wash the caption out
            // against the plain page background.
            animate={{ opacity: Math.max(1 - effectiveProgress, 0.3) }}
            transition={{ duration: 0.1 }}
          >
            {bgImageOk ? (
              <Image
                src={bgImageSrc}
                alt={bgImageAlt}
                fill
                preload
                sizes="100vw"
                className="object-cover"
                onError={() => setBgImageFailed(true)}
              />
            ) : (
              <div
                aria-hidden="true"
                className="h-full w-full"
                style={{ backgroundImage: TONE_FIELDS[bgTone] }}
              />
            )}
            <div aria-hidden="true" className="absolute inset-0 bg-ink/35" />
          </motion.div>

          <div className="container mx-auto flex flex-col items-center justify-start relative z-10">
            <div className="flex flex-col items-center justify-center w-full h-[100dvh] relative">
              <div
                className="absolute z-0 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-none rounded-2xl"
                style={{
                  width: `${mediaWidth}px`,
                  height: `${mediaHeight}px`,
                  maxWidth: "95vw",
                  maxHeight: "85vh",
                  boxShadow: "0px 0px 50px rgba(0, 0, 0, 0.3)",
                }}
              >
                {isYouTube ? (
                  <div className="relative w-full h-full pointer-events-none">
                    <iframe
                      width="100%"
                      height="100%"
                      src={
                        mediaSrc.includes("embed")
                          ? mediaSrc +
                            (mediaSrc.includes("?") ? "&" : "?") +
                            "autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1"
                          : mediaSrc.replace("watch?v=", "embed/") +
                            "?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1&playlist=" +
                            mediaSrc.split("v=")[1]
                      }
                      className="w-full h-full rounded-xl"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                    <motion.div
                      className="absolute inset-0 bg-ink/30 rounded-xl"
                      initial={{ opacity: 0.7 }}
                      animate={{ opacity: 0.5 - effectiveProgress * 0.3 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                ) : isLocalVideo ? (
                  <div className="relative w-full h-full pointer-events-none">
                    <video
                      ref={videoRef}
                      poster={posterSrc}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="auto"
                      aria-hidden="true"
                      className="w-full h-full object-cover rounded-xl"
                      controls={false}
                      disablePictureInPicture
                      disableRemotePlayback
                    />
                    <motion.div
                      className="absolute inset-0 bg-ink/30 rounded-xl"
                      initial={{ opacity: 0.7 }}
                      animate={{ opacity: 0.5 - effectiveProgress * 0.3 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                ) : (
                  <div className="relative w-full h-full">
                    <Image
                      src={mediaSrc}
                      alt={title || "Media content"}
                      fill
                      sizes="95vw"
                      className="object-cover rounded-xl"
                    />
                    <motion.div
                      className="absolute inset-0 bg-ink/50 rounded-xl"
                      initial={{ opacity: 0.7 }}
                      animate={{ opacity: 0.7 - effectiveProgress * 0.3 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                )}

                <div className="flex flex-col items-center text-center relative z-10 mt-4 transition-none">
                  {date && (
                    <p
                      className="label text-page/90"
                      style={{ transform: `translateX(-${textTranslateX}vw)` }}
                    >
                      {date}
                    </p>
                  )}
                  {scrollToExpand && (
                    <p
                      className="label text-page/80 text-center"
                      style={{ transform: `translateX(${textTranslateX}vw)` }}
                    >
                      {scrollToExpand}
                    </p>
                  )}
                </div>
              </div>

              <div
                className={`flex items-center justify-center text-center gap-4 w-full relative z-10 transition-none flex-col ${
                  textBlend ? "mix-blend-difference" : "mix-blend-normal"
                }`}
              >
                <motion.h2
                  className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] text-page transition-none"
                  style={{ transform: `translateX(-${textTranslateX}vw)` }}
                >
                  {firstWord}
                </motion.h2>
                <motion.h2
                  className="font-display text-4xl sm:text-5xl lg:text-6xl text-center leading-[1.05] text-page transition-none"
                  style={{ transform: `translateX(${textTranslateX}vw)` }}
                >
                  {restOfTitle}
                </motion.h2>
              </div>
            </div>

            <motion.section
              className="flex flex-col w-full px-8 py-10 md:px-16 lg:py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: contentVisible ? 1 : 0 }}
              transition={{ duration: 0.7 }}
            >
              {children}
            </motion.section>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ScrollExpandMedia;
