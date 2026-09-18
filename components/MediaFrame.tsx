import Image from "next/image";
import { TONE_FIELDS, type MediaSlot } from "@/lib/media";

type Props = {
  slot: MediaSlot;
  /** Set only on the single above-the-fold LCP image. Next.js 16 renamed
      `priority` to `preload` (node_modules/next/dist/docs/01-app/
      03-api-reference/02-components/image.md). */
  preload?: boolean;
  sizes?: string;
  className?: string;
  /** Scales the image slightly on hover/focus of the nearest ancestor
      `.group`, or of this frame itself if nothing else claims that role.
      For gallery and project plates — never the single LCP hero image. */
  zoom?: boolean;
  /** "cover" (default) fills the frame and crops to it — safe only when the
      frame's own aspect ratio already matches the photo's. "contain" letter-
      or pillar-boxes the photo instead, for the handful of frames that are
      shared by many photos of different ratios (a hover-swapped preview
      pane) and can't be sized to match every one of them. */
  fit?: "cover" | "contain";
  /** Overlays drawn inside the frame — corner tags, hover marks. Positioned
      against the frame itself, which is the containing block. */
  children?: React.ReactNode;
};

/**
 * Renders a photo when the slot has a src, and a tonal field when it doesn't.
 * Both states use the same aspect-ratio box, so supplying real photography
 * later causes no layout shift.
 */
export default function MediaFrame({
  slot,
  preload = false,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  className = "",
  zoom = false,
  fit = "cover",
  children,
}: Props) {
  return (
    <div
      className={`group/media relative w-full overflow-hidden bg-surface ${className}`}
      style={{ aspectRatio: slot.aspect }}
    >
      {slot.src ? (
        <Image
          src={slot.src}
          alt={slot.alt}
          fill
          sizes={sizes}
          preload={preload}
          className={`${fit === "contain" ? "object-contain" : "object-cover"} ${
            zoom
              ? "transition-transform duration-[900ms] ease-out group-hover/media:scale-[1.06] group-hover:scale-[1.06] group-focus-visible:scale-[1.06]"
              : ""
          }`}
        />
      ) : (
        /* No photograph yet — decorative, so it stays out of the a11y tree
           rather than announcing a description of an image that isn't there.
           Same hover-zoom as the photo case, so a placeholder plate reads no
           differently from a finished one once real photography lands. */
        <div
          aria-hidden="true"
          className={`absolute inset-0 ${
            zoom
              ? "transition-transform duration-[900ms] ease-out group-hover/media:scale-[1.06] group-hover:scale-[1.06] group-focus-visible:scale-[1.06]"
              : ""
          }`}
          style={{ backgroundImage: TONE_FIELDS[slot.tone] }}
        />
      )}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] border border-rule"
      />
      {/* After the hairline, so an overlay sits above it rather than under. */}
      {children}
    </div>
  );
}
