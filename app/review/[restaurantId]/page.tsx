"use client";

/**
 * Screen 1 — /review/[restaurantId]
 *
 * A star picker, a comment box, one Submit button. On submit the frontend hands
 * three values to POST /api/reviews and steps back — it validates only where it
 * is kind (disabling the button), never where it is security (the backend's job).
 */
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function WriteReviewPage() {
  const params = useParams<{ restaurantId: string }>();
  const restaurantId = Number(params.restaurantId);
  const router = useRouter();

  const [name, setName] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0); // 0 = not hovering; used for fill preview only
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // The restaurant name, so I know what I am reviewing.
  useEffect(() => {
    let ignore = false; // a slow earlier reply must not overwrite a navigation
    fetch(`/api/restaurants/${params.restaurantId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!ignore) {
          if (data) setName(data.name);
          else setNotFound(true);
        }
      });
    return () => {
      ignore = true;
    };
  }, [params.restaurantId]);

  if (notFound) {
    return (
      <main className="min-h-screen">
        <div className="mx-auto max-w-[560px] px-6 py-24">
          <p className="text-sm text-muted">This restaurant does not exist.</p>
        </div>
      </main>
    );
  }

  const canSubmit = rating >= 1 && comment.trim().length > 0 && !submitting;

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restaurantId, rating, comment }),
      });
      if (res.ok) {
        router.push(`/restaurant/${restaurantId}`);
        return;
      }
      // The backend's words, verbatim — never a friendlier invented version.
      const data = await res.json().catch(() => null);
      setError(data?.error ?? `Request failed with status ${res.status}.`);
    } catch {
      setError("Network error — could not reach the backend.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen">
      <form onSubmit={submit} className="mx-auto max-w-[560px] px-6 py-16">
        <p className="text-xs font-medium uppercase tracking-widest text-muted">
          Write a review
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          {name ?? "Loading…"}
        </h1>

        <div
          role="radiogroup"
          aria-label="Rating"
          className="mt-10 flex gap-1"
          onMouseLeave={() => setHover(0)}
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={rating === star}
              aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              className={`text-3xl leading-none transition-colors ${
                (hover || rating) >= star
                  ? "text-accent"
                  : "text-border hover:text-muted"
              }`}
            >
              ★
            </button>
          ))}
        </div>

        <label htmlFor="comment" className="mt-10 block text-sm font-medium">
          Your comment
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          rows={4}
          placeholder="What should other people know?"
          className="mt-2 w-full rounded-lg border border-border bg-white p-3 text-sm outline-none focus:border-accent"
        />

        <button
          type="submit"
          disabled={!canSubmit}
          className="mt-8 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? "Sending…" : "Submit"}
        </button>

        {error && (
          <p
            role="alert"
            className="mt-6 rounded-lg border border-border bg-accent-soft p-3 text-sm"
          >
            {error}
          </p>
        )}
      </form>
    </main>
  );
}
