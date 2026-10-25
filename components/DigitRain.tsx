"use client";

/**
 * One-shot "matrix rain" of digits behind the average rating.
 * Runs for ~2.4 seconds, fades out, then removes itself from the page.
 * The falling characters are digits (0-9), not katakana — this rain is made
 * of ratings. Skipped entirely when the user prefers reduced motion.
 */
import { useEffect, useRef, useState } from "react";

export default function DigitRain({
  color,
  height = 190,
}: {
  color: string;
  height?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [fading, setFading] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setGone(true);
      return;
    }
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) {
      setGone(true);
      return;
    }

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.parentElement?.clientWidth ?? 320;
    canvas.width = w * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const fontSize = 16;
    const gap = 20;
    const columns = Math.max(1, Math.floor(w / gap));
    const rows = Math.floor(height / fontSize);
    // Negative start positions so columns don't all land at once.
    const drops = Array.from(
      { length: columns },
      () => Math.floor(Math.random() * rows) - rows
    );

    let raf = 0;
    let fadeTimer = 0;
    let fadeStarted = false;
    let lastDraw = 0;
    const started = performance.now();

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      if (now - lastDraw < 55) return;
      lastDraw = now;

      // Translucent dark veil — old digits melt into trails by themselves.
      // Matches the cybertech panel colour (#0B0F14).
      ctx.fillStyle = "rgba(11, 15, 20, 0.24)";
      ctx.fillRect(0, 0, w, height);
      ctx.font = `${fontSize}px ui-monospace, monospace`;

      for (let i = 0; i < columns; i++) {
        const digit = String(Math.floor(Math.random() * 10));
        // Occasional bright head, everything else in the mood colour.
        ctx.fillStyle = Math.random() > 0.93 ? "#faf9f7" : color;
        const y =
          (((drops[i] * fontSize) % (height + fontSize)) + height + fontSize) %
          (height + fontSize);
        ctx.fillText(digit, i * gap + 2, y);
        drops[i] += 1;
        if (drops[i] > rows + 2 && Math.random() > 0.96) {
          drops[i] = Math.floor(Math.random() * -rows);
        }
      }

      if (now - started > 2900 && !fadeStarted) {
        fadeStarted = true;
        setFading(true);
        cancelAnimationFrame(raf);
        fadeTimer = window.setTimeout(() => setGone(true), 1100);
      }
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(fadeTimer);
    };
  }, [color, height]);

  if (gone) return null;
  return (
    <canvas
      ref={canvasRef}
      style={{ height }}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 w-full transition-opacity duration-1000 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
    />
  );
}
