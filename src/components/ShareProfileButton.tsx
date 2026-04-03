"use client";

import { useCallback, useState } from "react";

type Props = {
  shareUrl: string;
  title: string;
  text?: string;
};

export function ShareProfileButton({ shareUrl, title, text }: Props) {
  const [feedback, setFeedback] = useState<string | null>(null);

  const runShare = useCallback(async () => {
    setFeedback(null);
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title,
          text: text ?? `Check out ${title}`,
          url: shareUrl,
        });
        return;
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      setFeedback("Link copied");
      window.setTimeout(() => setFeedback(null), 2500);
    } catch {
      window.prompt("Copy this link:", shareUrl);
    }
  }, [shareUrl, title, text]);

  return (
    <div className="mb-2 flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={runShare}
        className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-black/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground shadow-sm transition hover:border-[color:var(--accent)]/40 hover:bg-[color:var(--accent-muted)] hover:text-[color:var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:bg-white/[0.06]"
        aria-label={`Share ${title}`}
      >
        <svg
          className="h-3.5 w-3.5 opacity-80"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
        </svg>
        Share
      </button>
      {feedback ? (
        <span className="text-[11px] font-medium text-[color:var(--accent)]" role="status">
          {feedback}
        </span>
      ) : null}
    </div>
  );
}
