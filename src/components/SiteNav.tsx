import Link from "next/link";

const items = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/tools", label: "Tools" },
];

export function SiteNav() {
  return (
    <header className="border-b border-[var(--border)] bg-[var(--card-bg)]/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-3xl items-center justify-center gap-6 px-4 py-3 text-sm font-medium text-[var(--text-secondary)] sm:justify-end">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="transition hover:text-[var(--text-heading)]"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
