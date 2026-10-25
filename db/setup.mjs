/**
 * db:setup — apply db/schema.sql, seed one restaurant + three reviews, print the rows.
 * Safe to run repeatedly: CREATE TABLE is skipped if the table already exists,
 * and the seed only runs when the restaurant is not already present.
 */
import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

// ---------------------------------------------------------------- schema ---
const schema = readFileSync(new URL("./schema.sql", import.meta.url), "utf8");
for (const statement of schema
  .split(";")
  .map((s) => s.trim())
  .filter(Boolean)) {
  try {
    await sql.query(statement);
  } catch (error) {
    // 42P07 = "already exists" — fine, the schema is already applied.
    if (error.code === "42P07" || /already exists/i.test(error.message)) {
      console.log(`  (skipped, already exists) ${statement.split("\n")[0].trim()}...`);
    } else {
      throw error;
    }
  }
}
console.log("Schema applied.");

// ------------------------------------------------------------------ seed ---
const RESTAURANT = { name: "Ludhiana Burrito", cuisine: "Indian", area: "Sector 32" };

const existing = await sql`SELECT id FROM restaurants WHERE name = ${RESTAURANT.name}`;
if (existing.length > 0) {
  console.log(`Restaurant already seeded (id ${existing[0].id}) — leaving reviews untouched.`);
} else {
  const [restaurant] = await sql`
    INSERT INTO restaurants (name, cuisine, area)
    VALUES (${RESTAURANT.name}, ${RESTAURANT.cuisine}, ${RESTAURANT.area})
    RETURNING id
  `;
  console.log(`Seeded restaurant id ${restaurant.id}`);

  // Facts only — three plain rating rows. No averages, no "latest" column.
  const reviews = [
    [5, "Paneer burrito is unreal", 8],
    [4, "Good, but slow service", 6],
    [4, "Solid. Would repeat.", 2],
  ];
  for (const [rating, comment, days] of reviews) {
    await sql.query(
      "INSERT INTO reviews (restaurant_id, rating, comment, created_at) VALUES ($1, $2, $3, NOW() - ($4::int * INTERVAL '1 day'))",
      [restaurant.id, rating, comment, days]
    );
  }
  console.log("Seeded 3 reviews (8, 6 and 2 days ago).");
}

// ------------------------------------------------------------------ show ---
console.log("\nrestaurants:");
console.table(await sql.query("SELECT id, name, cuisine, area FROM restaurants"));
console.log("reviews:");
console.table(
  await sql.query(
    "SELECT id, restaurant_id, rating, comment, created_at FROM reviews ORDER BY created_at"
  )
);
