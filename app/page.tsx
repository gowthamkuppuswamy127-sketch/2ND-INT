import Link from "next/link";
import Hero from "@/components/Hero";
import MediaFrame from "@/components/MediaFrame";
import Reveal from "@/components/Reveal";
import { selectedProjects } from "@/content/projects";
import { home } from "@/content/studio";
import { siteMedia } from "@/lib/media";

export default function HomePage() {
  return (
    <>
      <Hero />

      <section className="shell py-section-sm md:py-section">
        <div className="grid items-start gap-12 md:grid-cols-2 md:gap-16">
          <Reveal>
            <p className="label">{home.philosophy.label}</p>
            <h2 className="display-section mt-5 max-w-[14ch]">
              {home.philosophy.heading}
            </h2>
            <div className="mt-8 space-y-5 prose-measure text-ink-muted">
              {home.philosophy.body.map((paragraph) => (
                <p key={paragraph} className="leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
            <Link
              href={home.philosophy.link.href}
              className="label link-underline mt-8 inline-block text-ink"
            >
              {home.philosophy.link.label}
            </Link>
          </Reveal>

          <Reveal delay={120}>
            <MediaFrame
              slot={siteMedia.homePhilosophy}
              sizes="(min-width: 768px) 45vw, 100vw"
            />
          </Reveal>
        </div>
      </section>

      <section className="shell pb-section-sm md:pb-section">
        <Reveal>
          <div className="flex items-end justify-between gap-6 border-b border-rule pb-6">
            <h2 className="display-section">Selected work</h2>
            <Link
              href="/projects"
              className="label link-underline shrink-0 text-ink"
            >
              All projects
            </Link>
          </div>
        </Reveal>

        <ul className="mt-12 grid gap-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {selectedProjects.map((project, i) => (
            <li key={project.slug} className="flex">
              <Reveal delay={i * 100} className="flex w-full">
                {/* Column with the meta pushed to the bottom, so a title that
                    wraps to two lines doesn't shunt its row out of alignment. */}
                <Link
                  href={`/projects/${project.slug}`}
                  className="group flex w-full flex-col"
                >
                  <MediaFrame
                    slot={{ ...project.cover, aspect: "3 / 4" }}
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                  />
                  <p className="label mt-5">{project.ref}</p>
                  <h3 className="display-sm mt-2 transition-transform duration-300 ease-out group-hover:translate-x-1 group-focus-visible:translate-x-1">
                    {project.name}
                  </h3>
                  <p className="label mt-auto pt-3">
                    {project.location} · {project.year}
                  </p>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-surface py-section-sm md:py-section">
        <div className="shell">
          <Reveal>
            <p className="label">{home.services.label}</p>
            <h2 className="display-section mt-5">{home.services.heading}</h2>
          </Reveal>

          <dl className="mt-14 grid gap-px border border-rule bg-rule sm:grid-cols-2">
            {home.services.items.map((item, i) => (
              <div key={item.title} className="bg-surface p-8 md:p-10">
                <Reveal delay={i * 80}>
                  <dt className="display-sm">{item.title}</dt>
                  <dd className="mt-4 max-w-[38ch] leading-relaxed text-ink-muted">
                    {item.body}
                  </dd>
                </Reveal>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="shell py-section-sm md:py-section">
        <Reveal>
          <div className="max-w-[52ch]">
            <h2 className="display-section max-w-[16ch]">
              {home.cta.heading}
            </h2>
            <p className="mt-7 leading-relaxed text-ink-muted">
              {home.cta.body}
            </p>
            <Link
              href={home.cta.link.href}
              className="label mt-10 inline-block border border-ink px-8 py-4 text-ink transition-colors duration-300 hover:bg-ink hover:text-page"
            >
              {home.cta.link.label}
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
