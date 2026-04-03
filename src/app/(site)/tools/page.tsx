import Link from "next/link";
import { TOOLS } from "@/lib/tools-registry";

export const metadata = {
  title: "IT Tools",
  description: "Free in-browser utilities for networking and IT work.",
};

export default function ToolsIndexPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 pb-20 pt-6">
      <div className="glass-panel">
        <div className="glass-panel-shine opacity-80" aria-hidden />
        <div className="relative">
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            IT Tools
          </h1>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            Small utilities for DNS, TLS, headers, and day-to-day troubleshooting. Each
            tool opens on its own page.
          </p>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {TOOLS.map((t) => (
              <li key={t.slug}>
                <Link
                  href={`/tools/${t.slug}`}
                  className="block h-full rounded-2xl border border-border bg-card/40 p-5 shadow-md backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:border-accent/25 hover:bg-card/70 hover:shadow-lg dark:border-white/15 dark:bg-white/[0.06] dark:hover:border-white/25 dark:hover:bg-white/[0.1]"
                >
                  <span className="font-medium text-foreground">{t.title}</span>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {t.description}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
