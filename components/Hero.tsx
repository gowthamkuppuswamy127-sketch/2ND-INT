import ScrollExpandMedia from "@/components/ScrollExpandMedia";
import { heroScrollBackground, heroVideo } from "@/lib/media";

// No title/date/children: the hero carries no copy of its own, full stop —
// asked for twice now (the studio-name title a previous commit put back
// here, reasoning it was branding rather than copy, is still copy sitting
// in the hero; see ScrollExpandMedia's own comment for why the trailing
// content section is gone entirely rather than just emptied). Just the
// scroll-driven video expand.
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
