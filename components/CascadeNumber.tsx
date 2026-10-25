"use client";

/**
 * The average rating, staged as a slot machine made of ratings:
 * every character is its own element that falls from above (blurred, then
 * focused), bounces once, and settles exactly where its final value belongs —
 * left to right, one after another. While falling, a digit cycles through
 * random values; the instant it touches down, it locks to the real number.
 *
 * Pure display. The value it settles on is exactly what the backend sent.
 * With reduced motion, it simply prints the final value, no theatre.
 */
import { useEffect, useState } from "react";

const CHAR_DROP_MS = 650; // how long one character's fall lasts
const CHAR_STAGGER_MS = 150; // gap between one character starting and the next
const FIRST_DELAY_MS = 250; // breath before the first digit drops

export default function CascadeNumber({
  value,
  color,
  className,
  textShadow,
}: {
  value: number | string | null;
  color: string;
  className?: string;
  textShadow?: string;
}) {
  const final = value === null ? "—" : String(value);
  const [digits, setDigits] = useState<string[]>(final.split(""));

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lockAt = (index: number) =>
      FIRST_DELAY_MS + index * CHAR_STAGGER_MS + CHAR_DROP_MS;
    const total = FIRST_DELAY_MS + final.length * CHAR_STAGGER_MS + CHAR_DROP_MS + 80;
    const started = performance.now();
    const timer = window.setInterval(() => {
      const elapsed = performance.now() - started;
      setDigits(
        final.split("").map((char, index) =>
          char === "." || char === "—"
            ? char
            : elapsed >= lockAt(index)
              ? char
              : String(Math.floor(Math.random() * 10))
        )
      );
      if (elapsed >= total) {
        window.clearInterval(timer);
        setDigits(final.split(""));
      }
    }, 65);
    return () => window.clearInterval(timer);
  }, [final]);

  return (
    <p className={className} style={{ color, textShadow }} aria-label={final}>
      {digits.map((digit, index) => (
        <span
          key={index}
          aria-hidden="true"
          className="cascade-char"
          style={{ animationDelay: `${FIRST_DELAY_MS + index * CHAR_STAGGER_MS}ms` }}
        >
          {digit}
        </span>
      ))}
    </p>
  );
}
