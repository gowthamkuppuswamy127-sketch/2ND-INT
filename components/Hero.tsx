import ScrollExpandMedia from "@/components/ScrollExpandMedia";
import { heroScrollBackground, heroVideo } from "@/lib/media";

// No title/date/children: the hero carries no copy of its own (see
// ScrollExpandMedia's own comment on why the trailing content section is
// gone entirely, not just emptied). Just the scroll-driven video expand.
export default function Hero() {
  return (
    <ScrollExpandMedia
      mediaType="video"
      mediaSrc={heroVideo.src}
      posterSrc={heroVideo.poster.src}
      bgImageSrc={heroScrollBackground.src}
      bgImageAlt={heroScrollBackground.alt}
      bgTone={heroScrollBackground.tone}
    />
  );
}
