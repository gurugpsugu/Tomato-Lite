/**
 * db:seed-samples — insert 32 clearly-SAMPLE reviews so the mood colours can be
 * seen on a populated page. Demo data, not user facts — safe to delete later with:
 *   DELETE FROM reviews WHERE id > 3 AND restaurant_id = 1;
 * (ids 1–3 are the original seeded facts and stay untouched)
 * Idempotent: skips if more than 3 reviews already exist for the restaurant.
 */
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

// [rating, comment, daysAgo]
const SAMPLES = [
  [5, "Best burrito in Sector 32, no contest", 45],
  [5, "The mint chutney inside is elite", 41],
  [5, "Came for lunch, came back for dinner — same day", 38],
  [5, "Staff remembered my order on the third visit", 33],
  [5, "Huge portions, honest price", 30],
  [5, "The paneer filling deserves a plaque on the wall", 27],
  [5, "Wrapped tightly, zero spill, full marks", 24],
  [5, "Best burrito in Ludhiana — fighting words, but true", 21],
  [5, "Green chutney deserves its own fan page", 18],
  [5, "Fresh, hot, fast. What else do you want", 15],
  [5, "Consistent every single visit", 12],
  [5, "Perfect for a post-gym lunch", 9],
  [5, "My office orders this every Friday now", 6],
  [4, "Great food, just a bit crowded at 1 pm", 43],
  [4, "Burrito excellent, ambience mediocre", 34],
  [4, "Good value — wish they did a wholewheat wrap", 28],
  [4, "Solid lunch spot, parking is a pain", 25],
  [4, "Flavour is a 5, seating is a 3, so a 4", 22],
  [4, "Tried the chicken version; paneer still wins", 19],
  [4, "Quick service even when packed", 16],
  [4, "Better than the fancy mall burritos, honestly", 13],
  [4, "One star off for the mile-long queue", 8],
  [4, "Loved it — chutney could be a little milder", 5],
  [3, "Decent meal, nothing to write home about", 36],
  [3, "Fine in a pinch, not a destination", 26],
  [3, "Good food, service was asleep that evening", 17],
  [3, "Expected fireworks, got a friendly sparkler", 11],
  [3, "Okay burrito; extra charge for extra everything", 7],
  [2, "Overpriced after the latest menu hike", 29],
  [2, "Burrito fell apart halfway; chaos by bite three", 10],
  [1, "Waited 40 minutes for a cold wrap", 20],
  [1, "Mixed up my order twice in one visit", 4],
];

const existing = await sql.query(
  "SELECT COUNT(*) AS c FROM reviews WHERE restaurant_id = 1"
);
if (Number(existing[0].c) > 3) {
  console.log(
    `Already ${existing[0].c} reviews — sample data looks seeded. Skipping.`
  );
} else {
  for (const [rating, comment, daysAgo] of SAMPLES) {
    await sql.query(
      "INSERT INTO reviews (restaurant_id, rating, comment, created_at) VALUES (1, $1, $2, NOW() - ($3::int * INTERVAL '1 day'))",
      [rating, comment, daysAgo]
    );
  }
  console.log(`Seeded ${SAMPLES.length} sample reviews.`);
}

const after = await sql.query(
  "SELECT ROUND(AVG(rating)::numeric, 1) AS avg, COUNT(*) AS total FROM reviews WHERE restaurant_id = 1"
);
console.log(
  `Restaurant now: average ${after[0].avg} from ${after[0].total} reviews`
);
