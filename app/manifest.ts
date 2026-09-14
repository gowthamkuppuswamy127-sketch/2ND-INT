import type { MetadataRoute } from "next";
import { site } from "@/content/studio";

// Without this file, "Add to Home Screen" has no declared start_url, so
// mobile browsers fall back to bookmarking whichever page happened to be
// open at the time — the studio page, the contact page, whatever was on
// screen when the icon was created. This pins it to the front page.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — Interior design studio`,
    short_name: site.shortName,
    description: site.tagline,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f6f6f6",
    theme_color: "#1c1c1d",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
