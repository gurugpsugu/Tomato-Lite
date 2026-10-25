/**
 * Mood scale — turns the numeric average into a colour + word.
 * Lives on the backend: the API returns the finished mood, the screen only prints it.
 * Never persisted — recomputed from the facts on every single request.
 */

export type Mood = { label: string; color: string; soft: string };

const NEUTRAL: Mood = {
  label: "No verdict yet",
  color: "#8a8578",
  soft: "rgba(138, 133, 120, 0.08)",
};

// Highest band first. First match wins — same pattern as the weather app, documented order.
const BANDS: Array<{ min: number; label: string; color: string }> = [
  { min: 4.5, label: "Loved it", color: "#15803d" }, // deep green
  { min: 4.0, label: "Really good", color: "#16a34a" }, // green
  { min: 3.5, label: "Good", color: "#a16207" }, // amber
  { min: 3.0, label: "Okay", color: "#b45309" }, // light orange
  { min: 2.0, label: "Mixed feelings", color: "#c2410c" }, // terracotta
  { min: 1.0, label: "Poor", color: "#dc2626" }, // red
];

function hexToSoft(hex: string, alpha = 0.08): string {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function moodFromRating(rating: number | null): Mood {
  if (rating === null) return NEUTRAL;
  const band = BANDS.find((candidate) => rating >= candidate.min) ?? BANDS[0];
  return { label: band.label, color: band.color, soft: hexToSoft(band.color) };
}
