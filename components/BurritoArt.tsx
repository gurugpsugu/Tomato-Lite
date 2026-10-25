/**
 * A hand-drawn burrito. No stock photo, no external URL, nothing that can
 * 404 — just vector tortilla, grill marks, filling, and three wisps of steam
 * that rise forever (unless the visitor prefers reduced motion).
 */
export default function BurritoArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 260 170" className={className} aria-hidden="true">
      {/* steam wisps */}
      <g stroke="#f4ede2" strokeWidth="3" strokeLinecap="round" fill="none">
        <path
          className="steam-wisp"
          style={{ animationDelay: "0s" }}
          d="M60 44 C 56 34, 66 28, 62 16"
        />
        <path
          className="steam-wisp"
          style={{ animationDelay: "0.7s" }}
          d="M96 46 C 92 34, 102 28, 98 14"
        />
        <path
          className="steam-wisp"
          style={{ animationDelay: "1.4s" }}
          d="M132 44 C 128 34, 138 28, 134 16"
        />
      </g>
      {/* the wrap */}
      <path
        d="M14 106 C 18 76 58 62 104 66 L 196 74 C 224 77 240 90 238 106 C 236 122 216 134 188 134 L 48 136 C 26 134 12 122 14 106 Z"
        fill="#E9C596"
      />
      {/* fold lines */}
      <path
        d="M30 92 C 70 84 150 82 210 92"
        stroke="#C99A5F"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M24 112 C 80 104 160 102 224 112"
        stroke="#D9AC77"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      {/* rolled end */}
      <ellipse cx="216" cy="104" rx="16" ry="22" fill="#D9A05B" />
      <ellipse cx="216" cy="104" rx="8" ry="12" fill="#C78F49" />
      {/* filling escaping through the seam */}
      <path
        d="M28 84 C 40 70 66 66 88 70 L 80 78 C 62 76 44 78 34 86 Z"
        fill="#F4EAD2"
      />
      <circle cx="52" cy="76" r="5" fill="#4A7C40" />
      <circle cx="70" cy="72" r="4" fill="#B3441F" />
      <circle cx="62" cy="82" r="4.5" fill="#F4EAD2" />
      <circle cx="40" cy="82" r="3.5" fill="#E0A03A" />
      {/* grill marks */}
      <g stroke="#B07F45" strokeWidth="4" strokeLinecap="round">
        <path d="M96 96 l 10 14" />
        <path d="M124 94 l 10 14" />
        <path d="M154 94 l 10 14" />
        <path d="M182 95 l 9 13" />
      </g>
      {/* sesame sprinkles */}
      <g fill="#F4EAD2">
        <circle cx="88" cy="116" r="2" />
        <circle cx="112" cy="120" r="2" />
        <circle cx="140" cy="118" r="2" />
        <circle cx="166" cy="115" r="2" />
      </g>
    </svg>
  );
}
