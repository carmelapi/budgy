import pool from "./db.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runNewMigrations() {
  try {
    const migrationsDir = path.join(__dirname, "migrations");

    // Only run the NEW migrations (003, 004, 005)
    const newMigrations = [
      "003_create_incomes.sql",
      "004_create_fixed_costs.sql",
      "005_create_monthly_outcomes.sql",
    ];

    for (const file of newMigrations) {
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, "utf8");

      await pool.query(sql);
    }
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    await pool.end();
    process.exit(1);
  }
}

runNewMigrations();
