import MediaFrame from "./MediaFrame";
import Reveal from "./Reveal";
import { studio } from "@/content/studio";
import { homeProcess } from "@/lib/media";

/**
 * A four-step teaser of the full five-step process on /studio (handover,
 * the fifth step, is left for that page). Each tile is a single card —
 * photo, then a numbered heading, body copy and a giant `.ghost-number`
 * watermark bleeding off the bottom-right corner. Every step has a matching
 * `homeProcess` photo; the text-only branch below stays as a fallback for
 * a step added without one, same as MediaFrame's own missing-photo idiom.
 */
export default function ProcessGrid() {
  const steps = studio.process.steps.slice(0, 4);

  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((step, i) => {
        const photo = homeProcess[i];
        const number = String(i + 1).padStart(2, "0");

        return (
          <li key={step.title} className="flex">
            <Reveal delay={i * 90} className="flex w-full">
              <div className="relative flex w-full flex-col overflow-hidden rounded-3xl border border-rule bg-surface shadow-sm">
                {photo && (
                  <div className="p-3">
                    <MediaFrame
                      slot={photo}
                      className="rounded-2xl"
                      sizes="(min-width: 1024px) 23vw, (min-width: 640px) 46vw, 100vw"
                      zoom
                    />
                  </div>
                )}
                <div
                  className={`relative isolate flex flex-1 flex-col ${
                    photo ? "px-5 pb-8 pt-2" : "p-7"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="ghost-number pointer-events-none absolute -bottom-3 -z-10 right-4 select-none text-ink text-[5.5rem]"
                  >
                    {number}
                  </span>
                  <h3 className="display-sm text-ink">
                    <span className="text-brass">{number}.</span> {step.title}
                  </h3>
                  <p className="mt-4 leading-relaxed text-ink-muted">
                    {step.body}
                  </p>
                </div>
              </div>
            </Reveal>
          </li>
        );
      })}
    </ul>
  );
}
