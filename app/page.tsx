import Link from "next/link";
import Hero from "@/components/Hero";
import MediaFrame from "@/components/MediaFrame";
import ProjectCarousel from "@/components/ProjectCarousel";
import Reveal from "@/components/Reveal";
import SpaceStrip from "@/components/SpaceStrip";
import { projects } from "@/content/projects";
import { home } from "@/content/studio";
import { siteMedia } from "@/lib/media";

type Service = (typeof home.services.items)[number];

/** One cell of the services grid. Sized by the grid, so it fills its row. */
function ServiceCard({ item, index }: { item: Service; index: number }) {
  return (
    <Reveal delay={index * 80} className="h-full">
      <div className="flex h-full flex-col border border-rule bg-page p-7 md:p-8">
        <div className="flex items-baseline gap-4">
          <p className="label shrink-0 tabular-nums">
            /{String(index + 1).padStart(2, "0")}
          </p>
          <h3 className="display-sm">{item.title}</h3>
        </div>

        <p className="mt-5 border-t border-rule pt-5 text-[0.9375rem] leading-relaxed text-ink-muted">
          {item.body}
        </p>

        <Link
          href={home.services.link.href}
          className="label link-underline mt-auto self-start pt-8 text-ink"
        >
          {home.services.link.label}
          <span className="sr-only"> {item.enquiry}</span>
        </Link>
      </div>
    </Reveal>
  );
}

export default function HomePage() {
  const services = home.services.items;

  return (
    <>
      <Hero />

      <section className="shell py-section-sm md:py-section">
        <Reveal>
          <div className="flex flex-wrap items-start justify-between gap-x-10 gap-y-8">
            <div>
              <p className="label">{home.philosophy.label}</p>
              <h2 className="display-section mt-5 max-w-[14ch]">
                {home.philosophy.heading}
              </h2>
            </div>

            <Link
              href={home.philosophy.link.href}
              className="label btn-solid shrink-0"
            >
              {home.philosophy.link.label}
            </Link>
          </div>

          <div className="mt-10 grid max-w-[62rem] gap-5 text-ink-muted md:grid-cols-2 md:gap-12">
            {home.philosophy.body.map((paragraph) => (
              <p key={paragraph} className="leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </Reveal>

        <div className="mt-16 md:mt-24">
          <SpaceStrip />
        </div>
      </section>

      <section className="bg-surface py-section-sm md:py-section">
        <div className="shell">
          <Reveal>
            <div className="mx-auto max-w-[17rem] text-center">
              <p className="label">{home.services.label}</p>
              <h2 className="display-section mt-5">{home.services.heading}</h2>
            </div>
          </Reveal>

          {/* Three columns with a photograph on the end of the first row and
              the start of the second, so the plates sit diagonally across the
              grid rather than in a column of their own. */}
          <div className="mt-14 grid gap-4 sm:grid-cols-2 md:mt-16 md:grid-cols-3">
            <ServiceCard item={services[0]} index={0} />
            <ServiceCard item={services[1]} index={1} />

            {/* Absolute inside a stretched cell, so the plate takes the row's
                height. Left to size itself, its own aspect ratio would compute
                a width from that height and push into the next column. The
                min-height is for the stacked case, where the plate is alone in
                its row and has nothing to be stretched against. */}
            <Reveal delay={160} className="relative min-h-56">
              <div className="absolute inset-0">
                <MediaFrame
                  slot={siteMedia.homeServices}
                  className="h-full w-full"
                  sizes="(min-width: 768px) 31vw, (min-width: 640px) 46vw, 100vw"
                />
              </div>
            </Reveal>

            {/* Stacked, the two plates would land back to back. */}
            <Reveal className="relative hidden min-h-56 sm:block">
              <div className="absolute inset-0">
                <MediaFrame
                  slot={siteMedia.homeServicesRoom}
                  className="h-full w-full"
                  sizes="(min-width: 768px) 31vw, 46vw"
                />
              </div>
            </Reveal>

            <ServiceCard item={services[2]} index={2} />
            <ServiceCard item={services[3]} index={3} />
          </div>
        </div>
      </section>

      <section className="shell py-section-sm md:py-section">
        <ProjectCarousel projects={projects}>
          <p className="label">{home.work.label}</p>
          <h2 className="display-section mt-5 max-w-[32rem]">
            {home.work.heading}
          </h2>
        </ProjectCarousel>

        <Reveal>
          <div className="mt-14 text-center md:mt-16">
            <Link href={home.work.link.href} className="label btn-solid">
              {home.work.link.label}
            </Link>
          </div>
        </Reveal>
      </section>

      <section className="bg-surface py-section-sm md:py-section">
        <div className="shell">
          <Reveal>
            <div className="max-w-[52ch]">
              <h2 className="display-section max-w-[16ch]">
                {home.cta.heading}
              </h2>
              <p className="mt-7 leading-relaxed text-ink-muted">
                {home.cta.body}
              </p>
              <Link href={home.cta.link.href} className="label btn-solid mt-10">
                {home.cta.link.label}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
