import type { Metadata } from "next";
import { Golos_Text, Instrument_Sans } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

// The brief specified Cal Sans, which isn't distributed through Google
// Fonts (next/font's only reachable source here) — Instrument Sans is the
// closest-spirited stand-in: a confident, tight geometric grotesk with the
// same restrained character at display sizes.
const instrument = Instrument_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-instrument",
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
    <html lang="en" className={`${instrument.variable} ${golos.variable}`}>
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
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
