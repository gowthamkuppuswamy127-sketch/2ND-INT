import ScrollExpandMedia from "@/components/ScrollExpandMedia";
import { heroScrollBackground, heroVideo } from "@/lib/media";

// Still no title/date/children (see ScrollExpandMedia's own comment for why
// the trailing content section is gone entirely rather than just emptied).
// heroText is a distinct, later addition: the page's actual h1, held back
// until ScrollExpandMedia's `contentVisible` goes true — not the always-on,
// split-apart `title` treatment that was removed.
export default function Hero() {
  return (
    <ScrollExpandMedia
      mediaType="video"
      mediaSrc={heroVideo.src}
      posterSrc={heroVideo.poster.src}
      bgImageSrc={heroScrollBackground.src}
      bgImageAlt={heroScrollBackground.alt}
      bgTone={heroScrollBackground.tone}
      heroText={
        // The `block` spans force this onto two lines on mobile regardless
        // of viewport width; md:inline lets it flow as one run of text
        // (unchanged from before) once ScrollExpandMedia's own md:
        // overrides take over.
        <>
          <span className="block md:inline">Where Beautiful</span>{" "}
          <span className="block md:inline">Ideas Become Home.</span>
        </>
      }
      heroCta={{ href: "/contact", label: "Book a Consultation" }}
    />
  );
}
