import Link from "next/link";
import ScrollExpandMedia from "@/components/ScrollExpandMedia";
import { home } from "@/content/studio";
import { heroScrollBackground, heroVideo } from "@/lib/media";

export default function Hero() {
  return (
    <ScrollExpandMedia
      mediaType="video"
      mediaSrc={heroVideo.src}
      posterSrc={heroVideo.poster.src}
      bgImageSrc={heroScrollBackground.src}
      bgImageAlt={heroScrollBackground.alt}
      bgTone={heroScrollBackground.tone}
      title={home.hero.headline}
      date={home.hero.eyebrow}
      scrollToExpand="Scroll to explore"
    >
      <div className="shell mx-auto max-w-[44rem] text-center">
        <p className="mx-auto max-w-[50ch] leading-relaxed text-ink-muted">
          {home.hero.subline}
        </p>
        <Link
          href={home.hero.cta.href}
          className="label btn-solid mt-10 inline-block"
        >
          {home.hero.cta.label}
        </Link>
      </div>
    </ScrollExpandMedia>
  );
}
