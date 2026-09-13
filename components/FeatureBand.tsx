import Link from "next/link";
import MediaFrame from "./MediaFrame";
import Reveal from "./Reveal";
import { home } from "@/content/studio";
import { siteMedia } from "@/lib/media";

function Check() {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className="mt-0.5 size-5 shrink-0 text-brass"
    >
      <path
        fill="currentColor"
        d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L4.3 10.7a1 1 0 1 1 1.4-1.4l2.8 2.79 6.8-6.79a1 1 0 0 1 1.4 0Z"
      />
    </svg>
  );
}

/**
 * Full-bleed ink band. The one section on the page where light-on-dark
 * text rules apply throughout — see the contrast note in globals.css:
 * `label`'s brass default is a large-text colour here, so it's overridden
 * to `lighter` rather than left to inherit.
 */
export default function FeatureBand() {
  const { featureBand } = home;

  return (
    <section className="bg-ink py-section-sm text-page md:py-section">
      <div className="shell grid items-center gap-12 md:grid-cols-2 md:gap-20">
        <Reveal direction="left">
          <p className="label text-lighter">{featureBand.label}</p>
          <h2 className="display-section mt-5 max-w-[15ch] text-page">
            {featureBand.heading}
          </h2>
          <p className="mt-6 max-w-[44ch] leading-relaxed text-page/75">
            {featureBand.body}
          </p>

          <ul className="mt-9 space-y-4">
            {featureBand.points.map((point) => (
              <li
                key={point}
                className="flex items-start gap-3 text-[0.9375rem] text-page/90"
              >
                <Check />
                {point}
              </li>
            ))}
          </ul>

          <Link
            href={featureBand.link.href}
            className="link-underline mt-10 inline-block text-[0.9375rem] text-page"
          >
            {featureBand.link.label}
          </Link>
        </Reveal>

        <Reveal direction="right" delay={120}>
          <MediaFrame
            slot={siteMedia.homeFeatureBand}
            sizes="(min-width: 768px) 45vw, 100vw"
            zoom
          />
        </Reveal>
      </div>
    </section>
  );
}
