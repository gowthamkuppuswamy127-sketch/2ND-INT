"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav, site } from "@/content/studio";

export default function Header() {
  const pathname = usePathname();

  /* Home opens on the full-bleed video, so the header floats over it in light
     type. Every other route is cream, where light type would be invisible —
     there it stays in flow and reads in ink. Either way there's no bar. */
  const overlay = pathname === "/";

  return (
    <header className={overlay ? "absolute inset-x-0 top-0 z-40" : "relative border-b border-rule"}>
      {overlay && (
        /* Legibility band. A plain top-to-transparent fade leaves the nav near
           2:1 against a bright frame, so this holds its weight past the type
           before dropping away. */
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-36"
          style={{
            background:
              "linear-gradient(to bottom, rgb(20 17 15 / 0.78) 0%, rgb(20 17 15 / 0.62) 48%, rgb(20 17 15 / 0) 100%)",
          }}
        />
      )}

      <div className="relative mx-auto flex max-w-[80rem] items-center justify-between gap-4 px-5 py-5 sm:px-8 md:px-10">
        <Link
          href="/"
          aria-label={`${site.name}, home`}
          className={`font-display text-base uppercase leading-none tracking-[0.14em] sm:text-xl sm:tracking-[0.24em] ${
            overlay ? "text-page" : "text-ink"
          }`}
        >
          Nilayaa
        </Link>

        <nav aria-label="Main">
          <ul className="flex items-center gap-3.5 sm:gap-8">
            {nav.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`label block border-b py-1 text-[0.6875rem] tracking-[0.1em] transition-colors sm:text-xs sm:tracking-[0.18em] ${
                      overlay
                        ? `text-page/85 hover:text-page ${
                            active ? "border-page" : "border-transparent"
                          }`
                        : `hover:text-ink ${
                            active ? "border-brass text-ink" : "border-transparent"
                          }`
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
