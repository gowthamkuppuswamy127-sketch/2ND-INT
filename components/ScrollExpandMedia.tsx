"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ReactNode,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { motion } from "framer-motion";
import { TONE_FIELDS, type Tone } from "@/lib/media";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

function subscribeResize(onChange: () => void) {
  window.addEventListener("resize", onChange, { passive: true });
  return () => window.removeEventListener("resize", onChange);
}

// Kept as a literal (not templated into the Tailwind classes below, which
// need the static string for their arbitrary-value scan) so the JS calc and
// the section's own min-h/h classes can't drift apart.
const MOBILE_HERO_HEIGHT = "86dvh";

/** Same `useSyncExternalStore` shape as usePrefersReducedMotion/Header's
    useScrolledPastHero: correct from the first client read rather than
    lagging a render behind the way effect+setState would — this value
    gates whether the scroll-hijack effect attaches at all, so a late
    correction would let it attach on mobile for one tick. */
function useIsMobile(): boolean {
  return useSyncExternalStore(
    subscribeResize,
    () => window.innerWidth < 768,
    () => false,
  );
}

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
  /** The page's own `<h1>`, centered over the media and gated on
      `contentVisible` below — unlike `title`, which is always on from
      scroll 0 and splits apart as `scrollProgress` moves. Kept as a
      separate prop rather than folded into `title` so the two behaviors
      don't have to be reconciled into one. ReactNode (not string) so a
      caller can mark up its own mobile-only line break. */
  heroText?: ReactNode;
  /** Mobile-only CTA shown under `heroText` (desktop has no equivalent —
      the nav's own "Enquire" link covers that there). Only rendered
      alongside `heroText`, since it has nothing to anchor under otherwise. */
  heroCta?: { href: string; label: string };
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
  heroText,
  heroCta,
  children,
}: ScrollExpandMediaProps) => {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [showContent, setShowContent] = useState<boolean>(false);
  const [mediaFullyExpanded, setMediaFullyExpanded] = useState<boolean>(false);
  const [touchStartY, setTouchStartY] = useState<number>(0);
  const [videoFailed, setVideoFailed] = useState<boolean>(false);
  const [bgImageFailed, setBgImageFailed] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const isMobileState = useIsMobile();

  const isYouTube = mediaType === "video" && mediaSrc.includes("youtube.com");
  const isLocalVideo = mediaType === "video" && !isYouTube;
  const bgImageOk = Boolean(bgImageSrc) && !bgImageFailed;

  // Reduced motion and mobile both rest at the fully-expanded, fully-shown
  // state instead of the scroll-driven one — derived here rather than
  // synced through an effect, so there's no extra render-then-correct step.
  // The effect below never attaches its listeners in either case, so the
  // underlying `scrollProgress` state is simply never moved off its initial
  // 0 — which is also why the title's translate-apart effect further down,
  // reading that same raw state, naturally stays put instead of needing its
  // own branch. Mobile drops the wheel/touch scroll-hijack outright rather
  // than adapting it — there's no touch-friendly way to say "expand, then
  // release to keep scrolling" — so the video just shows full-bleed
  // immediately and the page scrolls normally underneath it.
  const effectiveProgress =
    prefersReducedMotion || isMobileState ? 1 : scrollProgress;
  const contentVisible = prefersReducedMotion || isMobileState || showContent;

  useEffect(() => {
    if (prefersReducedMotion || isMobileState) return;

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
  }, [
    scrollProgress,
    mediaFullyExpanded,
    touchStartY,
    prefersReducedMotion,
    isMobileState,
  ]);

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

  // Grown in vw/dvh, not capped px, so progress=1 lands on exactly the
  // viewport's own size on every device — centering a viewport-unit box
  // inside this component's (possibly narrower, `container`-capped)
  // positioning parent still lines its edges up with the real viewport
  // edges, since both are centered the same way. Mobile previously capped
  // this short of fullscreen (first at the video's own 16:9 ratio, then at
  // a fixed 88vw portrait card) to avoid object-cover cropping the
  // landscape footage hard on a tall, narrow screen — but a full-bleed,
  // edge-to-edge fill at the end of the scroll is the actual target, crop
  // and all, same as desktop.
  //
  // The section's own height on mobile is capped short of 100dvh (see
  // MOBILE_HERO_HEIGHT below and its matching `min-h-[86dvh]`/`h-[86dvh]`
  // classes further down) — a sliver of the next section left visible on
  // load, matched to a specific reference size. Desktop keeps the true
  // 100dvh since the scroll-hijack expand there depends on it.
  const mediaWidth = `calc(300px + ${effectiveProgress} * (100vw - 300px))`;
  const mediaHeight = `calc(400px + ${effectiveProgress} * (${isMobileState ? MOBILE_HERO_HEIGHT : "100dvh"} - 400px))`;
  const mediaRadius = 16 * (1 - effectiveProgress);
  const textTranslateX = scrollProgress * (isMobileState ? 180 : 150);

  const firstWord = title ? title.split(" ")[0] : "";
  const restOfTitle = title ? title.split(" ").slice(1).join(" ") : "";

  return (
    <div className="transition-colors duration-700 ease-in-out overflow-x-hidden">
      {/* overflow-hidden: the bg-image layer just below is absolutely
          positioned (`inset-0`) against this box, sized off `min-h-[86dvh]
          md:min-h-[100dvh]` — which tracks the *content's* height, not a
          fixed one. Any mismatch between that and the real viewport (dvh's
          address-bar jitter on mobile, a sub-pixel rounding) used to let the
          image paint past this box's own bottom edge, into whatever section
          follows on the page. This clips it to the hero's box no matter what
          the height math does, which is the actual fix — cropping, not
          sizing. */}
      <section className="relative flex flex-col items-center justify-start min-h-[86dvh] md:min-h-[100dvh] overflow-hidden">
        <div className="relative w-full flex flex-col items-center min-h-[86dvh] md:min-h-[100dvh]">
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
                // Always cover, on mobile too: this plate is a full-bleed
                // backdrop behind the media card, meant to fill the section
                // edge to edge like the reference it's matched to — letting
                // it contain/letterbox just put visible empty bars around
                // it instead.
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

          {heroText && (
            // Anchored to the OUTER section box (full section height), not
            // the `container`/inner div below (which only wraps its own
            // content height) — `inset-0` here needs that full height to
            // center against.
            <motion.div
              className="pointer-events-none absolute inset-0 z-20 flex flex-col items-start justify-end px-5 pb-12 text-left sm:px-8 md:items-center md:justify-center md:px-10 md:pb-0 md:text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={
                contentVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
              }
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1 className="display-hero max-w-none text-[2.25rem] text-page [text-shadow:0_2px_28px_rgb(0_0_0_/_0.4)] md:max-w-[15ch] md:text-[clamp(2.75rem,6.4vw,5.25rem)]">
                {heroText}
              </h1>
              {heroCta && (
                <Link
                  href={heroCta.href}
                  className="label btn-outline pointer-events-auto mt-6 md:hidden"
                >
                  {heroCta.label}
                </Link>
              )}
            </motion.div>
          )}

          <div className="container mx-auto flex flex-col items-center justify-start relative z-10">
            <div className="flex flex-col items-center justify-center w-full h-[86dvh] md:h-[100dvh] relative">
              <div
                className="absolute z-0 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-none"
                style={{
                  width: mediaWidth,
                  height: mediaHeight,
                  borderRadius: mediaRadius,
                  boxShadow: `0px 0px 50px rgba(0, 0, 0, ${0.3 * (1 - effectiveProgress)})`,
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
                      className="w-full h-full"
                      style={{ borderRadius: mediaRadius }}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                    <motion.div
                      className="absolute inset-0 bg-ink/30"
                      style={{ borderRadius: mediaRadius }}
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
                      className="w-full h-full object-cover"
                      style={{ borderRadius: mediaRadius }}
                      controls={false}
                      disablePictureInPicture
                      disableRemotePlayback
                    />
                    <motion.div
                      className="absolute inset-0 bg-ink/30"
                      style={{ borderRadius: mediaRadius }}
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
                      sizes="100vw"
                      className="object-cover"
                      style={{ borderRadius: mediaRadius }}
                    />
                    <motion.div
                      className="absolute inset-0 bg-ink/50"
                      style={{ borderRadius: mediaRadius }}
                      initial={{ opacity: 0.7 }}
                      animate={{ opacity: 0.7 - effectiveProgress * 0.3 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                )}

                <div className="flex flex-col items-center text-center relative z-10 mt-4 transition-none">
                  {date && (
                    <p
                      // Reduced motion never translates this caption away (see the
                      // effectiveProgress/textTranslateX comments above), so it rests
                      // on the plain page background instead of the image+overlay
                      // backdrop the page-tinted colour is otherwise legible on.
                      className="label text-page/90 motion-reduce:text-brass"
                      style={{ transform: `translateX(-${textTranslateX}vw)` }}
                    >
                      {date}
                    </p>
                  )}
                  {scrollToExpand && (
                    <p
                      className="label text-page/80 text-center motion-reduce:text-brass/80"
                      style={{ transform: `translateX(${textTranslateX}vw)` }}
                    >
                      {scrollToExpand}
                    </p>
                  )}
                </div>
              </div>

              {title && (
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
              )}
            </div>

            {/* No trailing content section at all when there's nothing to put
                in it — an empty bg-page box was exactly the thing bleeding
                into view in the screenshot: a solid-colour box narrower than
                the full-bleed image layer behind it, so that image's edges
                showed on either side of it. Removing the box removes the
                symptom at its source, rather than papering over it. */}
            {children && (
              <motion.section
                className="flex flex-col w-full bg-page px-8 py-10 md:px-16 lg:py-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: contentVisible ? 1 : 0 }}
                transition={{ duration: 0.7 }}
              >
                {children}
              </motion.section>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ScrollExpandMedia;
