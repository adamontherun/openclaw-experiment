#!/usr/bin/env python3
import argparse
import json
import os
import re
import sqlite3
import subprocess
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone, timedelta
from pathlib import Path

import numpy as np

DEFAULT_EMBEDDING_MODEL = "text-embedding-3-small"
EXTRACTION_MODEL = "gpt-4o-mini"
DEFAULT_DB = Path.home() / ".openclaw" / "memory" / "life-ops.sqlite"
LOG_PATH = Path.home() / ".openclaw" / "logs" / "life-ops.log"
GOG_ACCOUNT = "adaminhonolulu@gmail.com"
SHARED_CAL_ID = "9d44640612dfcc7529ecdf6aad6916fa250a636bdc7520fabb826d22fe3c57bb@group.calendar.google.com"
PERSONAL_CAL_ID = "adaminhonolulu@gmail.com"
HST = timezone(timedelta(hours=-10))

VALID_TAGS = [
    "event", "deadline", "task", "requirement", "schedule_change",
    "reservation", "delivery", "purchase", "finance", "school",
    "sports", "family", "home", "travel", "work", "admin",
    "info_reference", "decision", "waiting_on", "follow_up_needed",
]

DEFAULT_NOISE_RULES = [
    ("sender", "no-reply@", "discard"),
    ("sender", "noreply@", "discard"),
    ("sender", "mailer-daemon@", "discard"),
    ("keyword", "unsubscribe", "discard"),
    ("keyword", "view in browser", "discard"),
    ("keyword", "daily digest", "discard"),
    ("keyword", "view this email in your browser", "discard"),
    ("label", "CATEGORY_PROMOTIONS", "discard"),
    ("label", "CATEGORY_SOCIAL", "discard"),
    ("label", "CATEGORY_UPDATES", "deprioritize"),
    ("label", "CATEGORY_FORUMS", "deprioritize"),
    ("label", "SPAM", "discard"),
]

EXTRACTION_SYSTEM_PROMPT = """You are a Life Ops extraction agent. Given raw messages (email, calendar event, or iMessage), extract structured facts.

Extract information that is likely to be needed later. Prioritize items containing:
- Dates/times, deadlines, schedules, changes/cancellations
- Commitments/agreements/next steps ("I'll…", "we decided…", "can you…", "please confirm…")
- Requirements ("bring/wear/do/pay/sign/register/submit")
- Locations, addresses, gate codes, pickup instructions
- Reservations, tickets, order/shipping updates, deliveries
- Forms, fees, school/admin notices, official instructions
- Health/safety logistics (appointments, reminders) as logistics only
- High-signal reference info ("use this link/code," "here's the doc")

Deprioritize or skip:
- Marketing content that slipped through filters
- Generic pleasantries with no actionable content
- Receipts with no future action (unless tickets, travel, school fees, registrations, or time-bound)

For each kept message, return zero or more facts. Return an empty array for messages with no extractable signal.

Family context:
- Adam (user), wife Heather Smith, children Alexander Bow-Smith, Gabriel Bow-Smith, stepchildren Liliana Lawson, Liam Lawson
- Location: Honolulu, HI (HST timezone)

Output JSON array of facts. Each fact:
{
  "source_index": <int, 0-based index into the input messages array>,
  "fact_type": "<primary tag>",
  "tags": ["<tag1>", "<tag2>", ...],
  "summary": "<concise plain-language fact card, 1-3 sentences>",
  "who": ["<person or org names involved>"],
  "date_start": "<ISO date/datetime or null>",
  "date_end": "<ISO date/datetime or null>",
  "location": "<location or null>",
  "action": "<what needs to happen, or null>",
  "action_owner": "<adam|heather|alexander|gabriel|liliana|liam|other|null>",
  "deadline": "<ISO date/datetime or null>",
  "confidence": "<high|med|low>",
  "supersedes_summary_fragment": "<substring of an older fact summary this replaces, or null>"
}

Valid tags: event, deadline, task, requirement, schedule_change, reservation, delivery, purchase, finance, school, sports, family, home, travel, work, admin, info_reference, decision, waiting_on, follow_up_needed

Rules:
- One message can yield multiple facts (e.g. an email about a school event with a fee and a deadline)
- If a message has no extractable signal, omit it (don't produce a fact)
- Dates should be ISO 8601 when possible; use the message's date context to resolve relative dates
- Keep summaries concise but self-contained (readable without the original message)
- Set confidence: high if explicit/clear, med if inferred, low if ambiguous"""


def utc_now_iso():
    return datetime.now(timezone.utc).isoformat()


def _log(level, source, **kwargs):
    rec = {"ts": utc_now_iso(), "level": level, "source": source, **kwargs}
    line = json.dumps(rec, ensure_ascii=True) + "\n"
    try:
        LOG_PATH.parent.mkdir(parents=True, exist_ok=True)
        with open(LOG_PATH, "a", encoding="utf-8") as f:
            f.write(line)
    except OSError:
        pass
    print(line.strip(), file=sys.stderr)


def hst_now():
    return datetime.now(HST)


def to_hst_display(date_str):
    if not date_str:
        return ""
    if isinstance(date_str, str) and re.fullmatch(r"\d{4}-\d{2}-\d{2}", date_str.strip()):
        return date_str.strip()
    dt = parse_dt(date_str) if isinstance(date_str, str) else date_str
    if dt is None:
        return date_str if isinstance(date_str, str) else ""
    return dt.astimezone(HST).strftime("%Y-%m-%d %H:%M HST")


def parse_dt(value):
    if not value:
        return None
    value = value.strip()
    fmts = [
        "%Y-%m-%d", "%Y-%m-%d %H:%M:%S", "%Y-%m-%dT%H:%M:%S",
        "%Y-%m-%dT%H:%M:%S.%f", "%Y-%m-%dT%H:%M:%S%z",
        "%Y-%m-%dT%H:%M:%S.%f%z",
    ]
    for fmt in fmts:
        try:
            dt = datetime.strptime(value, fmt)
            if dt.tzinfo is None:
                dt = dt.replace(tzinfo=timezone.utc)
            return dt
        except ValueError:
            pass
    try:
        dt = datetime.fromisoformat(value)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt
    except ValueError:
        return None


def date_to_since_iso(value):
    dt = parse_dt(value)
    if not dt:
        return None
    return dt.strftime("%Y-%m-%dT00:00:00+00:00")


def date_to_until_iso(value):
    dt = parse_dt(value)
    if not dt:
        return None
    return dt.strftime("%Y-%m-%dT23:59:59.999999+00:00")


def resolve_openai_api_key():
    env_key = os.getenv("OPENAI_API_KEY")
    if env_key:
        return env_key
    config_path = Path.home() / ".openclaw" / "openclaw.json"
    if config_path.exists():
        try:
            data = json.loads(config_path.read_text(encoding="utf-8"))
            key = (
                data.get("models", {})
                .get("providers", {})
                .get("openai", {})
                .get("apiKey")
            )
            if key:
                return key
        except Exception:
            pass
    return None


def get_conn(db_path):
    conn = sqlite3.connect(str(db_path))
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    return conn


def init_db(conn):
    conn.executescript("""
        CREATE TABLE IF NOT EXISTS checkpoints (
            source_type TEXT PRIMARY KEY,
            last_checkpoint TEXT,
            last_run_at TEXT
        );

        CREATE TABLE IF NOT EXISTS items (
            id INTEGER PRIMARY KEY,
            source_type TEXT NOT NULL,
            source_id TEXT UNIQUE NOT NULL,
            subject TEXT,
            sender TEXT,
            recipients TEXT,
            raw_text TEXT,
            received_at TEXT,
            ingested_at TEXT,
            kept BOOLEAN DEFAULT 1,
            noise_reason TEXT
        );

        CREATE TABLE IF NOT EXISTS facts (
            id INTEGER PRIMARY KEY,
            item_id INTEGER REFERENCES items(id),
            fact_type TEXT,
            tags TEXT,
            summary TEXT,
            who TEXT,
            date_start TEXT,
            date_end TEXT,
            location TEXT,
            action TEXT,
            action_owner TEXT,
            deadline TEXT,
            confidence TEXT,
            status TEXT DEFAULT 'current',
            superseded_by INTEGER REFERENCES facts(id),
            created_at TEXT,
            updated_at TEXT
        );

        CREATE TABLE IF NOT EXISTS fact_chunks (
            id INTEGER PRIMARY KEY,
            fact_id INTEGER REFERENCES facts(id),
            item_id INTEGER REFERENCES items(id),
            chunk_type TEXT,
            chunk_text TEXT,
            embedding BLOB,
            embedding_dim INTEGER
        );

        CREATE TABLE IF NOT EXISTS noise_rules (
            id INTEGER PRIMARY KEY,
            rule_type TEXT NOT NULL,
            pattern TEXT NOT NULL,
            action TEXT DEFAULT 'discard',
            enabled BOOLEAN DEFAULT 1
        );

        CREATE INDEX IF NOT EXISTS idx_items_source_type ON items(source_type);
        CREATE INDEX IF NOT EXISTS idx_items_received_at ON items(received_at);
        CREATE INDEX IF NOT EXISTS idx_items_ingested_at ON items(ingested_at);
        CREATE INDEX IF NOT EXISTS idx_facts_item_id ON facts(item_id);
        CREATE INDEX IF NOT EXISTS idx_facts_status ON facts(status);
        CREATE INDEX IF NOT EXISTS idx_facts_fact_type ON facts(fact_type);
        CREATE INDEX IF NOT EXISTS idx_facts_created_at ON facts(created_at);
        CREATE INDEX IF NOT EXISTS idx_fact_chunks_fact_id ON fact_chunks(fact_id);
        CREATE INDEX IF NOT EXISTS idx_fact_chunks_item_id ON fact_chunks(item_id);
    """)
    conn.commit()


def seed_noise_rules(conn):
    existing = conn.execute("SELECT COUNT(*) AS n FROM noise_rules").fetchone()["n"]
    if existing > 0:
        return 0
    count = 0
    for rule_type, pattern, action in DEFAULT_NOISE_RULES:
        conn.execute(
            "INSERT INTO noise_rules (rule_type, pattern, action) VALUES (?, ?, ?)",
            (rule_type, pattern, action),
        )
        count += 1
    conn.commit()
    return count


# ---------------------------------------------------------------------------
# Embedding helpers (mirrors kb.py patterns)
# ---------------------------------------------------------------------------

def chunk_text(text, max_words=180, overlap_words=30):
    words = text.split()
    if not words:
        return []
    chunks = []
    start = 0
    total = len(words)
    step = max(1, max_words - overlap_words)
    while start < total:
        end = min(total, start + max_words)
        chunk = " ".join(words[start:end]).strip()
        if chunk:
            chunks.append(chunk)
        if end == total:
            break
        start += step
    return chunks


def embed_texts_http(api_key, texts, model):
    url = "https://api.openai.com/v1/embeddings"
    payload = json.dumps({"model": model, "input": texts}).encode("utf-8")
    req = urllib.request.Request(
        url, data=payload,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=120) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    items_data = sorted(data.get("data", []), key=lambda d: d.get("index", 0))
    vectors = []
    for item in items_data:
        vec = np.array(item.get("embedding", []), dtype=np.float32)
        vectors.append(vec)
    return vectors


def embed_texts(api_key, texts, model=DEFAULT_EMBEDDING_MODEL, batch_size=64):
    vectors = []
    for i in range(0, len(texts), batch_size):
        batch = texts[i:i + batch_size]
        vectors.extend(embed_texts_http(api_key, batch, model))
    return vectors


def cosine_similarity(query_vec, matrix):
    q_norm = np.linalg.norm(query_vec)
    m_norm = np.linalg.norm(matrix, axis=1)
    denom = np.maximum(q_norm * m_norm, 1e-12)
    return np.dot(matrix, query_vec) / denom


def time_decay_factor(dt_str, now_utc, decay_per_day=0.01):
    dt = parse_dt(dt_str)
    if not dt:
        return 1.0
    delta_days = max(0.0, (now_utc - dt).total_seconds() / 86400.0)
    return 1.0 / (1.0 + delta_days * decay_per_day)


# ---------------------------------------------------------------------------
# Shell helpers
# ---------------------------------------------------------------------------

def run_cmd(args_list, timeout=120):
    try:
        result = subprocess.run(
            args_list, capture_output=True, text=True, timeout=timeout,
        )
        return result.stdout.strip(), result.stderr.strip(), result.returncode
    except subprocess.TimeoutExpired:
        return "", "timeout", -1
    except FileNotFoundError:
        return "", f"command not found: {args_list[0]}", -1


def parse_ndjson(text):
    results = []
    for line in text.strip().splitlines():
        line = line.strip()
        if not line:
            continue
        try:
            results.append(json.loads(line))
        except json.JSONDecodeError:
            continue
    return results


def unwrap_gog_response(data):
    if isinstance(data, list):
        return data
    if isinstance(data, dict):
        for key in ("messages", "items", "events", "threads"):
            if key in data and isinstance(data[key], list):
                return data[key]
    return []


def parse_json_or_ndjson(text):
    text = text.strip()
    if not text:
        return []
    try:
        data = json.loads(text)
        return unwrap_gog_response(data)
    except json.JSONDecodeError:
        pass
    if text.startswith("["):
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            pass
    parsed = parse_ndjson(text)
    if len(parsed) == 1 and isinstance(parsed[0], dict):
        unwrapped = unwrap_gog_response(parsed[0])
        if unwrapped:
            return unwrapped
    return parsed


# ---------------------------------------------------------------------------
# OpenAI chat completion for extraction
# ---------------------------------------------------------------------------

def openai_chat(api_key, system_prompt, user_prompt, model=EXTRACTION_MODEL):
    url = "https://api.openai.com/v1/chat/completions"
    payload = json.dumps({
        "model": model,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        "temperature": 0.2,
        "response_format": {"type": "json_object"},
    }).encode("utf-8")
    req = urllib.request.Request(
        url, data=payload,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=180) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    content = data["choices"][0]["message"]["content"]
    return json.loads(content)


# ---------------------------------------------------------------------------
# Noise filtering
# ---------------------------------------------------------------------------

def load_noise_rules(conn):
    rows = conn.execute(
        "SELECT rule_type, pattern, action FROM noise_rules WHERE enabled = 1"
    ).fetchall()
    return [dict(r) for r in rows]


_KEEP_OVERRIDE_KEYWORDS = [
    "invited", "invitation", "birthday", "party", "rsvp",
    "school", "class", "field trip", "picture day", "conference",
    "practice", "game", "match", "tournament",
    "appointment", "reservation", "booking", "confirmation",
    "deadline", "due date", "payment due", "tuition",
    "pickup", "drop-off", "carpool",
]


def apply_noise_filter(item, rules):
    sender = (item.get("sender") or "").lower()
    subject = (item.get("subject") or "").lower()
    raw = (item.get("raw_text") or "").lower()
    labels = [l.lower() for l in (item.get("labels") or [])]

    for rule in rules:
        rt = rule["rule_type"]
        pat = rule["pattern"].lower()
        act = rule["action"]

        if rt == "sender" and pat in sender:
            if act == "discard":
                combined = subject + " " + raw[:2000]
                if any(kw in combined for kw in _KEEP_OVERRIDE_KEYWORDS):
                    continue
            return act, f"sender matches '{rule['pattern']}'"
        if rt == "keyword" and (pat in subject or pat in raw):
            return act, f"keyword '{rule['pattern']}' found"
        if rt == "label":
            if pat in labels:
                return act, f"label '{rule['pattern']}'"

    return "keep", None


# ---------------------------------------------------------------------------
# Gmail fetching
# ---------------------------------------------------------------------------

def _search_gmail(query, timeout=60):
    stdout, stderr, rc = run_cmd([
        "gog", "gmail", "messages", "search", query,
        "--max", "100", "--json", "--account", GOG_ACCOUNT,
    ], timeout=timeout)
    if rc != 0:
        if "No auth" in stderr or "no auth" in stderr.lower():
            _log("warning", "gmail", message="Auth not configured — skipping. Run: gog auth add adaminhonolulu@gmail.com --services gmail")
        else:
            _log("error", "gmail", message=f"gog search failed: {stderr}")
        return []
    if not stdout:
        return []
    return parse_json_or_ndjson(stdout) or []


def _gmail_msgs_to_items(messages, checkpoint_dt, conn):
    items = []
    for msg in messages:
        if not isinstance(msg, dict):
            continue
        msg_id = msg.get("id") or msg.get("messageId") or msg.get("message_id", "")
        source_id = f"gmail:{msg_id}"

        existing = conn.execute(
            "SELECT id FROM items WHERE source_id = ?", (source_id,)
        ).fetchone()
        if existing:
            continue

        date_str = msg.get("date") or msg.get("internalDate") or ""
        if isinstance(date_str, (int, float)):
            date_str = datetime.fromtimestamp(date_str / 1000.0, tz=timezone.utc).isoformat()
        elif not isinstance(date_str, str):
            date_str = str(date_str) if date_str else ""
        received_dt = parse_dt(date_str)
        if checkpoint_dt and received_dt and received_dt <= checkpoint_dt:
            continue

        sender_val = msg.get("from") or msg.get("sender") or ""
        recipients_val = msg.get("to") or msg.get("recipients") or ""
        if isinstance(recipients_val, list):
            recipients_val = json.dumps(recipients_val)
        elif not isinstance(recipients_val, str):
            recipients_val = str(recipients_val)

        subject_val = msg.get("subject") or ""
        snippet = msg.get("snippet") or msg.get("body") or msg.get("text") or ""
        labels = msg.get("labelIds") or msg.get("labels") or []
        if isinstance(labels, str):
            labels = [labels]

        items.append({
            "source_type": "gmail",
            "source_id": source_id,
            "subject": subject_val,
            "sender": sender_val,
            "recipients": recipients_val if isinstance(recipients_val, str) else json.dumps(recipients_val),
            "raw_text": f"Subject: {subject_val}\nFrom: {sender_val}\nTo: {recipients_val}\nDate: {to_hst_display(date_str)}\n\n{snippet}",
            "received_at": date_str or utc_now_iso(),
            "labels": labels,
        })
    return items


def fetch_gmail(conn, hours_back=9):
    checkpoint_row = conn.execute(
        "SELECT last_checkpoint FROM checkpoints WHERE source_type = 'gmail'"
    ).fetchone()
    checkpoint_dt = parse_dt(checkpoint_row["last_checkpoint"]) if checkpoint_row else None

    inbox_msgs = _search_gmail(f"newer_than:{hours_back}h")
    sent_msgs = _search_gmail(f"in:sent newer_than:{hours_back}h")

    seen_ids = set()
    merged = []
    for msg in inbox_msgs + sent_msgs:
        mid = msg.get("id") or msg.get("messageId") or msg.get("message_id", "")
        if mid and mid not in seen_ids:
            seen_ids.add(mid)
            merged.append(msg)

    items = _gmail_msgs_to_items(merged, checkpoint_dt, conn)
    _log("info", "gmail", inbox=len(inbox_msgs), sent=len(sent_msgs), merged=len(merged), new_items=len(items))
    return items


# ---------------------------------------------------------------------------
# Calendar fetching
# ---------------------------------------------------------------------------

def fetch_calendar(conn, days_forward=30, days_back=1):
    checkpoint_row = conn.execute(
        "SELECT last_checkpoint FROM checkpoints WHERE source_type = 'calendar'"
    ).fetchone()

    now = hst_now()
    from_dt = now - timedelta(days=days_back)
    to_dt = now + timedelta(days=days_forward)
    from_iso = from_dt.isoformat()
    to_iso = to_dt.isoformat()

    all_events = []
    for cal_id in [SHARED_CAL_ID, PERSONAL_CAL_ID]:
        stdout, stderr, rc = run_cmd([
            "gog", "calendar", "events", cal_id,
            "--from", from_iso, "--to", to_iso,
            "--json", "--account", GOG_ACCOUNT,
        ], timeout=60)
        if rc != 0:
            if "No auth" in stderr or "no auth" in stderr.lower():
                _log("warning", "calendar", message="Auth not configured — skipping. Run: gog auth add adaminhonolulu@gmail.com --services calendar")
            else:
                _log("error", "calendar", message=f"gog failed: {stderr}")
            continue
        if not stdout:
            _log("warning", "calendar", calendar=cal_id[:20] + "...", reason="gog returned no output")
            continue
        events = parse_json_or_ndjson(stdout)
        if not events and stdout.strip():
            _log("warning", "calendar", calendar=cal_id[:20] + "...", reason="gog returned output but parsed 0 events (possible format change)")
        for ev in events:
            if isinstance(ev, dict):
                ev["_cal_id"] = cal_id
                all_events.append(ev)
        cal_short = "shared" if "group.calendar" in cal_id else "personal"
        _log("info", "calendar", cal_type=cal_short, events_fetched=len(events))

    items = []
    for ev in all_events:
        ev_id = ev.get("id") or ev.get("eventId") or ""
        source_id = f"cal:{ev_id}"

        existing = conn.execute(
            "SELECT id, raw_text FROM items WHERE source_id = ?", (source_id,)
        ).fetchone()

        summary = ev.get("summary") or ev.get("title") or ""
        description = ev.get("description") or ""
        location = ev.get("location") or ""
        start = ev.get("start", {})
        end = ev.get("end", {})
        start_str = start.get("dateTime") or start.get("date") or "" if isinstance(start, dict) else str(start)
        end_str = end.get("dateTime") or end.get("date") or "" if isinstance(end, dict) else str(end)
        creator = ev.get("creator", {}).get("email", "") if isinstance(ev.get("creator"), dict) else ""
        attendees = ev.get("attendees", [])
        attendee_str = ", ".join(
            a.get("email", "") for a in attendees if isinstance(a, dict)
        ) if isinstance(attendees, list) else ""

        raw_text = (
            f"Calendar Event: {summary}\n"
            f"Start: {to_hst_display(start_str)}\nEnd: {to_hst_display(end_str)}\n"
            f"Location: {location}\n"
            f"Description: {description}\n"
            f"Attendees: {attendee_str}"
        )

        if existing:
            if existing["raw_text"] == raw_text:
                continue
            # Cascade delete: fact_chunks -> facts -> items
            item_id = existing["id"]
            conn.execute("DELETE FROM fact_chunks WHERE item_id = ?", (item_id,))
            conn.execute("DELETE FROM facts WHERE item_id = ?", (item_id,))
            conn.execute("DELETE FROM items WHERE id = ?", (item_id,))
            conn.commit()

        items.append({
            "source_type": "calendar",
            "source_id": source_id,
            "subject": summary,
            "sender": creator,
            "recipients": attendee_str,
            "raw_text": raw_text,
            "received_at": start_str or utc_now_iso(),
            "labels": [],
        })

    _log("info", "calendar", total_events=len(all_events), new_or_updated_items=len(items))
    return items


# ---------------------------------------------------------------------------
# iMessage fetching
# ---------------------------------------------------------------------------

def fetch_imessages(conn, max_chats=30, messages_per_chat=50):
    checkpoint_row = conn.execute(
        "SELECT last_checkpoint FROM checkpoints WHERE source_type = 'imessage'"
    ).fetchone()
    checkpoint_dt = parse_dt(checkpoint_row["last_checkpoint"]) if checkpoint_row else None

    stdout, stderr, rc = run_cmd([
        "imsg", "chats", "--limit", str(max_chats), "--json",
    ], timeout=30)

    if rc != 0:
        _log("error", "imessage", message=f"imsg chats failed: {stderr}")
        return []

    if not stdout:
        return []

    chats = parse_json_or_ndjson(stdout)
    if not chats:
        return []

    items = []
    for chat in chats:
        if not isinstance(chat, dict):
            continue
        chat_id = chat.get("id") or chat.get("chat_id") or chat.get("chatId")
        if chat_id is None:
            continue

        display_name = chat.get("name") or chat.get("displayName") or chat.get("display_name") or ""
        identifier = chat.get("identifier") or ""
        if not display_name:
            display_name = identifier or str(chat_id)

        stdout2, stderr2, rc2 = run_cmd([
            "imsg", "history", "--chat-id", str(chat_id),
            "--limit", str(messages_per_chat), "--json",
        ], timeout=30)

        if rc2 != 0 or not stdout2:
            continue

        messages = parse_json_or_ndjson(stdout2)
        if not messages:
            continue

        thread_messages = []
        for msg in messages:
            if not isinstance(msg, dict):
                continue
            msg_id = msg.get("id") or msg.get("rowid") or msg.get("messageId") or ""
            msg_date = msg.get("created_at") or msg.get("date") or msg.get("timestamp") or ""
            msg_dt = parse_dt(msg_date)

            if checkpoint_dt and msg_dt and msg_dt <= checkpoint_dt:
                continue

            source_id = f"imsg:{chat_id}:{msg_id}"
            existing = conn.execute(
                "SELECT id FROM items WHERE source_id = ?", (source_id,)
            ).fetchone()
            if existing:
                continue

            is_from_me = msg.get("is_from_me", False)
            sender_name = "me" if is_from_me else (msg.get("sender") or identifier or display_name)
            text = msg.get("text") or msg.get("body") or msg.get("message") or ""
            if not text.strip():
                continue

            thread_messages.append({
                "source_id": source_id,
                "sender": sender_name,
                "text": text,
                "date": msg_date,
                "msg_dt": msg_dt,
            })

        if not thread_messages:
            continue

        thread_messages.sort(key=lambda m: m["msg_dt"] or datetime.min.replace(tzinfo=timezone.utc))

        combined_text = f"iMessage thread: {display_name}\n\n"
        for m in thread_messages:
            combined_text += f"[{to_hst_display(m['date'])}] {m['sender']}: {m['text']}\n"

        batch_source_ids = [m["source_id"] for m in thread_messages]
        latest_date = max(
            (m["date"] for m in thread_messages if m["date"]),
            default=utc_now_iso(),
        )

        items.append({
            "source_type": "imessage",
            "source_id": batch_source_ids[0],
            "_all_source_ids": batch_source_ids,
            "subject": f"iMessage: {display_name}",
            "sender": display_name,
            "recipients": json.dumps([display_name]),
            "raw_text": combined_text,
            "received_at": latest_date,
            "labels": [],
            "_thread_messages": thread_messages,
        })

    return items


# ---------------------------------------------------------------------------
# LLM fact extraction
# ---------------------------------------------------------------------------

def extract_facts_batch(api_key, items_batch, today_str):
    messages_for_llm = []
    for idx, item in enumerate(items_batch):
        messages_for_llm.append({
            "index": idx,
            "source_type": item["source_type"],
            "subject": item.get("subject", ""),
            "sender": item.get("sender", ""),
            "received_at": item.get("received_at", ""),
            "text": item.get("raw_text", ""),
        })

    user_prompt = (
        f"Today's date (HST): {today_str}\n\n"
        f"Messages to extract facts from:\n\n"
        f"{json.dumps(messages_for_llm, indent=2)}\n\n"
        f"Return a JSON object with key \"facts\" containing an array of extracted facts. "
        f"If no facts are extractable, return {{\"facts\": []}}."
    )

    result = openai_chat(api_key, EXTRACTION_SYSTEM_PROMPT, user_prompt)
    facts = result.get("facts", [])
    if not isinstance(facts, list):
        facts = []
    return facts


# ---------------------------------------------------------------------------
# Supersession detection
# ---------------------------------------------------------------------------

def check_supersession(conn, new_fact):
    fragment = new_fact.get("supersedes_summary_fragment")
    if not fragment or not fragment.strip():
        return None

    fragment_lower = fragment.strip().lower()
    rows = conn.execute(
        "SELECT id, summary FROM facts WHERE status = 'current'"
    ).fetchall()

    for row in rows:
        if fragment_lower in (row["summary"] or "").lower():
            return row["id"]
    return None


def mark_superseded(conn, old_fact_id, new_fact_id):
    conn.execute(
        "UPDATE facts SET status = 'superseded', superseded_by = ?, updated_at = ? WHERE id = ?",
        (new_fact_id, utc_now_iso(), old_fact_id),
    )


# ---------------------------------------------------------------------------
# Store items and facts
# ---------------------------------------------------------------------------

def store_item(conn, item, kept, noise_reason=None):
    try:
        conn.execute(
            """INSERT OR IGNORE INTO items
               (source_type, source_id, subject, sender, recipients, raw_text, received_at, ingested_at, kept, noise_reason)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                item["source_type"], item["source_id"], item.get("subject"),
                item.get("sender"), item.get("recipients"), item.get("raw_text"),
                item.get("received_at"), utc_now_iso(), kept, noise_reason,
            ),
        )
        conn.commit()
        row = conn.execute(
            "SELECT id FROM items WHERE source_id = ?", (item["source_id"],)
        ).fetchone()
        return row["id"] if row else None
    except sqlite3.IntegrityError:
        row = conn.execute(
            "SELECT id FROM items WHERE source_id = ?", (item["source_id"],)
        ).fetchone()
        return row["id"] if row else None


def store_imsg_thread_items(conn, item, kept, noise_reason=None):
    item_ids = []
    thread_msgs = item.get("_thread_messages", [])
    if not thread_msgs:
        return [store_item(conn, item, kept, noise_reason)]

    for msg in thread_msgs:
        sub_item = {
            "source_type": "imessage",
            "source_id": msg["source_id"],
            "subject": item.get("subject"),
            "sender": msg["sender"],
            "recipients": item.get("recipients"),
            "raw_text": msg["text"],
            "received_at": msg["date"],
        }
        iid = store_item(conn, sub_item, kept, noise_reason)
        if iid:
            item_ids.append(iid)
    return item_ids


def store_fact(conn, fact_data, item_id):
    now = utc_now_iso()
    tags = fact_data.get("tags", [])
    who = fact_data.get("who", [])

    cur = conn.execute(
        """INSERT INTO facts
           (item_id, fact_type, tags, summary, who, date_start, date_end,
            location, action, action_owner, deadline, confidence, status, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'current', ?, ?)""",
        (
            item_id,
            fact_data.get("fact_type", ""),
            json.dumps(tags),
            fact_data.get("summary", ""),
            json.dumps(who),
            fact_data.get("date_start"),
            fact_data.get("date_end"),
            fact_data.get("location"),
            fact_data.get("action"),
            fact_data.get("action_owner"),
            fact_data.get("deadline"),
            fact_data.get("confidence", "med"),
            now, now,
        ),
    )
    conn.commit()
    return cur.lastrowid


def store_fact_chunk(conn, fact_id, item_id, chunk_type, chunk_text, embedding):
    conn.execute(
        """INSERT INTO fact_chunks (fact_id, item_id, chunk_type, chunk_text, embedding, embedding_dim)
           VALUES (?, ?, ?, ?, ?, ?)""",
        (fact_id, item_id, chunk_type, chunk_text, embedding.tobytes(), int(embedding.shape[0])),
    )


# ---------------------------------------------------------------------------
# Ingest command
# ---------------------------------------------------------------------------

def cmd_ingest(args):
    api_key = resolve_openai_api_key()
    if not api_key:
        raise SystemExit("OPENAI_API_KEY not found.")

    conn = get_conn(args.db)
    init_db(conn)
    seed_noise_rules(conn)
    noise_rules = load_noise_rules(conn)

    today_str = hst_now().strftime("%Y-%m-%d %H:%M HST")
    stats = {"gmail": 0, "calendar": 0, "imessage": 0, "kept": 0, "filtered": 0, "facts": 0, "superseded": 0}

    all_items = []
    _log("info", "ingest", action="start", hours_back=args.hours_back, days_forward=args.days_forward)
    print("Fetching Gmail...", file=sys.stderr)
    gmail_items = fetch_gmail(conn, hours_back=args.hours_back)
    stats["gmail"] = len(gmail_items)
    all_items.extend(gmail_items)

    print("Fetching Calendar...", file=sys.stderr)
    cal_items = fetch_calendar(conn, days_forward=args.days_forward, days_back=args.days_back)
    stats["calendar"] = len(cal_items)
    all_items.extend(cal_items)

    print("Fetching iMessages...", file=sys.stderr)
    imsg_items = fetch_imessages(conn, max_chats=args.imsg_chats, messages_per_chat=args.imsg_per_chat)
    stats["imessage"] = len(imsg_items)
    all_items.extend(imsg_items)

    if not all_items:
        now = utc_now_iso()
        for st in ["gmail", "calendar", "imessage"]:
            conn.execute(
                "INSERT OR REPLACE INTO checkpoints (source_type, last_checkpoint, last_run_at) VALUES (?, COALESCE((SELECT last_checkpoint FROM checkpoints WHERE source_type = ?), ?), ?)",
                (st, st, now, now),
            )
        conn.commit()
        _log("info", "ingest", action="complete", stats=stats, message="No new items to process")
        print(json.dumps({"ok": True, "stats": stats, "message": "No new items to process"}))
        return

    kept_items = []
    for item in all_items:
        action, reason = apply_noise_filter(item, noise_rules)
        if action == "discard":
            if item["source_type"] == "imessage":
                store_imsg_thread_items(conn, item, kept=False, noise_reason=reason)
            else:
                store_item(conn, item, kept=False, noise_reason=reason)
            stats["filtered"] += 1
        else:
            kept_items.append(item)
            stats["kept"] += 1

    stored_item_map = {}
    for item in kept_items:
        if item["source_type"] == "imessage":
            item_ids = store_imsg_thread_items(conn, item, kept=True)
            if item_ids:
                stored_item_map[item["source_id"]] = item_ids[0]
        else:
            iid = store_item(conn, item, kept=True)
            if iid:
                stored_item_map[item["source_id"]] = iid

    extracted_facts = []
    batch_size = 8
    for i in range(0, len(kept_items), batch_size):
        batch = kept_items[i:i + batch_size]
        batch_num = i // batch_size + 1
        _log("info", "extract", batch=batch_num, items=len(batch))
        try:
            facts = extract_facts_batch(api_key, batch, today_str)
        except Exception as e:
            _log("warning", "extract", batch=batch_num, error=str(e))
            facts = []

        for fact in facts:
            src_idx = fact.get("source_index", 0)
            if 0 <= src_idx < len(batch):
                extracted_facts.append((batch[src_idx], fact))

    all_texts_to_embed = []
    embed_metadata = []

    for item, fact_data in extracted_facts:
        primary_item_id = stored_item_map.get(item["source_id"])
        if not primary_item_id:
            continue

        fact_id = store_fact(conn, fact_data, primary_item_id)
        stats["facts"] += 1

        old_id = check_supersession(conn, fact_data)
        if old_id:
            mark_superseded(conn, old_id, fact_id)
            stats["superseded"] += 1

        summary = fact_data.get("summary", "")
        if summary:
            all_texts_to_embed.append(summary)
            embed_metadata.append(("fact_card", fact_id, primary_item_id, summary))

    for item in kept_items:
        primary_item_id = stored_item_map.get(item["source_id"])
        if not primary_item_id:
            continue
        raw = item.get("raw_text", "")
        raw_chunks = chunk_text(raw, max_words=180, overlap_words=30)
        for chunk in raw_chunks:
            all_texts_to_embed.append(chunk)
            embed_metadata.append(("raw_text", None, primary_item_id, chunk))

    if all_texts_to_embed:
        _log("info", "embed", chunks=len(all_texts_to_embed))
        try:
            vectors = embed_texts(api_key, all_texts_to_embed)
            for (ctype, fid, iid, ctext), vec in zip(embed_metadata, vectors):
                store_fact_chunk(conn, fid, iid, ctype, ctext, vec)
            conn.commit()
        except Exception as e:
            _log("warning", "embed", error=str(e))

    now = utc_now_iso()
    for st in ["gmail", "calendar", "imessage"]:
        source_items = [it for it in all_items if it["source_type"] == st]
        if source_items:
            latest = max(
                (it.get("received_at", "") for it in source_items),
                default=now,
            )
            conn.execute(
                "INSERT OR REPLACE INTO checkpoints (source_type, last_checkpoint, last_run_at) VALUES (?, ?, ?)",
                (st, latest or now, now),
            )
        else:
            conn.execute(
                "INSERT OR REPLACE INTO checkpoints (source_type, last_checkpoint, last_run_at) VALUES (?, COALESCE((SELECT last_checkpoint FROM checkpoints WHERE source_type = ?), ?), ?)",
                (st, st, now, now),
            )
    conn.commit()

    _log("info", "ingest", action="complete", stats=stats)
    print(json.dumps({"ok": True, "stats": stats}, ensure_ascii=True))


# ---------------------------------------------------------------------------
# Search command
# ---------------------------------------------------------------------------

def cmd_search(args):
    api_key = resolve_openai_api_key()
    if not api_key:
        raise SystemExit("OPENAI_API_KEY not found.")

    conn = get_conn(args.db)
    init_db(conn)

    where_parts = []
    params = []
    if args.since:
        since_iso = date_to_since_iso(args.since)
        if since_iso:
            where_parts.append("f.created_at >= ?")
            params.append(since_iso)
    if args.until:
        until_iso = date_to_until_iso(args.until)
        if until_iso:
            where_parts.append("f.created_at <= ?")
            params.append(until_iso)
    if args.tag:
        where_parts.append("f.tags LIKE ?")
        params.append(f"%{args.tag}%")

    fact_filter = ""
    if where_parts:
        fact_filter = "AND " + " AND ".join(where_parts)

    rows = conn.execute(
        f"""SELECT fc.id AS chunk_id, fc.fact_id, fc.item_id, fc.chunk_type,
                   fc.chunk_text, fc.embedding, fc.embedding_dim,
                   f.fact_type, f.tags, f.summary, f.who, f.date_start, f.date_end,
                   f.location, f.action, f.action_owner, f.deadline, f.confidence,
                   f.status, f.created_at
            FROM fact_chunks fc
            LEFT JOIN facts f ON f.id = fc.fact_id
            WHERE 1=1 {fact_filter}""",
        params,
    ).fetchall()

    if not rows:
        print(json.dumps({"ok": True, "query": args.query, "results": []}))
        return

    valid_rows = [r for r in rows if r["embedding"] and r["embedding_dim"]]
    if not valid_rows:
        print(json.dumps({"ok": True, "query": args.query, "results": []}))
        return

    dim = int(valid_rows[0]["embedding_dim"])
    matrix = np.vstack([
        np.frombuffer(r["embedding"], dtype=np.float32, count=dim) for r in valid_rows
    ])

    query_vec = embed_texts(api_key, [args.query])[0]
    sims = cosine_similarity(query_vec, matrix)
    now_utc = datetime.now(timezone.utc)

    scored = []
    for row, sim in zip(valid_rows, sims):
        decay = time_decay_factor(row["created_at"], now_utc)
        score = float(sim) * decay
        scored.append({
            "chunk_id": int(row["chunk_id"]),
            "fact_id": int(row["fact_id"]) if row["fact_id"] else None,
            "chunk_type": row["chunk_type"],
            "chunk_text": row["chunk_text"],
            "fact_type": row["fact_type"],
            "tags": row["tags"],
            "summary": row["summary"],
            "who": row["who"],
            "date_start": row["date_start"],
            "date_end": row["date_end"],
            "location": row["location"],
            "action": row["action"],
            "action_owner": row["action_owner"],
            "deadline": row["deadline"],
            "confidence": row["confidence"],
            "status": row["status"],
            "cosine_similarity": float(sim),
            "time_decay": float(decay),
            "score": float(score),
        })

    scored.sort(key=lambda r: r["score"], reverse=True)
    print(json.dumps({"ok": True, "query": args.query, "results": scored[:args.limit]}, ensure_ascii=True))


# ---------------------------------------------------------------------------
# Facts command
# ---------------------------------------------------------------------------

def cmd_facts(args):
    conn = get_conn(args.db)
    init_db(conn)

    where_parts = []
    params = []

    if args.tag:
        where_parts.append("f.tags LIKE ?")
        params.append(f'%"{args.tag}"%')
    if args.status:
        where_parts.append("f.status = ?")
        params.append(args.status)
    if args.action_owner:
        where_parts.append("f.action_owner = ?")
        params.append(args.action_owner)
    if args.fact_type:
        where_parts.append("f.fact_type = ?")
        params.append(args.fact_type)
    if args.since:
        since_iso = date_to_since_iso(args.since)
        if since_iso:
            where_parts.append("f.created_at >= ?")
            params.append(since_iso)
    if args.until:
        until_iso = date_to_until_iso(args.until)
        if until_iso:
            where_parts.append("f.created_at <= ?")
            params.append(until_iso)

    where_sql = ("WHERE " + " AND ".join(where_parts)) if where_parts else ""
    params.append(args.limit)

    rows = conn.execute(
        f"""SELECT f.id, f.item_id, f.fact_type, f.tags, f.summary, f.who,
                   f.date_start, f.date_end, f.location, f.action, f.action_owner,
                   f.deadline, f.confidence, f.status, f.superseded_by, f.created_at,
                   i.source_type, i.source_id
            FROM facts f
            LEFT JOIN items i ON i.id = f.item_id
            {where_sql}
            ORDER BY f.created_at DESC
            LIMIT ?""",
        params,
    ).fetchall()

    results = []
    for row in rows:
        results.append({
            "id": row["id"],
            "fact_type": row["fact_type"],
            "tags": json.loads(row["tags"]) if row["tags"] else [],
            "summary": row["summary"],
            "who": json.loads(row["who"]) if row["who"] else [],
            "date_start": row["date_start"],
            "date_end": row["date_end"],
            "location": row["location"],
            "action": row["action"],
            "action_owner": row["action_owner"],
            "deadline": row["deadline"],
            "confidence": row["confidence"],
            "status": row["status"],
            "superseded_by": row["superseded_by"],
            "source_type": row["source_type"],
            "source_id": row["source_id"],
            "created_at": row["created_at"],
        })

    print(json.dumps({"ok": True, "facts": results}, ensure_ascii=True))


# ---------------------------------------------------------------------------
# Summary command
# ---------------------------------------------------------------------------

def cmd_summary(args):
    conn = get_conn(args.db)
    init_db(conn)

    since = args.since
    if not since:
        cp_rows = conn.execute(
            "SELECT last_run_at FROM checkpoints ORDER BY last_run_at ASC LIMIT 1"
        ).fetchone()
        if cp_rows and cp_rows["last_run_at"]:
            since = cp_rows["last_run_at"]
        else:
            since = (hst_now() - timedelta(hours=12)).isoformat()

    since_iso = date_to_since_iso(since) or since

    item_count = conn.execute(
        "SELECT COUNT(*) AS n FROM items WHERE ingested_at >= ?", (since_iso,)
    ).fetchone()["n"]
    kept_count = conn.execute(
        "SELECT COUNT(*) AS n FROM items WHERE ingested_at >= ? AND kept = 1", (since_iso,)
    ).fetchone()["n"]
    filtered_count = conn.execute(
        "SELECT COUNT(*) AS n FROM items WHERE ingested_at >= ? AND kept = 0", (since_iso,)
    ).fetchone()["n"]

    new_facts = conn.execute(
        """SELECT f.id, f.fact_type, f.tags, f.summary, f.confidence, f.date_start, f.deadline,
                  i.source_type
           FROM facts f LEFT JOIN items i ON i.id = f.item_id
           WHERE f.created_at >= ? AND f.status = 'current'
           ORDER BY f.created_at DESC LIMIT 25""",
        (since_iso,),
    ).fetchall()

    superseded = conn.execute(
        "SELECT COUNT(*) AS n FROM facts WHERE updated_at >= ? AND status = 'superseded'",
        (since_iso,),
    ).fetchone()["n"]

    now = hst_now()
    upcoming = conn.execute(
        """SELECT summary, date_start, deadline, fact_type
           FROM facts
           WHERE status = 'current'
             AND (date_start IS NOT NULL OR deadline IS NOT NULL)
             AND (date_start >= ? OR deadline >= ?)
           ORDER BY COALESCE(deadline, date_start) ASC
           LIMIT 10""",
        (now.isoformat(), now.isoformat()),
    ).fetchall()

    result = {
        "ok": True,
        "since": since_iso,
        "items_processed": item_count,
        "items_kept": kept_count,
        "items_filtered": filtered_count,
        "new_facts": [
            {
                "id": r["id"],
                "fact_type": r["fact_type"],
                "summary": r["summary"],
                "confidence": r["confidence"],
                "source_type": r["source_type"],
            }
            for r in new_facts
        ],
        "facts_superseded": superseded,
        "upcoming": [
            {
                "summary": r["summary"],
                "date_start": r["date_start"],
                "deadline": r["deadline"],
                "fact_type": r["fact_type"],
            }
            for r in upcoming
        ],
    }
    print(json.dumps(result, ensure_ascii=True))


# ---------------------------------------------------------------------------
# Status command
# ---------------------------------------------------------------------------

def cmd_status(args):
    conn = get_conn(args.db)
    init_db(conn)

    checkpoints = conn.execute("SELECT * FROM checkpoints").fetchall()
    item_count = conn.execute("SELECT COUNT(*) AS n FROM items").fetchone()["n"]
    kept_count = conn.execute("SELECT COUNT(*) AS n FROM items WHERE kept = 1").fetchone()["n"]
    fact_count = conn.execute("SELECT COUNT(*) AS n FROM facts").fetchone()["n"]
    current_facts = conn.execute("SELECT COUNT(*) AS n FROM facts WHERE status = 'current'").fetchone()["n"]
    chunk_count = conn.execute("SELECT COUNT(*) AS n FROM fact_chunks").fetchone()["n"]
    rule_count = conn.execute("SELECT COUNT(*) AS n FROM noise_rules WHERE enabled = 1").fetchone()["n"]

    by_source = conn.execute(
        "SELECT source_type, COUNT(*) AS n FROM items GROUP BY source_type"
    ).fetchall()

    result = {
        "ok": True,
        "checkpoints": {r["source_type"]: {"last_checkpoint": r["last_checkpoint"], "last_run_at": r["last_run_at"]} for r in checkpoints},
        "items_total": item_count,
        "items_kept": kept_count,
        "items_by_source": {r["source_type"]: r["n"] for r in by_source},
        "facts_total": fact_count,
        "facts_current": current_facts,
        "fact_chunks": chunk_count,
        "noise_rules_active": rule_count,
    }
    print(json.dumps(result, ensure_ascii=True))


# ---------------------------------------------------------------------------
# Noise rules management
# ---------------------------------------------------------------------------

def cmd_noise_rules(args):
    conn = get_conn(args.db)
    init_db(conn)

    if args.noise_action == "list":
        rows = conn.execute("SELECT * FROM noise_rules ORDER BY rule_type, pattern").fetchall()
        rules = [dict(r) for r in rows]
        print(json.dumps({"ok": True, "rules": rules}, ensure_ascii=True))

    elif args.noise_action == "add":
        if not args.type or not args.pattern:
            raise SystemExit("--type and --pattern are required for add")
        conn.execute(
            "INSERT INTO noise_rules (rule_type, pattern, action) VALUES (?, ?, ?)",
            (args.type, args.pattern, args.rule_action or "discard"),
        )
        conn.commit()
        print(json.dumps({"ok": True, "added": {"rule_type": args.type, "pattern": args.pattern, "action": args.rule_action or "discard"}}))

    elif args.noise_action == "remove":
        if not args.rule_id:
            raise SystemExit("--id is required for remove")
        conn.execute("DELETE FROM noise_rules WHERE id = ?", (args.rule_id,))
        conn.commit()
        print(json.dumps({"ok": True, "removed": args.rule_id}))

    elif args.noise_action == "toggle":
        if not args.rule_id:
            raise SystemExit("--id is required for toggle")
        conn.execute(
            "UPDATE noise_rules SET enabled = NOT enabled WHERE id = ?", (args.rule_id,),
        )
        conn.commit()
        print(json.dumps({"ok": True, "toggled": args.rule_id}))


# ---------------------------------------------------------------------------
# Init command
# ---------------------------------------------------------------------------

def cmd_init(args):
    conn = get_conn(args.db)
    init_db(conn)
    seeded = seed_noise_rules(conn)
    print(json.dumps({
        "ok": True,
        "db": str(args.db),
        "noise_rules_seeded": seeded,
        "initialized_at": utc_now_iso(),
    }))


# ---------------------------------------------------------------------------
# CLI parser
# ---------------------------------------------------------------------------

def build_parser():
    parser = argparse.ArgumentParser(prog="life_ops", description="Life Ops Indexer")
    parser.add_argument("--db", default=str(DEFAULT_DB), type=str)
    sub = parser.add_subparsers(dest="command", required=True)

    p_init = sub.add_parser("init")
    p_init.set_defaults(func=cmd_init)

    p_ingest = sub.add_parser("ingest")
    p_ingest.add_argument("--hours-back", type=int, default=9)
    p_ingest.add_argument("--days-forward", type=int, default=30)
    p_ingest.add_argument("--days-back", type=int, default=1)
    p_ingest.add_argument("--imsg-chats", type=int, default=30)
    p_ingest.add_argument("--imsg-per-chat", type=int, default=50)
    p_ingest.set_defaults(func=cmd_ingest)

    p_search = sub.add_parser("search")
    p_search.add_argument("--query", required=True)
    p_search.add_argument("--limit", type=int, default=10)
    p_search.add_argument("--since", type=str)
    p_search.add_argument("--until", type=str)
    p_search.add_argument("--tag", type=str)
    p_search.set_defaults(func=cmd_search)

    p_facts = sub.add_parser("facts")
    p_facts.add_argument("--tag", type=str)
    p_facts.add_argument("--status", type=str, default="current")
    p_facts.add_argument("--action-owner", type=str)
    p_facts.add_argument("--fact-type", type=str)
    p_facts.add_argument("--since", type=str)
    p_facts.add_argument("--until", type=str)
    p_facts.add_argument("--limit", type=int, default=50)
    p_facts.set_defaults(func=cmd_facts)

    p_summary = sub.add_parser("summary")
    p_summary.add_argument("--since", type=str)
    p_summary.set_defaults(func=cmd_summary)

    p_status = sub.add_parser("status")
    p_status.set_defaults(func=cmd_status)

    p_noise = sub.add_parser("noise-rules")
    p_noise.add_argument("noise_action", choices=["list", "add", "remove", "toggle"])
    p_noise.add_argument("--type", type=str)
    p_noise.add_argument("--pattern", type=str)
    p_noise.add_argument("--rule-action", type=str, default="discard")
    p_noise.add_argument("--id", type=int, dest="rule_id")
    p_noise.set_defaults(func=cmd_noise_rules)

    return parser


def main():
    parser = build_parser()
    args = parser.parse_args()
    args.db = Path(args.db).expanduser().resolve()
    args.func(args)


if __name__ == "__main__":
    main()
