"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { nav, site } from "@/content/studio";

/** Scroll fires far faster than the screen refreshes, and the only thing read
    from it here is a boolean. Coalescing notifications into one per frame
    means `getSnapshot` runs at most 60 times a second instead of on every
    event, and React still only re-renders on the two crossings. */
function subscribeScroll(onChange: () => void) {
  let frame = 0;
  const notify = () => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      onChange();
    });
  };

  window.addEventListener("scroll", notify, { passive: true });
  window.addEventListener("resize", notify, { passive: true });

  return () => {
    if (frame) cancelAnimationFrame(frame);
    window.removeEventListener("scroll", notify);
    window.removeEventListener("resize", notify);
  };
}

/** How far past the hero counts as "past it": measured off the hero's own
    rendered height when `<HeroMedia>` is present (its `#home-hero` id),
    rather than a fixed fraction of the viewport. The hero is a plain
    ~86dvh/100dvh block on most pages, but on desktop the home page's is a
    tall (200dvh) scroll-pinned wrapper for the grow-in effect — a fixed
    `0.7 * innerHeight` threshold would then fire while that effect was still
    barely a third done. Falling back to the old fixed fraction when the
    element isn't found keeps this safe to call on every route, not just
    home. */
function scrolledPastHero(): boolean {
  const hero = document.getElementById("home-hero");
  const threshold = hero
    ? hero.offsetHeight - window.innerHeight * 0.3
    : window.innerHeight * 0.7;
  return window.scrollY > threshold;
}

/** Same `useSyncExternalStore` shape as usePrefersReducedMotion: reads a
    browser value React doesn't own, correct from the very first client
    read rather than lagging a render behind the way effect+setState would. */
function useScrolledPastHero(): boolean {
  return useSyncExternalStore(subscribeScroll, scrolledPastHero, () => false);
}

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);

  // Below `sm` there's no room for the full nav row, so it collapses behind
  // this toggle — see the mobile panel rendered at the end of the header.
  useEffect(() => {
    if (!menuOpen) return;

    const panel = panelRef.current;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        return;
      }

      // Keep Tab inside the panel while it is open. Without this the focus
      // ring walks straight out of an "open" full-screen dialog and onto the
      // page behind it, which for a sighted keyboard user means the focus
      // simply disappears.
      if (event.key !== "Tab" || !panel) return;

      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || !panel.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Move focus into the panel, and remember where to put it back.
    const opener = openerRef.current;
    panel?.querySelector<HTMLElement>("a[href], button")?.focus();

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      opener?.focus();
    };
  }, [menuOpen]);

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
          className={`font-display text-lg leading-none tracking-normal transition-colors sm:text-xl ${
            overlay ? "text-page" : "text-ink"
          }`}
        >
          {site.name}
        </Link>

        <div className="flex items-center gap-6 sm:gap-10">
          <nav aria-label="Main" className="hidden sm:block">
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

          <button
            ref={openerRef}
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            className={`-mr-2 flex size-9 shrink-0 items-center justify-center transition-colors sm:hidden ${
              overlay ? "text-page" : "text-ink"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="size-5"
            >
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Kept mounted (so it can transition) but `inert` while closed. Without
          that the panel is only visually hidden: every link in it stays in
          the tab order and a screen reader still finds an open dialog sitting
          over the page. `inert` takes the whole subtree out of the a11y tree
          and out of focus order, which is what "closed" has to mean.
          overscroll-contain stops a flick inside the panel from chaining
          through to the page behind it. */}
      <div
        ref={panelRef}
        id="mobile-nav"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        inert={!menuOpen}
        className={`fixed inset-0 z-50 flex flex-col overflow-y-auto overscroll-contain bg-page transition-opacity duration-300 sm:hidden ${
          menuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <Link
            href="/"
            aria-label={`${site.name}, home`}
            onClick={() => setMenuOpen(false)}
            className="font-display text-lg leading-none tracking-normal text-ink"
          >
            {site.name}
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="-mr-2 flex size-9 shrink-0 items-center justify-center text-ink"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="size-5"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <nav aria-label="Mobile" className="flex flex-1 flex-col justify-center px-8">
          <ul className="flex flex-col gap-2">
            {nav.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setMenuOpen(false)}
                    className={`display-section block border-b border-rule py-4 ${
                      active ? "text-brass" : "text-ink"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <Link
            href="/contact"
            onClick={() => setMenuOpen(false)}
            className="btn-solid mt-10 self-start text-[0.6875rem] font-semibold uppercase tracking-[0.1em]"
          >
            Enquire
          </Link>
        </nav>
      </div>
    </header>
  );
}
