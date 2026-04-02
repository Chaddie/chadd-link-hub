export function MissingDatabase() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-100 px-6 text-center">
      <h1 className="text-xl font-semibold text-zinc-900">Database not configured</h1>
      <p className="mt-3 max-w-md text-zinc-600">
        Add <code className="rounded bg-zinc-200 px-1.5 py-0.5 text-sm">DATABASE_URL</code> to{" "}
        <code className="rounded bg-zinc-200 px-1.5 py-0.5 text-sm">.env</code>, then run{" "}
        <code className="rounded bg-zinc-200 px-1.5 py-0.5 text-sm">npm run db:push</code> and{" "}
        <code className="rounded bg-zinc-200 px-1.5 py-0.5 text-sm">npm run db:seed</code>.
      </p>
    </div>
  );
}
