/**
 * The Tomato Lite mark — Apple-logo logic: one clean silhouette that reads
 * instantly at any size. One tomato-red body, one stem, one pair of leaves,
 * and the bite — cut out with an SVG mask, so it is a true notch in the
 * shape, not a background-coloured patch. Recognizable at 16px (the favicon),
 * 32px (the header), and 512px (an app icon someday).
 */
export default function TomatoLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="Tomato Lite">
      <defs>
        {/* the bite — one mouthful of circle, top-right, like the Apple mark */}
        <mask id="tomato-bite">
          <rect width="64" height="64" fill="white" />
          <circle cx="57" cy="29" r="10" fill="black" />
        </mask>
      </defs>
      {/* body — one soft egg shape, flat colours, no detail */}
      <path
        d="M32 17 C 43 17 51 25 51 36 C 51 47 43 55 32 55 C 21 55 13 47 13 36 C 13 25 21 17 32 17 Z"
        fill="var(--color-accent, #ff4530)"
        mask="url(#tomato-bite)"
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
