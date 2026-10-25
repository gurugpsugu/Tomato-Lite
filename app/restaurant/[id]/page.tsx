"use client";

/**
 * Screen 2 — /restaurant/[id] — now also the landing page.
 *
 * Calls GET /api/restaurants/[id] and prints what it receives.
 * No adding, no dividing, no sorting — the backend already did all of that
 * and shaped the response like this page. The hero banner, digit rain and
 * cascade are costumes on the data, never new logic.
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import BurritoArt from "@/components/BurritoArt";
import DigitRain from "@/components/DigitRain";
import CascadeNumber from "@/components/CascadeNumber";

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
        <div className="mx-auto max-w-[600px] px-6 py-24">
          <p className="text-sm text-muted">Restaurant not found.</p>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen">
        <div className="mx-auto max-w-[600px] px-6 py-24">
          <p className="text-sm text-muted">Loading…</p>
        </div>
      </main>
    );
  }

  const empty = data.totalReviews === 0;

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-[600px] px-6 py-10">
        {/* Hero — the burrito banner with the name laid over it */}
        <section className="relative min-h-56 overflow-hidden rounded-3xl bg-[#14100c] px-7 pb-14 pt-16 text-white sm:min-h-64">
          {/* warm ember glow radiating from behind the burrito */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 82% 62%, rgba(194, 65, 12, 0.4), transparent 62%)",
            }}
            aria-hidden="true"
          />
          <BurritoArt className="pointer-events-none absolute -bottom-3 -right-5 w-60 -rotate-3 opacity-95 sm:w-96" />
          <span className="sparkle absolute left-9 top-8 text-sm" style={{ animationDelay: "0.2s" }}>✦</span>
          <span className="sparkle absolute left-32 top-4 text-xs" style={{ animationDelay: "1.1s" }}>✶</span>
          <span className="sparkle absolute right-12 top-10 text-sm" style={{ animationDelay: "0.7s" }}>✦</span>
          <span className="sparkle absolute left-52 top-16 text-xs" style={{ animationDelay: "1.6s" }}>✶</span>
          <span className="sparkle absolute right-40 bottom-12 text-xs" style={{ animationDelay: "0.4s" }}>✦</span>
          <div className="relative max-w-[320px] sm:max-w-[380px]">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              {data.name}
            </h1>
            <p className="mt-3 text-sm text-white/60 sm:text-base">
              {data.cuisine} · {data.area}
            </p>
          </div>
        </section>

        {empty ? (
          /* the empty state: an invitation, not a sad blank */
          <div className="mt-10 rounded-xl border border-dashed border-border p-8">
            <p className="text-center text-sm font-medium">
              Nobody has reviewed {data.name} yet.
            </p>
            <p className="mt-1 text-center text-sm text-muted">
              Be the first — your words set the tone.
            </p>
          </div>
        ) : (
          <>
            {/* The rating, with digits raining down behind it */}
            <section className="relative mt-4 overflow-hidden rounded-3xl bg-[#120f0b]">
              <DigitRain color={data.mood.color} />
              <div className="relative flex items-center justify-center gap-5 px-6 py-16">
                <CascadeNumber
                  value={data.averageRating}
                  color={data.mood.color}
                  className="font-mono text-8xl font-bold leading-none tracking-tight sm:text-9xl"
                  textShadow={`0 0 30px ${data.mood.color}88, 0 0 90px ${data.mood.color}44`}
                />
                <div className="flex flex-col items-start gap-2">
                  <span
                    className="rounded-full px-3.5 py-1 text-sm font-bold"
                    style={{
                      backgroundColor: data.mood.soft,
                      color: data.mood.color,
                      boxShadow: `0 0 24px -4px ${data.mood.color}66`,
                    }}
                  >
                    {data.mood.label}
                  </span>
                  <p className="text-sm text-white/60">
                    {data.totalReviews} review
                    {data.totalReviews === 1 ? "" : "s"}
                  </p>
                </div>
              </div>
            </section>

            {/* the latest review, sitting clearly apart from the rest */}
            {data.latestReview && (
              <article className="mt-10 rounded-xl border border-border bg-accent-soft p-6">
                <p className="text-xs font-bold uppercase tracking-widest text-accent">
                  Latest review
                </p>
                <p className="mt-3 text-xs font-semibold text-muted">
                  {data.latestReview.rating} / 5
                </p>
                <p className="mt-1 text-[15px]">{data.latestReview.comment}</p>
              </article>
            )}

            {/* everyone older, newest first (already sorted by the backend) */}
            {data.reviews.length > 0 && (
              <ul className="mt-8 divide-y divide-border">
                {data.reviews.map((review) => (
                  <li key={review.id} className="py-4">
                    <p className="text-xs font-semibold">
                      <span className="text-accent">★</span>{" "}
                      <span className="text-muted">{review.rating} / 5</span>
                    </p>
                    <p className="mt-1 text-sm">{review.comment}</p>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        {/* the way in */}
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
