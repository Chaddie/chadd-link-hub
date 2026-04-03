"use client";

import { useState } from "react";
import { CONTACT_INQUIRY_OPTIONS } from "@/lib/consultancy-services";

const labelClass =
  "mb-1.5 block text-[13px] font-medium text-foreground/90";
const fieldClass =
  "w-full rounded-xl border border-border/80 bg-[color:var(--card)] px-3.5 py-2.5 text-[15px] text-foreground shadow-inner outline-none transition placeholder:text-muted-foreground focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent)]/25 dark:border-white/12";
/** Select: matches inputs; native dropdown theming via `color-scheme` + `select` rules in globals.css */
const selectFieldClass = `${fieldClass} cursor-pointer appearance-none pr-10`;

export function ContactForm() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setOk(false);
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const inquiry = String(fd.get("inquiry") ?? "").trim();
    const company = String(fd.get("company") ?? "").trim();
    const message = String(fd.get("message") ?? "").trim();

    setPending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          inquiry,
          company: company || undefined,
          message,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
      };
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }
      setOk(true);
      e.currentTarget.reset();
    } catch {
      setError("Network error. Check your connection and try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="relative space-y-5"
      noValidate
    >
      {ok ? (
        <div
          className="rounded-xl border border-emerald-500/35 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-950 dark:text-emerald-100"
          role="status"
        >
          Thanks — your message was sent. We&apos;ll get back to you soon.
        </div>
      ) : null}
      {error ? (
        <div
          className="rounded-xl border border-red-500/35 bg-red-500/10 px-4 py-3 text-sm text-red-950 dark:text-red-100"
          role="alert"
        >
          {error}
        </div>
      ) : null}

      <div>
        <label htmlFor="contact-name" className={labelClass}>
          Your Name
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          autoComplete="name"
          className={fieldClass}
          disabled={pending}
        />
      </div>

      <div>
        <label htmlFor="contact-email" className={labelClass}>
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={fieldClass}
          disabled={pending}
        />
      </div>

      <div>
        <label htmlFor="contact-inquiry" className={labelClass}>
          What are you looking for
        </label>
        <div className="relative">
          <select
            id="contact-inquiry"
            name="inquiry"
            required
            className={selectFieldClass}
            defaultValue=""
            disabled={pending}
          >
            <option value="" disabled>
              Select an option
            </option>
            {CONTACT_INQUIRY_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <span
            className="pointer-events-none absolute right-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center text-[color:var(--accent)] opacity-90"
            aria-hidden
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </span>
        </div>
      </div>

      <div>
        <label htmlFor="contact-company" className={labelClass}>
          Company Name <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <input
          id="contact-company"
          name="company"
          type="text"
          autoComplete="organization"
          className={fieldClass}
          disabled={pending}
        />
      </div>

      <div>
        <label htmlFor="contact-message" className={labelClass}>
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={6}
          className={`${fieldClass} min-h-[140px] resize-y`}
          disabled={pending}
        />
      </div>

      <div className="pt-1">
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-2xl bg-[color:var(--accent)] px-5 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-black/15 transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-60 dark:shadow-black/40"
        >
          {pending ? "Sending…" : "Send Message!"}
        </button>
      </div>
    </form>
  );
}
