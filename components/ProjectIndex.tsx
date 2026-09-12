"use client";

import Link from "next/link";
import { useState } from "react";
import MediaFrame from "./MediaFrame";
import type { Project } from "@/content/projects";

/**
 * The studio's work as a drawing schedule: reference, name, location, year,
 * ruled. On wide screens a sticky plate to the right shows whichever row is
 * hovered *or focused*, so the reveal is not mouse-only. Below lg the image
 * sits inside its own row instead, since touch has no hover.
 */
export default function ProjectIndex({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState(0);

  return (
    <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
      <ol className="border-t border-rule">
        {projects.map((project, i) => (
          <li key={project.slug}>
            <Link
              href={`/projects/${project.slug}`}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className="group block border-b border-rule py-7 transition-colors duration-300 hover:border-brass focus-visible:border-brass"
            >
              <div className="flex items-baseline justify-between gap-4">
                <span className="label shrink-0 tabular-nums">
                  {project.ref}
                </span>
                <span className="label shrink-0">{project.year}</span>
              </div>

              <h3 className="display-sm mt-3 text-ink transition-transform duration-300 ease-out group-hover:translate-x-1.5 group-focus-visible:translate-x-1.5 sm:text-[1.375rem]">
                {project.name}
              </h3>

              <p className="mt-2 max-w-[46ch] text-[0.9375rem] leading-relaxed text-ink-muted">
                {project.summary}
              </p>

              <p className="label mt-4">
                {project.location} · {project.typology}
              </p>

              <div className="mt-6 lg:hidden">
                <MediaFrame
                  slot={project.cover}
                  sizes="(min-width: 640px) 90vw, 100vw"
                />
              </div>
            </Link>
          </li>
        ))}
      </ol>

      {/* Duplicates the row content, so it stays out of the a11y tree. */}
      <div className="hidden lg:block" aria-hidden="true">
        <div className="sticky top-12">
          <div className="relative" style={{ aspectRatio: "4 / 3" }}>
            {projects.map((project, i) => (
              <div
                key={project.slug}
                data-preview-pane={i}
                data-active={i === active ? "true" : "false"}
                className={`absolute inset-0 transition-opacity duration-500 ease-out ${
                  i === active ? "opacity-100" : "opacity-0"
                }`}
              >
                <MediaFrame
                  slot={{ ...project.cover, aspect: "4 / 3" }}
                  sizes="45vw"
                  className="h-full"
                />
              </div>
            ))}
          </div>
          <p className="label mt-5">{projects[active].ref}</p>
        </div>
      </div>
    </div>
  );
}
