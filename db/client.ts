/**
 * The one place the app connects to the database.
 * Reads DATABASE_URL from .env.local (server-side only) — never from the browser.
 */
import { neon } from "@neondatabase/serverless";

export const sql = neon(process.env.DATABASE_URL ?? "");
