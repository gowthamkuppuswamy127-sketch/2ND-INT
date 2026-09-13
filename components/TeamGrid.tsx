import MediaFrame from "./MediaFrame";
import Reveal from "./Reveal";
import { home } from "@/content/studio";
import { homeExperts } from "@/lib/media";

export default function TeamGrid() {
  const { roles } = home.experts;

  return (
    <ul className="grid gap-8 sm:grid-cols-3">
      {roles.map((role, i) => (
        <li key={role.title}>
          <Reveal delay={i * 90}>
            <MediaFrame
              slot={homeExperts[i]}
              sizes="(min-width: 768px) 30vw, 90vw"
              zoom
            />
            <h3 className="display-sm mt-5 text-ink">{role.title}</h3>
            <p className="mt-2 max-w-[32ch] text-[0.9375rem] leading-relaxed text-ink-muted">
              {role.body}
            </p>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
