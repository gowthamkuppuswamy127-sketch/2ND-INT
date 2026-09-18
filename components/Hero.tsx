import ScrollExpandMedia from "@/components/ScrollExpandMedia";
import { heroScrollBackground, heroVideo } from "@/lib/media";

// No date/children: the hero carries no other copy (see ScrollExpandMedia's
// own comment on why the trailing content section is gone entirely, not
// just emptied). `title` is the studio name — ScrollExpandMedia splits it
// on its first word and translates each half in the opposite horizontal
// direction as the hero's scroll-expand progresses.
export default function Hero() {
  return (
    <ScrollExpandMedia
      mediaType="video"
      mediaSrc={heroVideo.src}
      posterSrc={heroVideo.poster.src}
      bgImageSrc={heroScrollBackground.src}
      bgImageAlt={heroScrollBackground.alt}
      bgTone={heroScrollBackground.tone}
      title="NILAYAA INTERIORS"
    />
  );
}
