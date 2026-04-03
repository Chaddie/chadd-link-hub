import { ContactForm } from "@/components/ContactForm";
import { CONTACT_SITE_EMAIL } from "@/lib/contact-email";

export const metadata = {
  title: "Contact",
  description:
    "Get in touch for Microsoft Intune & M365, web design, or cyber security — response within 24 hours.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 pb-20 pt-8 sm:pt-10">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-start lg:gap-10">
        <aside className="space-y-6 lg:pt-1">
          <div className="text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Contact
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Let&apos;s talk
            </h1>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted-foreground">
              Tell me what you need — I&apos;ll reply with next steps and, where it helps, a
              rough sense of scope.
            </p>
          </div>

          <div className="rounded-xl border border-border/70 bg-[color:var(--card)]/80 px-4 py-4 shadow-sm backdrop-blur-sm dark:border-white/12 dark:bg-[color:var(--card)]/50">
            <div className="space-y-5">
              <div>
                <h2 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Email
                </h2>
                <a
                  href={`mailto:${CONTACT_SITE_EMAIL}`}
                  className="mt-1.5 block break-all text-[15px] font-medium text-accent underline-offset-4 transition hover:underline"
                >
                  {CONTACT_SITE_EMAIL}
                </a>
              </div>
              <div className="h-px bg-border/60 dark:bg-white/10" />
              <div>
                <h2 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Response time
                </h2>
                <p className="mt-1.5 text-[15px] leading-relaxed text-foreground/90">
                  Within 24 hours
                </p>
              </div>
              <div className="h-px bg-border/60 dark:bg-white/10" />
              <div>
                <h2 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Location
                </h2>
                <ul className="mt-2 space-y-1.5 text-[15px] leading-relaxed text-foreground/90">
                  <li className="flex gap-2">
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                      aria-hidden
                    />
                    Manchester, UK
                  </li>
                  <li className="flex gap-2">
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                      aria-hidden
                    />
                    Remote
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </aside>

        <div className="rounded-xl border border-border/80 bg-gradient-to-b from-[color:var(--card)]/95 to-[color:var(--card)]/70 p-5 shadow-md backdrop-blur-md dark:border-white/12 dark:from-white/[0.07] dark:to-white/[0.03] sm:p-6">
          <h2 className="mb-5 font-display text-lg font-semibold tracking-tight sm:text-xl">
            Send a message
          </h2>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
