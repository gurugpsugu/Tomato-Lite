/**
 * db:seed-samples — RESET + RESEED the sample review set.
 *
 * There used to be a set of day-level samples (and whatever the review form
 * collected in testing, e.g. "Hey BRO"). This script wipes everything after the
 * three original seeded facts and inserts 31 fresh samples with REAL variety:
 *   - timestamps from 3 minutes ago to 45 days ago, so the "time ago" display
 *     shows minutes, hours, days and "just now"-style phrases;
 *   - ratings 1–5 all present, landing the average at ~4.2 ("Really good").
 * The rows are clearly demo data, not user facts — idempotent (delete, then
 * insert) so it is safe to run again at any time:
 *   DELETE FROM reviews WHERE id > 3 AND restaurant_id = 1;
 *   INSERT ... (NOW() - minutesAgo * INTERVAL '1 minute')
 */
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

// [rating, comment, minutesAgo]
const SAMPLES = [
  [5, "Still warm when it arrived. Ridiculous.", 3],
  [4, "Great crunch on the outside", 30],
  [5, "The mint chutney inside is elite", 52],
  [4, "Solid lunch spot, parking is a pain", 120],
  [5, "Came back an hour later. No regrets.", 300],
  [4, "Quick service even when packed", 540],
  [3, "Good food, service was asleep that evening", 840],
  [5, "Huge portions, honest price", 1020],
  [2, "Burrito fell apart halfway; chaos by bite three", 1260],
  [5, "Wrapped tightly, zero spill, full marks", 2880],
  [4, "One star off for the mile-long queue", 4320],
  [5, "Best burrito in Ludhiana — fighting words, but true", 5760],
  [4, "Better than the fancy mall burritos, honestly", 7200],
  [3, "Fine in a pinch, not a destination", 8640],
  [5, "Green chutney deserves its own fan page", 10080],
  [4, "Tried the chicken version; paneer still wins", 11520],
  [5, "Fresh, hot, fast. What else do you want", 12960],
  [1, "Waited 40 minutes for a cold wrap", 14400],
  [5, "Consistent every single visit", 17280],
  [4, "Burrito excellent, ambience mediocre", 20160],
  [3, "Expected fireworks, got a friendly sparkler", 23040],
  [5, "My office orders this every Friday now", 25920],
  [4, "Good value — wish they did a wholewheat wrap", 28800],
  [5, "Staff remembered my order on the third visit", 34600],
  [2, "Overpriced after the latest menu hike", 37440],
  [5, "The paneer filling deserves a plaque on the wall", 40320],
  [4, "Flavour is a 5, seating is a 3, so a 4", 48960],
  [5, "Perfect for a post-gym lunch", 57600],
  [4, "Loved it — chutney could be a little milder", 66000],
  [5, "A weekly pilgrimage now", 77760],
  [5, "Best burrito in Sector 32, no contest", 64800],
];

// Reset: wipe samples (everything after the three original facts), then insert.
await sql.query("DELETE FROM reviews WHERE id > 3 AND restaurant_id = 1");
for (const [rating, comment, minutesAgo] of SAMPLES) {
  await sql.query(
    "INSERT INTO reviews (restaurant_id, rating, comment, created_at) VALUES (1, $1, $2, NOW() - ($3::int * INTERVAL '1 minute'))",
    [rating, comment, minutesAgo]
  );
}
console.log(`Reseeded ${SAMPLES.length} sample reviews with fresh timestamps.`);

const after = await sql.query(
  "SELECT ROUND(AVG(rating)::numeric, 1) AS avg, COUNT(*) AS total FROM reviews WHERE restaurant_id = 1"
);
console.log(
  `Restaurant now: average ${after[0].avg} from ${after[0].total} reviews`
);
