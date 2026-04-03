import { Suspense } from "react";
import { SpaceCanvas } from "@/components/SpaceCanvas";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <SpaceCanvas>
      <div className="flex min-h-screen flex-col">
        <header className="flex justify-end px-4 pt-4">
          <ThemeToggle />
        </header>
        <div className="flex flex-1 flex-col items-center justify-center px-4 pb-24 pt-2">
        <div className="glass-panel w-full max-w-sm p-8 sm:p-10">
          <div className="glass-panel-shine opacity-70" aria-hidden />
          <div className="relative">
            <h1 className="text-center font-display text-xl font-semibold text-foreground">
              Admin sign in
            </h1>
            <p className="mt-1 text-center text-sm text-muted-foreground">
              Manage links, blog, and click stats.
            </p>
            <div className="mt-6">
              <Suspense
                fallback={
                  <p className="text-center text-sm text-muted-foreground">Loading…</p>
                }
              >
                <LoginForm />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
      </div>
    </SpaceCanvas>
  );
}
