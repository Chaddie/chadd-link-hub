"use client";

import { useEffect, useRef } from "react";

/**
 * Full-viewport space backdrop: CSS-drifting nebula + canvas starfield (twinkle + drift).
 * Respects `prefers-reduced-motion` (static stars, no drift).
 */
export function SpaceCanvas({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden text-foreground">
      <div
        className="pointer-events-none fixed inset-0 -z-20 bg-gradient-to-br from-indigo-100/90 via-[#e8ebf4] to-violet-100/70 dark:from-[#0a0618] dark:via-[#05050a] dark:to-[#0c1020]"
        aria-hidden
      />

      {/* Nebula layers — saturated, slow CSS drift */}
      <div
        className="pointer-events-none fixed inset-0 -z-20 space-nebula-violet"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 -z-20 space-nebula-blue"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 -z-20 space-nebula-rose"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 -z-20 space-nebula-cyan"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 -z-20 space-nebula-warm"
        aria-hidden
      />

      <StarfieldCanvas />

      {/* Glass-like corners — subtle pulse on dark */}
      <div
        className="pointer-events-none fixed -left-24 -top-24 z-0 h-72 w-72 rounded-br-[100px] bg-gradient-to-br from-violet-200/55 via-white/40 to-transparent blur-3xl dark:from-violet-500/30 dark:via-indigo-500/15 space-glow-pulse"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed -bottom-32 -right-20 z-0 h-96 w-96 rounded-tl-[120px] bg-gradient-to-tl from-fuchsia-400/20 via-indigo-400/15 to-transparent blur-3xl dark:from-fuchsia-500/22 dark:via-indigo-500/28 space-glow-pulse-delayed"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed bottom-0 left-1/4 z-0 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-300/15 blur-3xl dark:bg-cyan-400/18"
        aria-hidden
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
}

function StarfieldCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const c2d = el.getContext("2d");
    if (!c2d) return;
    const cvs = el;
    const ctx = c2d;

    /** 0 neutral, 1 cyan, 2 violet, 3 warm */
    type Star = {
      x: number;
      y: number;
      r: number;
      baseA: number;
      tw: number;
      phase: number;
      layer: number;
      tint: 0 | 1 | 2 | 3;
    };

    function pickTint(): 0 | 1 | 2 | 3 {
      const r = Math.random();
      if (r < 0.68) return 0;
      if (r < 0.8) return 1;
      if (r < 0.92) return 2;
      return 3;
    }

    function starRgb(dark: boolean, tint: 0 | 1 | 2 | 3): string {
      if (!dark) {
        if (tint === 0) return "15,23,42";
        if (tint === 1) return "8,145,178";
        if (tint === 2) return "109,40,217";
        return "180,83,9";
      }
      if (tint === 0) return "255,255,255";
      if (tint === 1) return "125,211,252";
      if (tint === 2) return "196,181,253";
      return "253,186,116";
    }

    let stars: Star[] = [];
    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let running = true;
    let last = performance.now();

    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    function isDark() {
      return document.documentElement.classList.contains("dark");
    }

    function initStars() {
      const density = Math.min(320, Math.max(80, Math.floor((w * h) / 7000)));
      stars = [];
      for (let i = 0; i < density; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.15 + 0.25,
          baseA: Math.random() * 0.45 + 0.25,
          tw: Math.random() * 0.035 + 0.012,
          phase: Math.random() * Math.PI * 2,
          layer: Math.floor(Math.random() * 3),
          tint: pickTint(),
        });
      }
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      cvs.width = Math.floor(w * dpr);
      cvs.height = Math.floor(h * dpr);
      cvs.style.width = `${w}px`;
      cvs.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initStars();
    }

    function loop(now: number) {
      if (!running) return;
      const reduced = mqReduce.matches;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      ctx.clearRect(0, 0, w, h);
      const dark = isDark();

      const drift = [14, 26, 42];

      for (const s of stars) {
        let alpha = s.baseA;
        if (!reduced) {
          s.phase += s.tw * dt * 2.8;
          alpha *= 0.52 + 0.48 * (0.5 + 0.5 * Math.sin(s.phase));
          s.x += drift[s.layer] * dt;
          if (s.x > w + 3) s.x = -3;
        } else {
          alpha *= 0.72;
        }

        const rgb = starRgb(dark, s.tint);
        const tintBoost = s.tint !== 0 ? 1.08 : 1;
        const a = dark
          ? Math.min(0.95, alpha * (reduced ? 0.62 : 1) * tintBoost)
          : Math.min(0.45, alpha * 0.88 * tintBoost);

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb},${a})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(loop);
    }

    resize();
    last = performance.now();
    const onResize = () => {
      resize();
      last = performance.now();
    };
    window.addEventListener("resize", onResize);

    const onReduceChange = () => initStars();
    mqReduce.addEventListener("change", onReduceChange);

    raf = requestAnimationFrame(loop);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      mqReduce.removeEventListener("change", onReduceChange);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none fixed inset-0 -z-20 mix-blend-multiply opacity-[0.35] dark:opacity-100 dark:mix-blend-screen"
      aria-hidden
    />
  );
}
