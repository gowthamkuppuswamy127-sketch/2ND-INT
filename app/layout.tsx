import type { Metadata, Viewport } from "next";
import { Cal_Sans, Golos_Text } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollChrome from "@/components/ScrollChrome";
import "./globals.css";

// Cal Sans ships through next/font/google as a single 400 weight — verified
// directly against this Next.js install's own font-data.json rather than
// assumed, since it isn't a font most people have heard of. Every display
// style in globals.css is set to weight 400 to match: requesting a heavier
// weight next/font hasn't fetched would fall back to the browser's own
// synthetic bold, which Cal Sans's own source site deliberately never uses.
const cal = Cal_Sans({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-cal",
  display: "swap",
});

const golos = Golos_Text({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-golos",
  display: "swap",
});

/**
 * Absolute base for every generated URL — Open Graph images, canonicals and
 * the sitemap. Without it Next emits relative OG URLs, which most crawlers
 * and link-preview services simply drop, so shared links render bare.
 * NEXT_PUBLIC_SITE_URL lets a preview deployment describe itself correctly;
 * the production domain is the fallback.
 */
export const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://nilayaainteriors.com",
);

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "Nilayaa Interiors — Interior design studio",
    template: "%s — Nilayaa Interiors",
  },
  description:
    "Nilayaa Interiors is a Bengaluru interior design studio working on residential and hospitality interiors in natural stone, oak and brass.",
  /* Deliberately no `alternates.canonical` and no `openGraph.url` here.
     Metadata in the root layout is inherited by every route, so a canonical
     of "/" set once at this level would have each of the ten pages telling
     crawlers it was really the home page — worse than declaring none at all.
     Each route sets its own; see app/page.tsx for the home one. */
  openGraph: {
    title: "Nilayaa Interiors",
    description:
      "A Bengaluru interior design studio working in natural stone, oak and brass.",
    siteName: "Nilayaa Interiors",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nilayaa Interiors",
    description:
      "A Bengaluru interior design studio working in natural stone, oak and brass.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#1c1c1d",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${cal.variable} ${golos.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-page text-ink-muted antialiased">
        {/* Runs before body paints. Scroll reveals stay hidden only when JS can
            actually reveal them — see the `.js [data-reveal]` rule. The inline
            script below adds that class straight to the DOM before hydration,
            which is exactly the mismatch `suppressHydrationWarning` above is
            for (node_modules/next/dist/docs/01-app/02-guides/
            preventing-flash-before-hydration.md): without it, React discarded
            the class and re-rendered the whole tree from the root to recover
            on every load, which is what was surfacing as the carousel's
            transient layout glitches. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js')`,
          }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-6 focus:z-50 focus:bg-ink focus:px-5 focus:py-3 focus:text-page label"
        >
          Skip to content
        </a>
        <ScrollChrome />
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
