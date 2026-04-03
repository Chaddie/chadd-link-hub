import Link from "next/link";

export const metadata = {
  title: "About",
  description: "Nathan Chadwick — background, focus areas, and how to get in touch.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 pb-24 pt-8 sm:pt-10">
      <div className="glass-panel">
        <div className="glass-panel-shine opacity-80" aria-hidden />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            About
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Nathan Chadwick
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
            I&apos;m a technologist and engineer based in the UK, with a focus on Microsoft 365,
            endpoint management, and pragmatic delivery. I care about clear communication, solid
            architecture, and shipping work that actually holds up in production—not just in a
            slide deck.
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
            Outside of client work, I build tools and side projects (including this site), share
            notes on the blog, and stay active in the gym—I&apos;m into training, fitness, and
            anything that keeps energy and discipline high.
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
            At home I share the place with two very opinionated French bulldogs—life is never
            boring.
          </p>
          <div className="mt-10 rounded-2xl border border-border/80 bg-black/[0.02] p-6 dark:bg-white/[0.04]">
            <h2 className="text-sm font-semibold text-foreground">Working together</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              If you need help with Intune, M365, a security review, or a small-business web
              presence, have a look at the services outlined on the consultancy page—pricing is
              listed there as a starting point.
            </p>
            <Link
              href="/consultancy"
              className="mt-4 inline-flex items-center text-sm font-medium text-accent transition hover:opacity-90"
            >
              View consultancy services →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
