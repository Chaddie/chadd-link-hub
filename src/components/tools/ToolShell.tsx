import Link from "next/link";

export function ToolShell({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-20 pt-6">
      <div className="glass-panel">
        <div className="glass-panel-shine opacity-80" aria-hidden />
        <div className="relative">
          <Link
            href="/tools"
            className="text-sm font-medium text-accent transition hover:opacity-80"
          >
            ← All tools
          </Link>
          <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
              {description}
            </p>
          ) : null}
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
