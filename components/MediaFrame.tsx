import Image from "next/image";
import { TONE_FIELDS, type MediaSlot } from "@/lib/media";

type Props = {
  slot: MediaSlot;
  /** Set only on the single above-the-fold LCP image. */
  priority?: boolean;
  sizes?: string;
  className?: string;
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
  priority = false,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  className = "",
  children,
}: Props) {
  return (
    <div
      className={`relative overflow-hidden bg-surface ${className}`}
      style={{ aspectRatio: slot.aspect }}
    >
      {slot.src ? (
        <Image
          src={slot.src}
          alt={slot.alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      ) : (
        /* No photograph yet — decorative, so it stays out of the a11y tree
           rather than announcing a description of an image that isn't there. */
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ backgroundImage: TONE_FIELDS[slot.tone] }}
        />
      )}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border border-rule"
      />
      {/* After the hairline, so an overlay sits above it rather than under. */}
      {children}
    </div>
  );
}
