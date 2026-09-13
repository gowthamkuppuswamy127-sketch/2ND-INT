import Link from "next/link";
import FeatureBand from "@/components/FeatureBand";
import GalleryMarquee from "@/components/GalleryMarquee";
import Hero from "@/components/Hero";
import MediaFrame from "@/components/MediaFrame";
import ProcessGrid from "@/components/ProcessGrid";
import ProjectCarousel from "@/components/ProjectCarousel";
import Reveal from "@/components/Reveal";
import ServiceList from "@/components/ServiceList";
import SpaceStrip from "@/components/SpaceStrip";
import StatsRow from "@/components/StatsRow";
import TeamGrid from "@/components/TeamGrid";
import Testimonials from "@/components/Testimonials";
import { projects } from "@/content/projects";
import { home, site, studio } from "@/content/studio";
import { siteMedia } from "@/lib/media";

export default function HomePage() {
  // Computed, not hand-typed, so it doesn't go stale — same reasoning as
  // the footer's copyright year.
  const stats = [
    {
      value: `${new Date().getFullYear() - site.foundedYear}+`,
      label: "Years in practice",
    },
    ...home.stats.items,
  ];

  return (
    <>
      <Hero />

      <section
        id="intro"
        className="shell scroll-mt-24 py-section-sm md:py-section"
      >
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

      <FeatureBand />

      <section className="bg-surface py-section-sm md:py-section">
        <div className="shell">
          <Reveal>
            <div className="max-w-[34rem]">
              <p className="label">{home.services.label}</p>
              <h2 className="display-section mt-5">{home.services.heading}</h2>
            </div>
          </Reveal>

          <div className="mt-14 md:mt-16">
            <ServiceList />
          </div>

          <div className="mt-14 border-t border-rule pt-12 md:mt-16">
            <StatsRow items={stats} />
          </div>
        </div>
      </section>

      <section className="shell py-section-sm md:py-section">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
            <div className="max-w-[34rem]">
              <p className="label">{studio.process.label}</p>
              <h2 className="display-section mt-5">{studio.process.heading}</h2>
            </div>

            <Link
              href={home.process.link.href}
              className="label link-underline shrink-0 text-ink"
            >
              {home.process.link.label}
            </Link>
          </div>
        </Reveal>

        <div className="mt-14 md:mt-16">
          <ProcessGrid />
        </div>
      </section>

      <section className="bg-surface py-section-sm md:py-section">
        <div className="shell">
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
        </div>
      </section>

      <Reveal>
        <MediaFrame
          slot={siteMedia.homeBand}
          sizes="100vw"
          className="h-[34vh] min-h-64 md:h-[46vh]"
        />
      </Reveal>

      <section className="shell py-section-sm md:py-section">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
          <Reveal>
            <p className="label">{home.testimonials.label}</p>
            <h2 className="display-section mt-5 max-w-[14ch]">
              {home.testimonials.heading}
            </h2>
          </Reveal>

          <Testimonials />
        </div>
      </section>

      <section className="bg-surface py-section-sm text-center md:py-section">
        <Reveal>
          <div className="shell mx-auto max-w-[44rem]">
            <h2 className="display-section mx-auto max-w-[20ch]">
              {home.cta.heading}
            </h2>
            <p className="mx-auto mt-7 max-w-[50ch] leading-relaxed text-ink-muted">
              {home.cta.body}
            </p>
            <Link
              href={home.cta.link.href}
              className="label btn-solid mt-10 inline-block"
            >
              {home.cta.link.label}
            </Link>
          </div>
        </Reveal>
      </section>

      <section className="shell py-section-sm md:py-section">
        <Reveal>
          <div className="max-w-[40rem]">
            <p className="label">{home.experts.label}</p>
            <h2 className="display-section mt-5">{home.experts.heading}</h2>
          </div>
        </Reveal>

        <div className="mt-14 md:mt-16">
          <TeamGrid />
        </div>
      </section>

      <section className="py-section-sm md:py-section">
        <Reveal>
          <div className="shell">
            <p className="label">Gallery</p>
            <h2 className="display-section mt-5 max-w-[20ch]">
              A closer look at the work
            </h2>
          </div>
        </Reveal>

        <div className="mt-12 md:mt-14">
          <GalleryMarquee />
        </div>
      </section>
    </>
  );
}
