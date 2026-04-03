export function MissingDatabase() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center text-foreground">
      <div
        className="max-w-md rounded-[1.75rem] border p-8 shadow-2xl backdrop-blur-xl"
        style={{
          borderColor: "var(--glass-border)",
          background: "var(--glass-panel-gradient)",
          boxShadow: "var(--glass-shadow)",
        }}
      >
        <h1 className="text-lg font-semibold text-foreground">Database not configured</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Add{" "}
          <code className="rounded-md bg-black/[0.06] px-1.5 py-0.5 font-mono text-xs dark:bg-white/10">
            DATABASE_URL
          </code>{" "}
          to{" "}
          <code className="rounded-md bg-black/[0.06] px-1.5 py-0.5 font-mono text-xs dark:bg-white/10">
            .env
          </code>
          , then run{" "}
          <code className="rounded-md bg-black/[0.06] px-1.5 py-0.5 font-mono text-xs dark:bg-white/10">
            npm run db:push
          </code>{" "}
          and{" "}
          <code className="rounded-md bg-black/[0.06] px-1.5 py-0.5 font-mono text-xs dark:bg-white/10">
            npm run db:seed
          </code>
          .
        </p>
      </div>
    </div>
  );
}
