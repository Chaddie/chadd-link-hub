import type { Metadata } from "next";
import Script from "next/script";
import { Fraunces, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { THEME_STORAGE_KEY } from "@/lib/theme-constants";
import { Providers } from "./providers";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nathan Chadwick — Links",
  description: "Links, blog, and tools.",
};

const themeInitScript = `(function(){try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var t=localStorage.getItem(k);var d=document.documentElement;var dark;if(t==="dark")dark=true;else if(t==="light")dark=false;else dark=window.matchMedia("(prefers-color-scheme: dark)").matches;if(dark)d.classList.add("dark");else d.classList.remove("dark")}catch(e){}})()`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${plusJakarta.variable} ${fraunces.variable} ${geistMono.variable} h-full`}
    >
      <body
        suppressHydrationWarning
        className="flex min-h-full flex-col bg-background font-sans text-foreground antialiased"
      >
        <Script id="chadd-theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
