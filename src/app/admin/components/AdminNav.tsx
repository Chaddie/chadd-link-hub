"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { ThemeToggle } from "@/components/ThemeToggle";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/links", label: "Links" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/profile", label: "Profile" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-md transition-colors">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <span className="font-semibold text-foreground">Admin</span>
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <nav className="flex flex-wrap items-center gap-4 text-sm">
            {links.map((l) => {
              const active =
                l.href === "/admin/blog"
                  ? pathname.startsWith("/admin/blog")
                  : pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={
                    active
                      ? "font-medium text-accent"
                      : "text-muted-foreground hover:text-foreground"
                  }
                >
                  {l.label}
                </Link>
              );
            })}
            <Link
              href="/"
              className="text-muted-foreground transition hover:text-foreground"
            >
              View site
            </Link>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-muted-foreground transition hover:text-foreground"
            >
              Sign out
            </button>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
