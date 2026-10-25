/**
 * POST /api/reviews — save one review.
 *
 * Validates in this exact order, returning 400 with { "error": "<plain English>" }
 * on the first failure:
 *   1. rating is an integer from 1 to 5
 *   2. comment is a non-empty string after trimming whitespace
 *   3. restaurantId refers to a restaurant that actually exists (database lookup)
 *
 * On success inserts exactly one row (a FACT — no average is touched anywhere)
 * and returns 201 { "success": true, "reviewId": 104 }.
 */
import { NextResponse } from "next/server";
import { sql } from "@/db/client";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 }
    );
  }
  const { rating, comment, restaurantId } = (body ?? {}) as {
    rating?: unknown;
    comment?: unknown;
    restaurantId?: unknown;
  };

  // 1 — rating: a whole number between 1 and 5. The star picker is not trusted here;
  // anyone with a terminal can bypass the UI entirely.
  if (
    typeof rating !== "number" ||
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5
  ) {
    return NextResponse.json(
      { error: "Rating must be a whole number between 1 and 5." },
      { status: 400 }
    );
  }

  // 2 — comment: non-empty after trimming whitespace.
  if (typeof comment !== "string" || comment.trim().length === 0) {
    return NextResponse.json(
      { error: "Comment cannot be empty." },
      { status: 400 }
    );
  }

  // 3 — the restaurant must actually exist (the database is the source of truth).
  if (typeof restaurantId !== "number" || !Number.isInteger(restaurantId)) {
    return NextResponse.json(
      { error: "That restaurant does not exist." },
      { status: 400 }
    );
  }
  const found = await sql`SELECT id FROM restaurants WHERE id = ${restaurantId}`;
  if (found.length === 0) {
    return NextResponse.json(
      { error: "That restaurant does not exist." },
      { status: 400 }
    );
  }

  // All checks passed — write exactly one fact. Nothing else changes.
  const [inserted] =
    await sql`INSERT INTO reviews (restaurant_id, rating, comment) VALUES (${restaurantId}, ${rating}, ${comment}) RETURNING id`;

  return NextResponse.json(
    { success: true, reviewId: inserted.id },
    { status: 201 }
  );
}
