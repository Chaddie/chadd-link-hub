import Link from "next/link";
import { TOOLS } from "@/lib/tools-registry";

export const metadata = {
  title: "IT Tools",
  description: "Free in-browser utilities for networking and IT work.",
};

export default function ToolsIndexPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="font-serif text-3xl font-semibold tracking-tight text-zinc-900">
        IT Tools
      </h1>
      <p className="mt-2 max-w-2xl text-zinc-600">
        Small utilities for DNS, TLS, headers, and day-to-day troubleshooting. Each tool opens on its own page.
      </p>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2">
        {TOOLS.map((t) => (
          <li key={t.slug}>
            <Link
              href={`/tools/${t.slug}`}
              className="block h-full rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md"
            >
              <span className="font-medium text-zinc-900">{t.title}</span>
              <p className="mt-2 text-sm text-zinc-600">{t.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
