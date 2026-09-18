import HeroMedia from "@/components/HeroMedia";
import { heroVideo } from "@/lib/media";

export default function Hero() {
  return (
    <HeroMedia
      videoSrc={heroVideo.src}
      poster={heroVideo.poster}
      heroText={
        // The `block` spans force this onto two lines on mobile regardless of
        // viewport width; md:inline lets it flow as one run of text again on
        // the wider, centred layout.
        <>
          <span className="block md:inline">Where Beautiful</span>{" "}
          <span className="block md:inline">Ideas Become Home.</span>
        </>
      }
      cta={{ href: "/contact", label: "Book a Consultation" }}
      scrollCue="Scroll"
    />
  );
}
