"use client";

import { useRef, useState } from "react";
import { contact } from "@/content/studio";

type Errors = Partial<Record<"name" | "email" | "message", string>>;

const fieldClass =
  "mt-2 w-full border border-rule bg-page px-4 py-3 text-ink transition-colors placeholder:text-ink-muted/60 hover:border-ink/30";

export default function ContactForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next: Errors = {};

    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

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

    // Stub: no backend yet. Wire this to the studio's inbox before launch.
    setSent(true);
  }

  if (sent) {
    return (
      <div role="status" className="border border-rule bg-surface p-8 md:p-10">
        <p className="display-sm">Message sent</p>
        <p className="mt-4 max-w-[42ch] leading-relaxed text-ink-muted">
          Thank you — we&rsquo;ll reply within a few days. If it&rsquo;s
          urgent, call the studio on {contact.phone}.
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="label link-underline mt-8 text-ink"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate>
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
            className={fieldClass}
          />
          <p className="mt-2 text-sm text-ink-muted">Town or city is enough.</p>
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
