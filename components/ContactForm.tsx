"use client";

import { useRef, useState } from "react";
import { contact } from "@/content/studio";

type FieldName = "name" | "email" | "message";
type Errors = Partial<Record<FieldName, string>>;

const fieldClass =
  "mt-2 w-full border border-rule bg-page px-4 py-3 text-ink transition-colors placeholder:text-ink-muted/60 hover:border-ink/30";

/** Caps that match the shape of a genuine enquiry. They stop a paste of
    several megabytes from being assembled into a mailto: URL — long enough
    that nobody writing in good faith will meet them. */
const LIMITS = { name: 120, email: 160, where: 160, message: 4000 } as const;

export default function ContactForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState<{ subject: string; body: string } | null>(
    null,
  );
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next: Errors = {};

    const read = (key: string, limit: number) =>
      String(data.get(key) ?? "")
        .trim()
        .slice(0, limit);

    const name = read("name", LIMITS.name);
    const email = read("email", LIMITS.email);
    const where = read("where", LIMITS.where);
    const message = read("message", LIMITS.message);
    const enquiry = read("enquiry", 60);

    // Honeypot. A real person never sees this field, so anything in it came
    // from something filling every input on the page.
    if (String(data.get("company") ?? "").length > 0) {
      // Answer exactly as a success would, and send nothing. A bot that can
      // tell it was caught just tries again differently.
      setSent({ subject: "", body: "" });
      return;
    }

    if (!name) next.name = "Enter your name so we know who we're replying to.";
    if (!email) next.email = "Enter an email address we can reply to.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "That address is missing an @ or a domain.";
    if (!message) next.message = "Tell us a little about the house.";

    setErrors(next);

    if (Object.keys(next).length > 0) {
      const first = Object.keys(next)[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    // This form has no backend, and the studio has no submission endpoint to
    // post to. It previously answered a valid submission with "Message sent"
    // and then dropped it on the floor — every enquiry made through the site
    // was lost, silently, while telling the sender it had arrived.
    //
    // Handing the message to the visitor's own mail client is the honest fix
    // available without an inbox to send to: the mail is really composed, to
    // a real address, and they can see it leave. The confirmation panel below
    // also prints the address and the full text, so a device with no mail
    // client configured still leaves with something it can send.
    const subject = `Enquiry — ${enquiry || "Something else"}${
      where ? ` — ${where}` : ""
    }`;
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Kind of work: ${enquiry || "—"}`,
      `Where: ${where || "—"}`,
      "",
      message,
    ].join("\n");

    setSent({ subject, body });

    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
  }

  if (sent) {
    return (
      <div role="status" className="border border-rule bg-surface p-8 md:p-10">
        <p className="display-sm">Your email is ready to send</p>
        <p className="mt-4 max-w-[52ch] leading-relaxed text-ink-muted">
          We&rsquo;ve opened your mail app with this enquiry filled in — send it
          and we&rsquo;ll reply within a few days. If nothing opened, write to{" "}
          <a
            href={`mailto:${contact.email}`}
            className="link-underline text-ink"
          >
            {contact.email}
          </a>{" "}
          or call the studio on{" "}
          <a
            href={`tel:${contact.phone.replace(/\s/g, "")}`}
            className="link-underline text-ink"
          >
            {contact.phone}
          </a>
          .
        </p>

        {sent.body && (
          <>
            <p className="label mt-8">Your message</p>
            <pre className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap border border-rule bg-page p-4 font-body text-[0.875rem] leading-relaxed text-ink-muted">
              {sent.body}
            </pre>
          </>
        )}

        <button
          type="button"
          onClick={() => setSent(null)}
          className="label link-underline mt-8 text-ink"
        >
          Write another message
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate>
      {/* Honeypot: off-screen rather than display:none, which some bots skip,
          and taken out of the tab order and the a11y tree so nobody using a
          keyboard or a screen reader can land in it by accident. */}
      <div aria-hidden="true" className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
        <label htmlFor="company">Company (leave this empty)</label>
        <input
          id="company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="label">
            Your name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            maxLength={LIMITS.name}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={fieldClass}
          />
          {errors.name && (
            <p id="name-error" role="alert" className="mt-2 text-sm text-ink">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="label">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            maxLength={LIMITS.email}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={fieldClass}
          />
          {errors.email && (
            <p id="email-error" role="alert" className="mt-2 text-sm text-ink">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="enquiry" className="label">
            Kind of work
          </label>
          <select id="enquiry" name="enquiry" className={fieldClass}>
            {contact.enquiryTypes.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="where" className="label">
            Where is it
          </label>
          <input
            id="where"
            name="where"
            type="text"
            autoComplete="address-level2"
            maxLength={LIMITS.where}
            aria-describedby="where-hint"
            className={fieldClass}
          />
          <p id="where-hint" className="mt-2 text-sm text-ink-muted">
            Town or city is enough.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <label htmlFor="message" className="label">
          About the project
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          maxLength={LIMITS.message}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={`${fieldClass} resize-y`}
        />
        {errors.message && (
          <p id="message-error" role="alert" className="mt-2 text-sm text-ink">
            {errors.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="label mt-10 cursor-pointer border border-ink px-8 py-4 text-ink transition-colors duration-300 hover:bg-ink hover:text-page"
      >
        Send message
      </button>
    </form>
  );
}
