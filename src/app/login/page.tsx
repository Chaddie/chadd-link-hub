import { Suspense } from "react";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-100 px-4">
      <div className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="text-center text-xl font-semibold text-zinc-900">Admin sign in</h1>
        <p className="mt-1 text-center text-sm text-zinc-600">
          Manage links and view click stats.
        </p>
        <div className="mt-6">
          <Suspense fallback={<p className="text-center text-sm text-zinc-500">Loading…</p>}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
