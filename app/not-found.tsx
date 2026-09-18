import type { Metadata } from "next";
import Link from "next/link";
import { nav } from "@/content/studio";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

/**
 * Replaces Next's built-in 404, which is an unstyled "404 | This page could
 * not be found" with no header, no footer and no way back into the site —
 * every mistyped or stale link dead-ended there.
 */
export default function NotFound() {
  return (
    <div className="shell flex min-h-[60vh] flex-col justify-center py-section-sm md:py-section">
      <p className="label">Error 404</p>
      <h1 className="display-section mt-5 max-w-[18ch]">
        That page isn&rsquo;t here
      </h1>
      <p className="mt-7 max-w-[52ch] leading-relaxed text-ink-muted">
        The link may be out of date, or the address slightly off. The work and
        the studio are both a click away.
      </p>

      <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
        <Link href="/" className="label btn-solid">
          Back to the home page
        </Link>

        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="label link-underline text-ink"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
