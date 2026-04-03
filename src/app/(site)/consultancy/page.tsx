import Link from "next/link";
import { CONSULTANCY_SERVICES } from "@/lib/consultancy-services";

export const metadata = {
  title: "Consultancy",
  description:
    "Microsoft Intune & M365, web design for small businesses, and cyber security assessments — professional services with clear pricing.",
};

export default function ConsultancyPage() {
  const services = CONSULTANCY_SERVICES;
  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-8 sm:pt-10">
      <div className="glass-panel mb-10">
        <div className="glass-panel-shine opacity-80" aria-hidden />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Consultancy
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Professional services
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            Engagements are scoped to your context—whether you&apos;re a small business adopting
            cloud tools or tightening security after growth. Pricing below is a starting point;
            fixed quotes are provided after a short scoping conversation.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {services.map((s) => (
          <article
            key={s.title}
            className="relative overflow-hidden rounded-2xl border border-border/90 bg-gradient-to-b from-card/90 to-card/40 p-6 shadow-lg backdrop-blur-md sm:p-8 dark:border-white/12 dark:from-white/[0.07] dark:to-white/[0.02]"
          >
            <div className="flex flex-col gap-2 border-b border-border/60 pb-5 sm:flex-row sm:items-start sm:justify-between dark:border-white/10">
              <h2 className="font-display text-xl font-semibold leading-snug text-foreground sm:text-2xl">
                {s.title}
              </h2>
              <p className="shrink-0 rounded-full border border-border/80 bg-black/[0.04] px-3 py-1 text-sm font-semibold tabular-nums text-foreground dark:border-white/15 dark:bg-white/10">
                {s.price}
              </p>
            </div>
            <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">{s.summary}</p>
            <ul className="mt-5 space-y-3 text-sm leading-relaxed text-foreground/90">
              {s.points.map((p) => (
                <li key={p} className="flex gap-3">
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                    aria-hidden
                  />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm text-muted-foreground">
          Questions or a tailored quote?{" "}
          <Link href="/contact" className="font-medium text-accent underline-offset-4 hover:underline">
            Get in touch via the contact form
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
