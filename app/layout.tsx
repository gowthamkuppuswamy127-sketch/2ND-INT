import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: {
    default: "Nilayaa Interiors — Interior design studio",
    template: "%s — Nilayaa Interiors",
  },
  description:
    "Nilayaa Interiors is an interior design studio working on residential and hospitality interiors in natural stone, oak and brass.",
  openGraph: {
    title: "Nilayaa Interiors",
    description:
      "An interior design studio working in natural stone, oak and brass.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cal.variable} ${golos.variable}`}>
      <body className="bg-page text-ink-muted antialiased">
        {/* Runs before body paints. Scroll reveals stay hidden only when JS can
            actually reveal them — see the `.js [data-reveal]` rule. */}
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
