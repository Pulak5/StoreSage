import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import path from "path";
import fs from "fs";

const dataDir = path.resolve(process.cwd(), "data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const dbPath = path.resolve(dataDir, "store.db");
const nativeDb = new Database(dbPath);

export const db = drizzle(nativeDb);

export function getRawSqlite() {
  return nativeDb;
}
