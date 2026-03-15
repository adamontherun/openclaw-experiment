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

function ensureDb(dbPath) {
  mkdirSync(dirname(dbPath), { recursive: true });
  sqlite(
    dbPath,
    "CREATE TABLE IF NOT EXISTS drafts (id INTEGER PRIMARY KEY AUTOINCREMENT, thread_id TEXT NOT NULL, reply_to_message_id TEXT, from_email TEXT, subject TEXT, draft_reply TEXT, status TEXT NOT NULL DEFAULT 'pending', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, sent_at TEXT);"
  );
}

function toDraft(row) {
  return {
    id: row.id,
    threadId: row.thread_id || "",
    replyToMessageId: row.reply_to_message_id || "",
    fromEmail: row.from_email || "",
    subject: row.subject || "",
    draftReply: row.draft_reply || "",
    status: row.status || "pending",
    createdAt: row.created_at || "",
    sentAt: row.sent_at || null
  };
}

function readOne(dbPath, sql) {
  const rows = sqliteJson(dbPath, sql);
  if (!rows.length) return null;
  return toDraft(rows[0]);
}

function readMany(dbPath, sql) {
  return sqliteJson(dbPath, sql).map(toDraft);
}

function print(payload) {
  process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
}

const dbPath = resolve(pick("db") || "memory/gmail.db");
ensureDb(dbPath);

if (mode === "create") {
  const threadId = pick("thread-id");
  const replyToMessageId = pick("reply-to-message-id") || "";
  const fromEmail = pick("from") || "";
  const subject = pick("subject") || "";
  const draftReply = pick("draft-reply") || "";
  if (!threadId) {
    print({ ok: false, mode, error: "Missing --thread-id" });
    process.exit(1);
  }
  if (!draftReply) {
    print({ ok: false, mode, error: "Missing --draft-reply" });
    process.exit(1);
  }
  sqlite(
    dbPath,
    `INSERT INTO drafts (thread_id, reply_to_message_id, from_email, subject, draft_reply) VALUES (${q(threadId)}, ${q(replyToMessageId)}, ${q(fromEmail)}, ${q(subject)}, ${q(draftReply)});`
  );
  const draft = readOne(dbPath, "SELECT * FROM drafts ORDER BY id DESC LIMIT 1;");
  print({ ok: true, mode, dbPath, draft });
  process.exit(0);
}

if (mode === "update") {
  const id = Number(pick("id"));
  if (!Number.isInteger(id) || id <= 0) {
    print({ ok: false, mode, error: "Missing or invalid --id" });
    process.exit(1);
  }
  const draftReply = pick("draft-reply");
  if (draftReply === null) {
    print({ ok: false, mode, error: "Missing --draft-reply" });
    process.exit(1);
  }
  sqlite(dbPath, `UPDATE drafts SET draft_reply = ${q(draftReply)} WHERE id = ${id};`);
  const draft = readOne(dbPath, `SELECT * FROM drafts WHERE id = ${id} LIMIT 1;`);
  if (!draft) {
    print({ ok: false, mode, error: "Draft not found", id });
    process.exit(1);
  }
  print({ ok: true, mode, dbPath, draft });
  process.exit(0);
}

if (mode === "get") {
  const id = Number(pick("id"));
  if (!Number.isInteger(id) || id <= 0) {
    print({ ok: false, mode, error: "Missing or invalid --id" });
    process.exit(1);
  }
  const draft = readOne(dbPath, `SELECT * FROM drafts WHERE id = ${id} LIMIT 1;`);
  if (!draft) {
    print({ ok: false, mode, error: "Draft not found", id });
    process.exit(1);
  }
  print({ ok: true, mode, dbPath, draft });
  process.exit(0);
}

if (mode === "list") {
  const statusFilter = pick("status");
  const where = statusFilter ? `WHERE status = ${q(statusFilter)}` : "";
  const drafts = readMany(dbPath, `SELECT * FROM drafts ${where} ORDER BY id ASC;`);
  print({ ok: true, mode, dbPath, count: drafts.length, drafts });
  process.exit(0);
}

if (mode === "drafted-threads") {
  const rows = sqliteJson(dbPath, "SELECT DISTINCT thread_id FROM drafts WHERE status IN ('pending', 'sent');");
  const threadIds = rows.map((r) => r.thread_id);
  print({ ok: true, mode, dbPath, count: threadIds.length, threadIds });
  process.exit(0);
}

if (mode === "mark-sent") {
  const id = Number(pick("id"));
  if (!Number.isInteger(id) || id <= 0) {
    print({ ok: false, mode, error: "Missing or invalid --id" });
    process.exit(1);
  }
  sqlite(dbPath, `UPDATE drafts SET status = 'sent', sent_at = CURRENT_TIMESTAMP WHERE id = ${id};`);
  const draft = readOne(dbPath, `SELECT * FROM drafts WHERE id = ${id} LIMIT 1;`);
  if (!draft || draft.status !== "sent") {
    print({ ok: false, mode, error: "Draft not found or not marked sent", id });
    process.exit(1);
  }
  print({ ok: true, mode, dbPath, draft });
  process.exit(0);
}

if (mode === "mark-skipped") {
  const id = Number(pick("id"));
  if (!Number.isInteger(id) || id <= 0) {
    print({ ok: false, mode, error: "Missing or invalid --id" });
    process.exit(1);
  }
  sqlite(dbPath, `UPDATE drafts SET status = 'skipped' WHERE id = ${id};`);
  const draft = readOne(dbPath, `SELECT * FROM drafts WHERE id = ${id} LIMIT 1;`);
  if (!draft || draft.status !== "skipped") {
    print({ ok: false, mode, error: "Draft not found or not marked skipped", id });
    process.exit(1);
  }
  print({ ok: true, mode, dbPath, draft });
  process.exit(0);
}

print({
  ok: false,
  error: "Usage: node gmail-drafts.mjs <create|update|get|list|drafted-threads|mark-sent|mark-skipped> [--id <id>] [--thread-id <threadId>] [--reply-to-message-id <msgId>] [--from <email>] [--subject <subject>] [--draft-reply <text>] [--status <pending|sent|skipped>] [--db memory/gmail.db]"
});
process.exit(1);
