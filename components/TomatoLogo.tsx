/**
 * The Tomato Lite mark — Apple-logo logic: one clean silhouette that reads
 * instantly at any size. One tomato-red body, one stem, one pair of leaves.
 * Lives in the header (32px) and as the favicon (16px), one shape for both.
 */
export default function TomatoLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="Tomato Lite">
      {/* body — one soft egg shape, flat colours, no detail */}
      <path
        d="M32 17 C 43 17 51 25 51 36 C 51 47 43 55 32 55 C 21 55 13 47 13 36 C 13 25 21 17 32 17 Z"
        fill="var(--color-accent, #ff4530)"
      />
      {/* the Apple-style dimple at the top, cut with the backdrop colour */}
      <circle cx="32" cy="17.4" r="2.1" fill="#0a0d11" />
      {/* stem */}
      <rect x="30.5" y="5.5" width="3" height="11" rx="1.5" fill="#2ea043" />
      {/* left leaf */}
      <path d="M31 16.5 C 24.5 13.5 19.5 15 16.5 20 C 22.5 21.5 28 19.5 31 17.5 Z" fill="#2ea043" />
      {/* right leaf */}
      <path d="M33 16.5 C 39.5 13.5 44.5 15 47.5 20 C 41.5 21.5 36 19.5 33 17.5 Z" fill="#2ea043" />
    </svg>
  );
}
