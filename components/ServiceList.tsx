import Link from "next/link";
import Reveal from "./Reveal";
import { home } from "@/content/studio";

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-5 shrink-0 text-ink transition-transform duration-300 ease-out group-hover:rotate-45 group-focus-visible:rotate-45"
    >
      <path fill="currentColor" d="M11 3h2v8h8v2h-8v8h-2v-8H3v-2h8V3Z" />
    </svg>
  );
}

/**
 * The four services as a ruled list rather than a card grid — each row
 * numbered (a genuine, stable order: this is also the order the studio
 * lists its work in on /studio), with a plus that turns into a cross on
 * hover, in place of an arrow.
 */
export default function ServiceList() {
  const { services } = home;

  return (
    <ol className="border-t border-rule">
      {services.items.map((item, i) => (
        <li key={item.title}>
          <Reveal delay={i * 70}>
            <Link
              href={services.link.href}
              className="group flex items-start justify-between gap-6 border-b border-rule py-8 transition-colors duration-300 hover:border-brass focus-visible:border-brass sm:items-center"
            >
              <div className="flex items-baseline gap-5 sm:gap-8">
                <span className="label shrink-0 tabular-nums">
                  /{String(i + 1).padStart(2, "0")}
                </span>
                <span>
                  <h3 className="display-sm text-ink transition-transform duration-300 ease-out group-hover:translate-x-1.5 group-focus-visible:translate-x-1.5">
                    {item.title}
                  </h3>
                  <p className="mt-2 max-w-[48ch] text-[0.9375rem] leading-relaxed text-ink-muted">
                    {item.body}
                  </p>
                </span>
              </div>

              <PlusIcon />
            </Link>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
