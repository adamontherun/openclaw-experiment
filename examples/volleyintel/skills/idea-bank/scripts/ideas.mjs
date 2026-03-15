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

function ensureDb(dbPath) {
  mkdirSync(dirname(dbPath), { recursive: true });
  sqlite(
    dbPath,
    "CREATE TABLE IF NOT EXISTS ideas (id INTEGER PRIMARY KEY AUTOINCREMENT, idea_name TEXT NOT NULL UNIQUE, has_been_used INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, used_at TEXT);"
  );
}

function readRows(dbPath, sql) {
  const out = sqlite(dbPath, sql);
  if (!out) {
    return [];
  }
  return out
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [id, ideaName, hasBeenUsed, usedAt] = line.split("|");
      return {
        id: Number(id),
        ideaName,
        hasBeenUsed: hasBeenUsed === "1",
        usedAt: usedAt || null
      };
    });
}

function print(payload) {
  process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
}

const dbPath = resolve(pick("db") || "memory/ideas.db");
ensureDb(dbPath);

if (mode === "add") {
  const name = pick("name");
  if (!name) {
    print({ ok: false, mode, error: "Missing --name" });
    process.exit(1);
  }
  sqlite(
    dbPath,
    `INSERT INTO ideas (idea_name, has_been_used, used_at) VALUES (${q(name)}, 0, NULL) ON CONFLICT(idea_name) DO UPDATE SET has_been_used = 0, used_at = NULL;`
  );
  const row = readRows(
    dbPath,
    `SELECT id || '|' || idea_name || '|' || has_been_used || '|' || COALESCE(used_at, '') FROM ideas WHERE idea_name = ${q(name)} LIMIT 1;`
  )[0];
  print({ ok: true, mode, dbPath, idea: row });
  process.exit(0);
}

if (mode === "next") {
  const row = readRows(
    dbPath,
    "SELECT id || '|' || idea_name || '|' || has_been_used || '|' || COALESCE(used_at, '') FROM ideas WHERE has_been_used = 0 ORDER BY id ASC LIMIT 1;"
  )[0];
  print({ ok: true, mode, dbPath, found: Boolean(row), idea: row || null });
  process.exit(0);
}

if (mode === "mark-used") {
  const name = pick("name");
  if (!name) {
    print({ ok: false, mode, error: "Missing --name" });
    process.exit(1);
  }
  sqlite(
    dbPath,
    `UPDATE ideas SET has_been_used = 1, used_at = CURRENT_TIMESTAMP WHERE idea_name = ${q(name)};`
  );
  const row = readRows(
    dbPath,
    `SELECT id || '|' || idea_name || '|' || has_been_used || '|' || COALESCE(used_at, '') FROM ideas WHERE idea_name = ${q(name)} LIMIT 1;`
  )[0];
  const ok = Boolean(row && row.hasBeenUsed);
  print({ ok, mode, dbPath, idea: row || null });
  process.exit(ok ? 0 : 1);
}

if (mode === "list") {
  const onlyUnused = pick("unused") === "true";
  const where = onlyUnused ? "WHERE has_been_used = 0" : "";
  const rows = readRows(
    dbPath,
    `SELECT id || '|' || idea_name || '|' || has_been_used || '|' || COALESCE(used_at, '') FROM ideas ${where} ORDER BY id ASC;`
  );
  print({ ok: true, mode, dbPath, count: rows.length, ideas: rows });
  process.exit(0);
}

print({
  ok: false,
  error: "Usage: node ideas.mjs <add|next|mark-used|list> [--name <idea>] [--db memory/ideas.db] [--unused true]"
});
process.exit(1);
