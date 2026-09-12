"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav, site } from "@/content/studio";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b border-rule">
      <div className="mx-auto flex max-w-[80rem] items-center justify-between gap-4 px-5 py-5 sm:px-8 md:px-10">
        <Link
          href="/"
          aria-label={`${site.name}, home`}
          className="font-display text-base uppercase leading-none tracking-[0.14em] text-ink sm:text-xl sm:tracking-[0.24em]"
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
                    className={`label block py-1 text-[0.6875rem] tracking-[0.1em] transition-colors hover:text-ink sm:text-xs sm:tracking-[0.18em] ${
                      active
                        ? "border-b border-brass text-ink"
                        : "border-b border-transparent"
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
