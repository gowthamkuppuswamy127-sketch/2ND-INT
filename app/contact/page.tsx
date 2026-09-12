import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import MediaFrame from "@/components/MediaFrame";
import Reveal from "@/components/Reveal";
import { contact } from "@/content/studio";
import { siteMedia } from "@/lib/media";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Nilayaa Interiors about a house, a restoration or a hospitality project.",
};

export default function ContactPage() {
  return (
    <div className="shell py-section-sm md:py-section">
      <Reveal>
        <header className="max-w-[52ch]">
          <p className="label">{contact.label}</p>
          <h1 className="display-section mt-5">{contact.heading}</h1>
          <p className="mt-7 leading-relaxed text-ink-muted">{contact.body}</p>
        </header>
      </Reveal>

      <div className="mt-16 grid gap-14 md:mt-20 md:grid-cols-[1.5fr_1fr] md:gap-20">
        <Reveal>
          <ContactForm />
        </Reveal>

        <Reveal delay={120}>
          <div className="border-t border-rule pt-7">
            <p className="label">Direct</p>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="link-underline text-ink"
                >
                  {contact.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${contact.phone.replace(/\s/g, "")}`}
                  className="link-underline text-ink"
                >
                  {contact.phone}
                </a>
              </li>
            </ul>

            <div className="mt-10 grid gap-8 sm:grid-cols-2 md:grid-cols-1">
              {contact.studios.map((studio) => (
                <div key={studio.name}>
                  <p className="label">{studio.name}</p>
                  <address className="mt-3 text-[0.9375rem] not-italic leading-relaxed text-ink-muted">
                    {studio.lines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </address>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <MediaFrame
                slot={siteMedia.contactRoom}
                sizes="(min-width: 768px) 30vw, 100vw"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
