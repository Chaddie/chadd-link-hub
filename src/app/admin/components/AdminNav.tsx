"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/links", label: "Links" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/profile", label: "Profile" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <span className="font-semibold text-zinc-900">Admin</span>
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
                  ? "font-medium text-zinc-900"
                  : "text-zinc-600 hover:text-zinc-900"
              }
            >
              {l.label}
            </Link>
            );
          })}
          <Link href="/" className="text-zinc-600 hover:text-zinc-900">
            View site
          </Link>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-zinc-600 hover:text-zinc-900"
          >
            Sign out
          </button>
        </nav>
      </div>
    </header>
  );
}
