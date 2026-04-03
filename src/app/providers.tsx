"use client";

import { SessionProvider } from "next-auth/react";
import { AppThemeProvider } from "@/components/AppThemeProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppThemeProvider>
      <SessionProvider>{children}</SessionProvider>
    </AppThemeProvider>
  );
}
