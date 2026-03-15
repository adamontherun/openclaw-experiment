#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import process from "node:process";

const args = process.argv.slice(2);
const mode = args[0] || "";

function pick(name) {
  const index = args.indexOf(`--${name}`);
  if (index === -1) {
    return null;
  }
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

function ensureDb(dbPath) {
  mkdirSync(dirname(dbPath), { recursive: true });
  sqlite(
    dbPath,
    "CREATE TABLE IF NOT EXISTS runs (id INTEGER PRIMARY KEY AUTOINCREMENT, topic TEXT NOT NULL, seed_source TEXT NOT NULL, image_file TEXT, copy_x TEXT, copy_instagram TEXT, copy_threads TEXT, published INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, published_at TEXT);"
  );
}

function toRun(row) {
  return {
    id: row.id,
    topic: row.topic || "",
    seedSource: row.seed_source || "",
    imageFile: row.image_file || "",
    copyX: row.copy_x || "",
    copyInstagram: row.copy_instagram || "",
    copyThreads: row.copy_threads || "",
    published: row.published === 1,
    createdAt: row.created_at || "",
    publishedAt: row.published_at || null
  };
}

function readRun(dbPath, sql) {
  const rows = sqliteJson(dbPath, sql);
  if (!rows.length) return null;
  return toRun(rows[0]);
}

function print(payload) {
  process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
}

const dbPath = resolve(pick("db") || "memory/content.db");
ensureDb(dbPath);

if (mode === "create") {
  const topic = pick("topic");
  const seedSource = pick("seed-source");
  if (!topic) {
    print({ ok: false, mode, error: "Missing --topic" });
    process.exit(1);
  }
  if (!seedSource || !["idea-bank", "trending"].includes(seedSource)) {
    print({ ok: false, mode, error: "Missing or invalid --seed-source (use idea-bank or trending)" });
    process.exit(1);
  }
  sqlite(
    dbPath,
    `INSERT INTO runs (topic, seed_source) VALUES (${q(topic)}, ${q(seedSource)});`
  );
  const run = readRun(dbPath, "SELECT * FROM runs ORDER BY id DESC LIMIT 1;");
  print({ ok: true, mode, dbPath, run });
  process.exit(0);
}

if (mode === "update") {
  const id = Number(pick("id"));
  if (!Number.isInteger(id) || id <= 0) {
    print({ ok: false, mode, error: "Missing or invalid --id" });
    process.exit(1);
  }
  const imageFile = pick("image-file");
  const copyX = pick("copy-x");
  const copyInstagram = pick("copy-instagram");
  const copyThreads = pick("copy-threads");
  if (!imageFile && copyX === null && copyInstagram === null && copyThreads === null) {
    print({ ok: false, mode, error: "No updates provided. Use --image-file and/or --copy-x --copy-instagram --copy-threads." });
    process.exit(1);
  }
  if (copyX !== null) {
    const xChars = Array.from(copyX).length;
    if (xChars > 280) {
      print({ ok: false, mode, error: "X copy exceeds max length.", xChars, maxX: 280 });
      process.exit(1);
    }
  }
  if (copyThreads !== null) {
    const threadsChars = Array.from(copyThreads).length;
    if (threadsChars > 500) {
      print({ ok: false, mode, error: "Threads copy exceeds max length.", threadsChars, maxThreads: 500 });
      process.exit(1);
    }
  }
  const sets = [];
  if (imageFile) sets.push(`image_file = ${q(imageFile)}`);
  if (copyX !== null) sets.push(`copy_x = ${q(copyX)}`);
  if (copyInstagram !== null) sets.push(`copy_instagram = ${q(copyInstagram)}`);
  if (copyThreads !== null) sets.push(`copy_threads = ${q(copyThreads)}`);
  sqlite(dbPath, `UPDATE runs SET ${sets.join(", ")} WHERE id = ${id};`);
  const run = readRun(dbPath, `SELECT * FROM runs WHERE id = ${id} LIMIT 1;`);
  if (!run) {
    print({ ok: false, mode, error: "Run not found", id });
    process.exit(1);
  }
  print({ ok: true, mode, dbPath, run });
  process.exit(0);
}

if (mode === "get") {
  const id = Number(pick("id"));
  if (!Number.isInteger(id) || id <= 0) {
    print({ ok: false, mode, error: "Missing or invalid --id" });
    process.exit(1);
  }
  const run = readRun(dbPath, `SELECT * FROM runs WHERE id = ${id} LIMIT 1;`);
  if (!run) {
    print({ ok: false, mode, error: "Run not found", id });
    process.exit(1);
  }
  print({ ok: true, mode, dbPath, run });
  process.exit(0);
}

if (mode === "latest") {
  const run = readRun(dbPath, "SELECT * FROM runs WHERE published = 0 ORDER BY id DESC LIMIT 1;");
  print({ ok: true, mode, dbPath, found: Boolean(run), run: run || null });
  process.exit(0);
}

if (mode === "mark-published") {
  const id = Number(pick("id"));
  if (!Number.isInteger(id) || id <= 0) {
    print({ ok: false, mode, error: "Missing or invalid --id" });
    process.exit(1);
  }
  sqlite(
    dbPath,
    `UPDATE runs SET published = 1, published_at = CURRENT_TIMESTAMP WHERE id = ${id};`
  );
  const run = readRun(dbPath, `SELECT * FROM runs WHERE id = ${id} LIMIT 1;`);
  if (!run || !run.published) {
    print({ ok: false, mode, error: "Run not found or not marked published", id });
    process.exit(1);
  }
  print({ ok: true, mode, dbPath, run });
  process.exit(0);
}

print({
  ok: false,
  error: "Usage: node content-run.mjs <create|update|get|latest|mark-published> [--id <id>] [--topic <topic>] [--seed-source <idea-bank|trending>] [--image-file <path>] [--copy-x <text>] [--copy-instagram <text>] [--copy-threads <text>] [--db memory/content.db]"
});
process.exit(1);
