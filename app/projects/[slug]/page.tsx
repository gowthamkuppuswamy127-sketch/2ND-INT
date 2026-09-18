import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import MediaFrame from "@/components/MediaFrame";
import Reveal from "@/components/Reveal";
import { getProject, projects } from "@/content/projects";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) return {};

  const path = `/projects/${project.slug}`;

  return {
    title: project.name,
    description: project.summary,
    alternates: { canonical: path },
    openGraph: {
      title: project.name,
      description: project.summary,
      url: path,
      type: "article",
      images: project.cover.src
        ? [{ url: project.cover.src, alt: project.cover.alt }]
        : undefined,
    },
  };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) notFound();

  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(index + 1) % projects.length];

  return (
    <article className="py-section-sm md:py-section">
      <header className="shell">
        <Link href="/projects" className="label link-underline text-ink">
          Back to index
        </Link>

        <div className="mt-10 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-b border-rule pb-7">
          <p className="label">{project.ref}</p>
          <p className="label">{project.year}</p>
        </div>

        <h1 className="display-hero mt-9 max-w-[18ch] text-[clamp(2rem,5vw,3.75rem)]">
          {project.name}
        </h1>
        <p className="mt-7 max-w-[50ch] text-lg leading-relaxed text-ink-muted">
          {project.summary}
        </p>
      </header>

      <div className="shell mt-14 md:mt-20">
        <MediaFrame slot={project.cover} preload sizes="100vw" />
      </div>

      <div className="shell mt-16 grid gap-14 md:mt-24 md:grid-cols-[1.4fr_1fr] md:gap-20">
        <Reveal>
          <div className="space-y-6 prose-measure text-ink-muted">
            {project.brief.map((paragraph) => (
              <p key={paragraph} className="leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="border-t border-rule pt-7">
            <dl>
              {project.specs.map((spec) => (
                <div
                  key={spec.label}
                  className="flex justify-between gap-6 border-b border-rule py-4"
                >
                  <dt className="label">{spec.label}</dt>
                  <dd className="text-right text-[0.9375rem] text-ink">
                    {spec.value}
                  </dd>
                </div>
              ))}
            </dl>

            <p className="label mt-10">Materials</p>
            <ul className="mt-4 space-y-2">
              {project.materials.map((material) => (
                <li
                  key={material}
                  className="text-[0.9375rem] leading-relaxed text-ink-muted"
                >
                  {material}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>

      <div className="shell mt-20 grid gap-8 md:mt-28 md:grid-cols-2">
        {project.gallery.map((slot, i) => {
          /* The lead plate runs full width; each keeps its own true aspect
             ratio rather than being cropped to match its neighbour, so the
             pair below won't always share a bottom edge — expected in a
             gallery of real, differently-shaped photographs. */
          const lead = i === 0;

          return (
            <Reveal
              key={slot.alt}
              delay={i * 90}
              className={lead ? "md:col-span-2" : undefined}
            >
              <MediaFrame
                slot={slot}
                sizes={
                  lead
                    ? "(min-width: 768px) 90vw, 100vw"
                    : "(min-width: 768px) 45vw, 100vw"
                }
              />
            </Reveal>
          );
        })}
      </div>

      <nav className="shell mt-20 border-t border-rule pt-8 md:mt-28" aria-label="Next project">
        <Link href={`/projects/${next.slug}`} className="group block">
          <p className="label">Next project</p>
          <p className="display-sm mt-3 transition-transform duration-300 ease-out group-hover:translate-x-1.5 group-focus-visible:translate-x-1.5">
            {next.name}
          </p>
        </Link>
      </nav>
    </article>
  );
}
