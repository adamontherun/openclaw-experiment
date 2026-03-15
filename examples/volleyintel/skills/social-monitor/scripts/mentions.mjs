#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import process from "node:process";

const args = process.argv.slice(2);
const mode = args[0] || "";

function pick(name) {
  const index = args.indexOf(`--${name}`);
  if (index === -1) return null;
  return args[index + 1] ?? null;
}

function q(value) {
  return `'${String(value).replace(/'/g, "''")}'`;
}

function sqlite(dbPath, sql) {
  return execFileSync("sqlite3", [dbPath, sql], {
    encoding: "utf8"
  }).trim();
}

function sqliteJson(dbPath, sql) {
  const out = execFileSync("sqlite3", [dbPath, ".mode json", sql], {
    encoding: "utf8"
  }).trim();
  if (!out) return [];
  return JSON.parse(out);
}

function print(payload) {
  process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
}

function honoluluDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Pacific/Honolulu",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date());
}

function normalizePlatform(value) {
  const key = String(value || "").toLowerCase();
  if (!["x", "instagram", "threads", "reddit"].includes(key)) return null;
  return key;
}

function ensureDb(dbPath) {
  mkdirSync(dirname(dbPath), { recursive: true });
  sqlite(
    dbPath,
    "CREATE TABLE IF NOT EXISTS mentions (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT NOT NULL, platform TEXT NOT NULL, username TEXT NOT NULL, post_url TEXT, context TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);"
  );
}

const dbPath = resolve(pick("db") || "memory/mentions.db");
ensureDb(dbPath);

if (mode === "check") {
  const platform = normalizePlatform(pick("platform"));
  const postUrl = (pick("post-url") || "").trim();
  if (!platform) {
    print({ ok: false, mode, error: "Missing or invalid --platform (x|instagram|threads|reddit)" });
    process.exit(1);
  }
  if (!postUrl) {
    print({ ok: false, mode, error: "Missing --post-url" });
    process.exit(1);
  }
  const rows = sqliteJson(
    dbPath,
    `SELECT * FROM mentions WHERE platform = ${q(platform)} AND post_url = ${q(postUrl)} ORDER BY id DESC LIMIT 1;`
  );
  print({ ok: true, mode, dbPath, exists: rows.length > 0, item: rows[0] || null });
  process.exit(0);
}

if (mode === "create") {
  const date = (pick("date") || honoluluDate()).trim();
  const platform = normalizePlatform(pick("platform"));
  const username = (pick("username") || "").trim();
  const postUrl = (pick("post-url") || "").trim();
  const context = pick("context") || "";
  if (!platform) {
    print({ ok: false, mode, error: "Missing or invalid --platform (x|instagram|threads|reddit)" });
    process.exit(1);
  }
  if (!username) {
    print({ ok: false, mode, error: "Missing --username" });
    process.exit(1);
  }
  if (postUrl) {
    const dup = sqliteJson(
      dbPath,
      `SELECT * FROM mentions WHERE platform = ${q(platform)} AND post_url = ${q(postUrl)} ORDER BY id DESC LIMIT 1;`
    );
    if (dup.length) {
      print({ ok: true, mode, dbPath, deduped: true, item: dup[0] });
      process.exit(0);
    }
  }
  sqlite(
    dbPath,
    `INSERT INTO mentions (date, platform, username, post_url, context) VALUES (${q(date)}, ${q(platform)}, ${q(username)}, ${q(postUrl)}, ${q(context)});`
  );
  const rows = sqliteJson(dbPath, "SELECT * FROM mentions ORDER BY id DESC LIMIT 1;");
  print({ ok: true, mode, dbPath, deduped: false, item: rows[0] || null });
  process.exit(0);
}

if (mode === "list") {
  const platform = normalizePlatform(pick("platform"));
  const date = pick("date");
  const where = [];
  if (platform) where.push(`platform = ${q(platform)}`);
  if (date) where.push(`date = ${q(date)}`);
  const sql = `SELECT * FROM mentions ${where.length ? `WHERE ${where.join(" AND ")}` : ""} ORDER BY id DESC;`;
  const rows = sqliteJson(dbPath, sql);
  print({ ok: true, mode, dbPath, count: rows.length, items: rows });
  process.exit(0);
}

print({
  ok: false,
  error: "Usage: node skills/social-monitor/scripts/mentions.mjs <create|list|check> [--platform <x|instagram|threads|reddit>] [--username <username>] [--post-url <url>] [--context <text>] [--date <YYYY-MM-DD>] [--db memory/mentions.db]"
});
process.exit(1);
