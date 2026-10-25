"use client";

/**
 * Screen 2 — /restaurant/[id]
 *
 * Calls GET /api/restaurants/[id] and prints what it receives.
 * No adding, no dividing, no sorting — the backend already did all of that
 * and shaped the response like this page.
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

type Review = { id: number; rating: number; comment: string };
type RestaurantData = {
  name: string;
  cuisine: string;
  area: string;
  averageRating: number | null;
  totalReviews: number;
  mood: { label: string; color: string; soft: string };
  latestReview: Review | null;
  reviews: Review[];
};

export default function RestaurantPage() {
  const params = useParams<{ id: string }>();
  const [data, setData] = useState<RestaurantData | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let ignore = false; // a slow earlier reply must not win over the newest request
    fetch(`/api/restaurants/${params.id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((payload) => {
        if (ignore) return;
        if (payload) setData(payload);
        else setNotFound(true);
      });
    return () => {
      ignore = true;
    };
  }, [params.id]);

  if (notFound) {
    return (
      <main className="min-h-screen">
        <div className="mx-auto max-w-[560px] px-6 py-24">
          <p className="text-sm text-muted">Restaurant not found.</p>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen">
        <div className="mx-auto max-w-[560px] px-6 py-24">
          <p className="text-sm text-muted">Loading…</p>
        </div>
      </main>
    );
  }

  const empty = data.totalReviews === 0;

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-[560px] px-6 py-16">
        {/* 1 — the restaurant */}
        <h1 className="text-2xl font-semibold tracking-tight">{data.name}</h1>
        <p className="mt-1 text-sm text-muted">
          {data.cuisine} · {data.area}
        </p>

        {empty ? (
          /* 6 — the empty state: an invitation, not a sad blank */
          <div className="mt-12 rounded-xl border border-dashed border-border p-8">
            <p className="text-sm font-medium text-center">
              Nobody has reviewed {data.name} yet.
            </p>
            <p className="mt-1 text-sm text-muted text-center">
              Be the first — your words set the tone.
            </p>
          </div>
        ) : (
          <>
            {/* 2 — the big number, first thing the eye lands on, colored by mood */}
            <div className="mt-12 flex items-end gap-3">
              <p
                className="text-7xl leading-none tracking-tight"
                style={{ color: data.mood.color }}
              >
                {data.averageRating}
              </p>
              <div className="flex flex-col items-start gap-1 pb-1">
                <span
                  className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                  style={{ backgroundColor: data.mood.soft, color: data.mood.color }}
                >
                  {data.mood.label}
                </span>
                <p className="text-sm text-muted">
                  {data.totalReviews} review{data.totalReviews === 1 ? "" : "s"}
                </p>
              </div>
            </div>

            {/* 3 — the latest review, sitting clearly apart from the rest */}
            {data.latestReview && (
              <article className="mt-10 rounded-xl border border-border bg-accent-soft p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                  Latest review
                </p>
                <p className="mt-3 text-xs text-muted">
                  {data.latestReview.rating} / 5
                </p>
                <p className="mt-1">{data.latestReview.comment}</p>
              </article>
            )}

            {/* 4 — everyone older, newest first (already sorted by the backend) */}
            {data.reviews.length > 0 && (
              <ul className="mt-8 divide-y divide-border">
                {data.reviews.map((review) => (
                  <li key={review.id} className="py-4">
                    <p className="text-xs text-muted">{review.rating} / 5</p>
                    <p className="mt-1 text-sm">{review.comment}</p>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        {/* 5 — the way in */}
        <Link
          href={`/review/${params.id}`}
          className="mt-12 inline-block rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white"
        >
          Write a review
        </Link>
      </div>
    </main>
  );
}
