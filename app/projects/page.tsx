import type { Metadata } from "next";
import ProjectIndex from "@/components/ProjectIndex";
import Reveal from "@/components/Reveal";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Recent interiors and restoration work by Nilayaa Interiors, a Bengaluru design studio.",
};

export default function ProjectsPage() {
  return (
    <div className="shell py-section-sm md:py-section">
      <Reveal>
        <header className="max-w-[56ch]">
          <p className="label">Index — 2022 to 2024</p>
          <h1 className="display-section mt-5">Recent work</h1>
          <p className="mt-7 leading-relaxed text-ink-muted">
            Every project carries the reference it was drawn under. Earlier work
            is available on request.
          </p>
        </header>
      </Reveal>

      <div className="mt-16 md:mt-20">
        <ProjectIndex projects={projects} />
      </div>
    </div>
  );
}
