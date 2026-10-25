"use client";

/**
 * The average rating, in all its theatrical glory: digits scramble through
 * random values and lock into the real number, one character at a time.
 * Pure display — the value it settles on is exactly what the backend sent.
 * With reduced motion, it simply prints the final value, no theatre.
 */
import { useEffect, useState } from "react";

export default function CascadeNumber({
  value,
  color,
  className,
}: {
  value: number | string | null;
  color: string;
  className?: string;
}) {
  const final = value === null ? "—" : String(value);
  const [display, setDisplay] = useState(final);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const totalFrames = Math.max(8, final.length * 4);
    const timer = window.setInterval(() => {
      frame += 1;
      if (frame >= totalFrames) {
        window.clearInterval(timer);
        setDisplay(final);
        return;
      }
      const locked = Math.floor((frame / totalFrames) * final.length);
      setDisplay(
        final
          .split("")
          .map((char, index) =>
            index < locked || char === "."
              ? char
              : String(Math.floor(Math.random() * 10))
          )
          .join("")
      );
    }, 80);
    return () => window.clearInterval(timer);
  }, [final]);

  return (
    <p className={className} style={{ color }}>
      {display}
    </p>
  );
}
