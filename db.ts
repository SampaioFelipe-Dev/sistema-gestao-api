import { Pool } from "pg"; import { drizzle } from "drizzle-orm/node-postgres";
import "dotenv/config";
import { produtos } from "./schema.js";
import { eq } from "drizzle-orm";
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
export const db = drizzle(pool);