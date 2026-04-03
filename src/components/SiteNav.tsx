"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";

const items = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/consultancy", label: "Consultancy" },
  { href: "/blog", label: "Blog" },
  { href: "/tools", label: "Tools" },
  { href: "/contact", label: "Contact" },
] as const;

export function SiteNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 px-3 pb-3 pt-4 sm:px-4">
      <div className="relative mx-auto max-w-5xl px-10 sm:px-12">
        <nav
          className="mx-auto flex w-fit max-w-full items-center justify-center overflow-x-auto rounded-2xl border px-1 py-1 backdrop-blur-xl [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{
            borderColor: "var(--nav-pill-border)",
            background: "var(--nav-pill-bg)",
            boxShadow:
              "var(--nav-pill-shadow), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
          aria-label="Site"
        >
          <ul className="flex min-w-max items-center gap-0.5 px-0.5 py-0.5 sm:gap-1 sm:px-1">
            {items.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`relative block whitespace-nowrap rounded-xl px-3 py-2.5 text-[13px] font-medium tracking-tight transition sm:px-4 sm:text-sm ${
                      active
                        ? "bg-[color:var(--accent-muted)] text-[color:var(--accent)] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
                        : "text-muted-foreground hover:bg-black/[0.05] hover:text-foreground dark:hover:bg-white/[0.08]"
                    }`}
                    aria-current={active ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="absolute right-1 top-1/2 flex -translate-y-1/2 items-center sm:right-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
