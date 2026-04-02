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
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link
        href="/tools"
        className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
      >
        ← All tools
      </Link>
      <h1 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-zinc-900">
        {title}
      </h1>
      {description ? (
        <p className="mt-2 text-zinc-600">{description}</p>
      ) : null}
      <div className="mt-8">{children}</div>
    </div>
  );
}
