import Link from "next/link";
import { contact, nav, site } from "@/content/studio";

export default function Footer() {
  return (
    /* Ink ground. Brass drops to 3.25:1 here — large text/icons only, never
       small caps — so labels use `lighter` instead, which clears 6.46:1. */
    /* No top margin: every page already ends with its own section padding. */
    <footer className="bg-ink text-page">
      <div className="mx-auto max-w-[80rem] px-5 py-16 sm:px-8 md:px-10 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <p className="font-display text-xl font-semibold uppercase leading-none tracking-[0.2em]">
              Nilayaa
            </p>
            <p className="mt-5 max-w-[34ch] text-[0.9375rem] leading-relaxed text-page/80">
              An interior design studio working in lime, teak, stone and brass
              across Tamil Nadu and Kerala.
            </p>
          </div>

          <nav aria-label="Footer">
            <p className="label text-lighter">Pages</p>
            <ul className="mt-4 space-y-2">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="link-underline text-[0.9375rem] text-page"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="label text-lighter">Studio</p>
            <ul className="mt-4 space-y-2 text-[0.9375rem]">
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="link-underline text-page"
                >
                  {contact.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${contact.phone.replace(/\s/g, "")}`}
                  className="link-underline text-page"
                >
                  {contact.phone}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-16 border-t border-page/15 pt-6 text-[0.8125rem] text-page/60">
          © {new Date().getFullYear()} {site.name}
        </p>
      </div>
    </footer>
  );
}
