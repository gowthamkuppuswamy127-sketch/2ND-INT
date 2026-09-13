"use client";

import Link from "next/link";
import { useState } from "react";
import MediaFrame from "./MediaFrame";
import { home } from "@/content/studio";
import { homeServicePanels } from "@/lib/media";

/**
 * The four services as a numbered list on the left, each hover or focus
 * swapping the photo panel on the right — the source site's own recurring
 * pattern, reused again for the team below. Below lg, where there's no
 * hover, each row carries its own photo inline instead; see ProjectIndex
 * for the same split.
 */
export default function ServiceList() {
  const { services } = home;
  const [active, setActive] = useState(0);

  return (
    <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
      <ol className="border-t border-rule">
        {services.items.map((item, i) => (
          <li key={item.title}>
            <Link
              href={services.link.href}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className="group flex items-start justify-between gap-6 border-b border-rule py-7 transition-colors duration-300 hover:border-brass focus-visible:border-brass sm:items-center"
            >
              <div className="flex items-baseline gap-5 sm:gap-8">
                <span className="label shrink-0 tabular-nums">
                  /{String(i + 1).padStart(2, "0")}
                </span>
                <span>
                  <h3 className="display-sm text-ink transition-transform duration-300 ease-out group-hover:translate-x-1.5 group-focus-visible:translate-x-1.5">
                    {item.title}
                    {/* Read out so a screen reader's link list isn't four
                        identical "Enquire" entries; not shown visually. */}
                    <span className="sr-only"> — enquire {item.enquiry}</span>
                  </h3>
                  <p className="mt-2 max-w-[42ch] text-[0.9375rem] leading-relaxed text-ink-muted">
                    {item.body}
                  </p>
                </span>
              </div>

              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="size-5 shrink-0 text-ink transition-transform duration-300 ease-out group-hover:rotate-45 group-focus-visible:rotate-45"
              >
                <path fill="currentColor" d="M11 3h2v8h8v2h-8v8h-2v-8H3v-2h8V3Z" />
              </svg>
            </Link>

            <div className="mt-6 lg:hidden">
              <MediaFrame slot={homeServicePanels[i]} sizes="90vw" zoom />
            </div>
          </li>
        ))}
      </ol>

      {/* Duplicates the row content, so it stays out of the a11y tree. */}
      <div className="hidden lg:block" aria-hidden="true">
        <div className="sticky top-28">
          <div className="relative" style={{ aspectRatio: "4 / 3" }}>
            {homeServicePanels.map((panel, i) => (
              <div
                key={panel.alt}
                className={`absolute inset-0 transition-opacity duration-500 ease-out ${
                  i === active ? "opacity-100" : "opacity-0"
                }`}
              >
                <MediaFrame slot={panel} sizes="42vw" className="h-full" />
              </div>
            ))}
          </div>
          <p className="label mt-5">{services.items[active].title}</p>
        </div>
      </div>
    </div>
  );
}
