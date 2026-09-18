import ScrollExpandMedia from "@/components/ScrollExpandMedia";
import { heroScrollBackground, heroVideo } from "@/lib/media";

// Still no title/date/children (see ScrollExpandMedia's own comment for why
// the trailing content section is gone entirely rather than just emptied).
// heroText is a distinct, later addition: the page's actual h1, left-aligned
// and held back until ScrollExpandMedia's `contentVisible` goes true — not
// the centered, always-on, split-apart `title` treatment that was removed.
export default function Hero() {
  return (
    <ScrollExpandMedia
      mediaType="video"
      mediaSrc={heroVideo.src}
      posterSrc={heroVideo.poster.src}
      bgImageSrc={heroScrollBackground.src}
      bgImageAlt={heroScrollBackground.alt}
      bgTone={heroScrollBackground.tone}
      heroText="Where Beautiful Ideas Become Home."
    />
  );
}
