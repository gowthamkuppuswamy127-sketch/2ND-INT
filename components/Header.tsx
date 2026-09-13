"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { nav, site } from "@/content/studio";

function subscribeScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

/** Same `useSyncExternalStore` shape as usePrefersReducedMotion: reads a
    browser value React doesn't own, correct from the very first client
    read rather than lagging a render behind the way effect+setState would. */
function useScrolledPastHero(): boolean {
  return useSyncExternalStore(
    subscribeScroll,
    () => window.scrollY > window.innerHeight * 0.7,
    () => false,
  );
}

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  /* Home opens on the full-bleed hero, so the header starts transparent and
     floats over it in light type — `fixed`, so it never reserves flow
     height (the hero stays a true full viewport) and stays pinned while
     the now much longer homepage scrolls. It solidifies once the hero is
     mostly behind you. Every other route has no hero to float over, so it
     is solid from the start and merely `sticky` — already in flow, no
     compensating padding needed on those pages. */
  const scrolledPastHero = useScrolledPastHero();
  const solid = !isHome || scrolledPastHero;

  const overlay = isHome && !solid;

  return (
    <header
      className={`${isHome ? "fixed" : "sticky"} inset-x-0 top-0 z-40 transition-colors duration-500 ${
        solid ? "border-b border-rule bg-page" : ""
      }`}
    >
      {overlay && (
        /* Legibility band. A plain top-to-transparent fade leaves the nav near
           2:1 against a bright frame, so this holds its weight past the type
           before dropping away. */
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-36"
          style={{
            background:
              "linear-gradient(to bottom, rgb(28 28 29 / 0.75) 0%, rgb(28 28 29 / 0.52) 48%, rgb(28 28 29 / 0) 100%)",
          }}
        />
      )}

      <div className="relative mx-auto flex max-w-[80rem] items-center justify-between gap-4 px-5 py-5 sm:px-8 md:px-10">
        <Link
          href="/"
          aria-label={`${site.name}, home`}
          className={`font-display text-lg font-semibold leading-none tracking-tight transition-colors sm:text-xl ${
            overlay ? "text-page" : "text-ink"
          }`}
        >
          {site.shortName}
        </Link>

        <div className="flex items-center gap-6 sm:gap-10">
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
                      className={`block border-b py-1 text-[0.6875rem] font-medium uppercase tracking-[0.1em] transition-colors sm:text-xs sm:tracking-[0.14em] ${
                        overlay
                          ? `text-page/85 hover:text-page ${
                              active ? "border-page" : "border-transparent"
                            }`
                          : `text-ink-muted hover:text-ink ${
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

          <Link
            href="/contact"
            className={`hidden shrink-0 border px-5 py-2.5 text-[0.6875rem] font-semibold uppercase tracking-[0.1em] transition-colors duration-300 sm:inline-block ${
              overlay
                ? "border-page/50 text-page hover:border-page hover:bg-page hover:text-ink"
                : "border-ink text-ink hover:bg-ink hover:text-page"
            }`}
          >
            Enquire
          </Link>
        </div>
      </div>
    </header>
  );
}
