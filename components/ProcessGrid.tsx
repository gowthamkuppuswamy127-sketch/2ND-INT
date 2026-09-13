import MediaFrame from "./MediaFrame";
import Reveal from "./Reveal";
import { studio } from "@/content/studio";
import { homeProcess } from "@/lib/media";

/**
 * A four-step teaser of the full five-step process on /studio. The first
 * three steps get a photo, stacked above their caption; the fourth —
 * `homeProcess` only has three entries — falls through to a text-only card,
 * so handover reads as the outcome rather than another plate in the row.
 */
export default function ProcessGrid() {
  const steps = studio.process.steps.slice(0, 4);

  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((step, i) => {
        const photo = homeProcess[i];

        return (
          <li key={step.title} className="flex">
            <Reveal delay={i * 90} className="flex w-full flex-col">
              {photo ? (
                <>
                  <MediaFrame
                    slot={photo}
                    sizes="(min-width: 1024px) 23vw, (min-width: 640px) 46vw, 100vw"
                    zoom
                  />
                  <div className="mt-5 flex items-start justify-between gap-3">
                    <h3 className="display-sm text-ink">{step.title}</h3>
                    <p className="label shrink-0 tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex h-full flex-col border border-rule bg-surface p-7">
                  <p className="label">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="display-sm mt-3 text-ink">{step.title}</h3>
                  <p className="mt-4 leading-relaxed text-ink-muted">
                    {step.body}
                  </p>
                </div>
              )}
            </Reveal>
          </li>
        );
      })}
    </ul>
  );
}
