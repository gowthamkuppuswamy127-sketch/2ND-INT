import type { Metadata } from "next";
import MediaFrame from "@/components/MediaFrame";
import Reveal from "@/components/Reveal";
import { studio } from "@/content/studio";
import { siteMedia } from "@/lib/media";

export const metadata: Metadata = {
  title: "Studio",
  description:
    "Nilayaa Interiors is an eight-person interior design studio based in Basavanagudi, Bengaluru, working since 2016.",
  alternates: { canonical: "/studio" },
  openGraph: { url: "/studio" },
};

export default function StudioPage() {
  return (
    <div className="py-section-sm md:py-section">
      <section className="shell">
        <div className="grid items-start gap-12 md:grid-cols-2 md:gap-16">
          {/* Both halves of this row are above the fold — see Reveal's
              `immediate`. The portrait is the page's LCP element. */}
          <Reveal immediate>
            <p className="label">{studio.intro.label}</p>
            <h1 className="display-section mt-5 max-w-[14ch]">
              {studio.intro.heading}
            </h1>
            <div className="mt-8 space-y-5 prose-measure text-ink-muted">
              {studio.intro.body.map((paragraph) => (
                <p key={paragraph} className="leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>

          <Reveal immediate>
            <MediaFrame
              slot={siteMedia.studioPortrait}
              /* This page's LCP element — the one image worth preloading
                 here, same rule as the project page's cover plate. */
              preload
              sizes="(min-width: 768px) 45vw, 100vw"
            />
          </Reveal>
        </div>
      </section>

      <section className="bg-surface mt-section-sm py-section-sm md:mt-section md:py-section">
        <div className="shell">
          <Reveal>
            <p className="label">{studio.principles.label}</p>
            <h2 className="display-section mt-5">
              {studio.principles.heading}
            </h2>
          </Reveal>

          <ul className="mt-14 grid gap-px border border-rule bg-rule md:grid-cols-3">
            {studio.principles.items.map((item, i) => (
              <li key={item.title} className="bg-surface p-8 md:p-10">
                <Reveal delay={i * 90}>
                  <h3 className="display-sm">{item.title}</h3>
                  <p className="mt-4 leading-relaxed text-ink-muted">
                    {item.body}
                  </p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="shell mt-section-sm md:mt-section">
        <Reveal>
          <p className="label">{studio.process.label}</p>
          <h2 className="display-section mt-5 max-w-[18ch]">
            {studio.process.heading}
          </h2>
        </Reveal>

        {/* Genuinely ordered — the numbers carry the sequence, not decoration. */}
        <ol className="mt-14 border-t border-rule">
          {studio.process.steps.map((step, i) => (
            <li key={step.title} className="border-b border-rule">
              <Reveal delay={i * 70}>
                <div className="grid gap-3 py-8 md:grid-cols-[5rem_1fr_2fr] md:gap-8">
                  <p className="label tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="display-sm">{step.title}</h3>
                  <p className="leading-relaxed text-ink-muted">{step.body}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      <section className="shell mt-section-sm md:mt-section">
        <div className="grid items-start gap-12 md:grid-cols-2 md:gap-16">
          <Reveal>
            <MediaFrame
              slot={siteMedia.studioWorkshop}
              sizes="(min-width: 768px) 45vw, 100vw"
            />
          </Reveal>

          <Reveal delay={120}>
            <p className="label">{studio.team.label}</p>
            <h2 className="display-section mt-5">{studio.team.heading}</h2>
            <div className="mt-8 space-y-5 prose-measure text-ink-muted">
              {studio.team.body.map((paragraph) => (
                <p key={paragraph} className="leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
