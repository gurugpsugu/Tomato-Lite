"use client";

/**
 * Screen 2 — /restaurant/[id] — now also the landing page.
 *
 * Calls GET /api/restaurants/[id] and prints what it receives.
 * No adding, no dividing, no sorting, no clock maths — the backend already
 * did all of that (including the "2 hours ago" phrases) and shaped the
 * response like this page. The hero banner, digit rain and cascade are
 * costumes on the data, never new logic.
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import DigitRain from "@/components/DigitRain";
import CascadeNumber from "@/components/CascadeNumber";

type Review = { id: number; rating: number; comment: string; timeAgo: string };
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
        {/* Hero — the burrito photo under cybertech glass, HUD corners, mono profile tag */}
        <section className="relative min-h-64 overflow-hidden rounded-2xl border border-white/10 bg-[#0f141a] px-7 pb-16 pt-20 text-white sm:min-h-72">
          <img
            src="/burrito.jpg"
            alt=""
            title="Photo by Leonardo Aquino, Pexels (free license)"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          />
          {/* scrim: near-black glass on the left where the name sits, photo shining on the right */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(10, 13, 17, 0.94) 0%, rgba(10, 13, 17, 0.78) 42%, rgba(10, 13, 17, 0.28) 76%, rgba(10, 13, 17, 0.06) 100%)",
            }}
            aria-hidden="true"
          />
          {/* HUD label */}
          <p className="absolute left-4 top-3 font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">
            // Restaurant Profile
          </p>
          {/* HUD corner brackets */}
          <span aria-hidden="true" className="pointer-events-none absolute left-0 top-0 h-4 w-4 border-l-2 border-t-2 border-accent" />
          <span aria-hidden="true" className="pointer-events-none absolute right-0 top-0 h-4 w-4 border-r-2 border-t-2 border-accent" />
          <span aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-accent" />
          <span aria-hidden="true" className="pointer-events-none absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-accent" />
          <span className="sparkle absolute left-9 top-8 text-sm" style={{ animationDelay: "0.2s" }}>✦</span>
          <span className="sparkle absolute left-32 top-4 text-xs" style={{ animationDelay: "1.1s" }}>✶</span>
          <span className="sparkle absolute right-12 top-10 text-sm" style={{ animationDelay: "0.7s" }}>✦</span>
          <span className="sparkle absolute left-52 top-16 text-xs" style={{ animationDelay: "1.6s" }}>✶</span>
          <span className="sparkle absolute right-40 bottom-12 text-xs" style={{ animationDelay: "0.4s" }}>✦</span>
          <div className="relative max-w-[320px] sm:max-w-[380px]">
            <h1
              className="text-4xl font-bold tracking-tight sm:text-5xl"
              style={{ textShadow: "0 2px 14px rgba(0,0,0,0.55)" }}
            >
              {data.name}
            </h1>
            {/* cuisine and area as mono HUD chips */}
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-sm border border-white/15 bg-white/5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">
                {data.cuisine}
              </span>
              <span className="rounded-sm border border-white/15 bg-white/5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">
                {data.area}
              </span>
            </div>
          </div>
        </section>

        {empty ? (
          /* the empty state: an invitation, not a sad blank */
          <div className="mt-10 rounded-2xl border border-dashed border-white/15 p-8">
            <p className="text-center font-mono text-[11px] uppercase tracking-[0.25em] text-muted">
              No signals received
            </p>
            <p className="mt-2 text-center text-sm text-foreground/80">
              Nobody has reviewed {data.name} yet. Be the first — your words set the tone.
            </p>
          </div>
        ) : (
          <>
            {/* The rating, with digits raining down behind it */}
            <section className="relative mt-4 overflow-hidden rounded-2xl border border-white/10 bg-[#0b0f14]">
              <DigitRain color={data.mood.color} />
              <p className="absolute left-4 top-3 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
                // Rating.Feed
              </p>
              <span aria-hidden="true" className="pointer-events-none absolute right-0 top-0 h-4 w-4 border-r-2 border-t-2 border-accent" />
              <span aria-hidden="true" className="pointer-events-none absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-accent" />
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
                  <p className="font-mono text-xs tracking-wide text-white/60">
                    {data.totalReviews} review
                    {data.totalReviews === 1 ? "" : "s"}
                  </p>
                </div>
              </div>
            </section>

            {/* the latest review, sitting clearly apart from the rest */}
            {data.latestReview && (
              <article className="mt-10 rounded-2xl border border-white/10 border-l-2 border-l-accent bg-[#0f141a] p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
                  // Latest Signal
                </p>
                <p className="mt-3 font-mono text-xs text-muted">
                  <span className="text-accent">★ {data.latestReview.rating}</span> / 5 ·{" "}
                  {data.latestReview.timeAgo}
                </p>
                <p className="mt-2 text-[15px] text-white/90">{data.latestReview.comment}</p>
              </article>
            )}

            {/* everyone older, newest first (already sorted by the backend) */}
            {data.reviews.length > 0 && (
              <ul className="mt-8 divide-y divide-[#1c2530]">
                {data.reviews.map((review) => (
                  <li key={review.id} className="py-4">
                    <p className="font-mono text-[11px] text-white/45">
                      <span className="text-accent">★ {review.rating}</span> / 5 · {review.timeAgo}
                    </p>
                    <p className="mt-1 text-sm text-white/85">{review.comment}</p>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        {/* the way in */}
        <Link
          href={`/review/${params.id}`}
          className="mt-12 inline-block rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_22px_rgba(255,69,48,0.35)]"
        >
          Write a review
        </Link>
      </div>
    </main>
  );
}
