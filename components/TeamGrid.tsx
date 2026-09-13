"use client";

import { useState } from "react";
import MediaFrame from "./MediaFrame";
import { home } from "@/content/studio";
import { homeExperts } from "@/lib/media";

/**
 * Same hover-swap pattern as ServiceList: a numbered list of roles on the
 * left, the matching portrait swapped in on the right. Below lg each row
 * carries its own portrait inline instead — see ProjectIndex.
 */
export default function TeamGrid() {
  const { roles } = home.experts;
  const [active, setActive] = useState(0);

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_0.85fr] lg:gap-16">
      <ol className="border-t border-rule">
        {roles.map((role, i) => (
          <li key={role.title}>
            <button
              type="button"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className="group flex w-full items-baseline gap-5 border-b border-rule py-7 text-left transition-colors duration-300 hover:border-brass focus-visible:border-brass sm:gap-8"
            >
              <span className="label shrink-0 tabular-nums">
                /{String(i + 1).padStart(2, "0")}
              </span>
              <span>
                <h3 className="display-sm text-ink transition-transform duration-300 ease-out group-hover:translate-x-1.5 group-focus-visible:translate-x-1.5">
                  {role.title}
                </h3>
                <p className="mt-2 max-w-[38ch] text-[0.9375rem] leading-relaxed text-ink-muted">
                  {role.body}
                </p>
              </span>
            </button>

            <div className="mt-6 lg:hidden">
              <MediaFrame
                slot={homeExperts[i]}
                sizes="(min-width: 640px) 45vw, 90vw"
                zoom
              />
            </div>
          </li>
        ))}
      </ol>

      <div className="hidden lg:block" aria-hidden="true">
        <div className="sticky top-28">
          <div className="relative" style={{ aspectRatio: "4 / 5" }}>
            {homeExperts.map((portrait, i) => (
              <div
                key={portrait.alt}
                className={`absolute inset-0 transition-opacity duration-500 ease-out ${
                  i === active ? "opacity-100" : "opacity-0"
                }`}
              >
                <MediaFrame slot={portrait} sizes="35vw" className="h-full" />
              </div>
            ))}
          </div>
          <p className="label mt-5">{roles[active].title}</p>
        </div>
      </div>
    </div>
  );
}
