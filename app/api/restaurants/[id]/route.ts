/**
 * GET /api/restaurants/[id] — everything the restaurant screen needs, pre-computed.
 *
 * The response is shaped like the screen: name, big average, latest review, then
 * the rest. The frontend prints; it never adds, divides or sorts.
 */
import { NextResponse } from "next/server";
import { sql } from "@/db/client";
import { moodFromRating } from "@/lib/mood";
import { timeAgo } from "@/lib/time";

type ReviewRow = { id: number; rating: number; comment: string; created_at: string };

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const restaurantId = Number(id);
  if (!Number.isInteger(restaurantId) || restaurantId < 1) {
    return NextResponse.json({ error: "Restaurant not found." }, { status: 404 });
  }

  const [restaurant] =
    await sql`SELECT name, cuisine, area FROM restaurants WHERE id = ${restaurantId}`;
  if (!restaurant) {
    return NextResponse.json({ error: "Restaurant not found." }, { status: 404 });
  }

  // The three answers, computed fresh from the facts — every single time.
  const [stats] = await sql`
    SELECT COUNT(*) AS total_reviews, AVG(rating) AS average_rating
    FROM reviews WHERE restaurant_id = ${restaurantId}`;

  // All reviews, newest first. Row 0 becomes "latest"; the rest are "older".
  const rows = (await sql`
    SELECT id, rating, comment, created_at
    FROM reviews WHERE restaurant_id = ${restaurantId}
    ORDER BY created_at DESC`) as ReviewRow[];

  const totalReviews = Number(stats.total_reviews);
  const averageRating =
    stats.average_rating === null
      ? null
      : Math.round(Number(stats.average_rating) * 10) / 10;

  const toReview = ({ id, rating, comment, created_at }: ReviewRow) => ({
    id,
    rating,
    comment,
    createdAt: created_at,
    // Finished words, computed here — "2 hours ago". The frontend just prints.
    timeAgo: timeAgo(created_at),
  });

  return NextResponse.json({
    name: restaurant.name,
    cuisine: restaurant.cuisine,
    area: restaurant.area,
    averageRating,
    totalReviews,
    mood: moodFromRating(averageRating), // computed fresh, never stored
    latestReview: rows.length > 0 ? toReview(rows[0]) : null,
    reviews: rows.slice(1).map(toReview),
  });
}
