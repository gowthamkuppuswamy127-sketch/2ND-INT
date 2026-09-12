import type { Metadata } from "next";
import { Cinzel, Josefin_Sans } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-cinzel",
  display: "swap",
});

const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-josefin",
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
    <html lang="en" className={`${cinzel.variable} ${josefin.variable}`}>
      <body className="bg-page text-ink antialiased">
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
