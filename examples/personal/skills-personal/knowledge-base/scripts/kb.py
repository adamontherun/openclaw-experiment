#!/usr/bin/env python3
import argparse
import json
import os
import re
import sqlite3
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

import numpy as np
from openai import OpenAI

DEFAULT_MODEL = "text-embedding-3-small"
DEFAULT_DB = Path.home() / ".openclaw" / "memory" / "kb.sqlite"


def utc_now_iso():
    return datetime.now(timezone.utc).isoformat()


def parse_dt(value):
    if not value:
        return None
    value = value.strip()
    fmts = [
        "%Y-%m-%d",
        "%Y-%m-%d %H:%M:%S",
        "%Y-%m-%dT%H:%M:%S",
        "%Y-%m-%dT%H:%M:%S.%f",
        "%Y-%m-%dT%H:%M:%S%z",
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


def resolve_openai_api_key(explicit=None):
    if explicit:
        return explicit
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
    return conn


def init_db(conn):
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS sources (
            id INTEGER PRIMARY KEY,
            url TEXT UNIQUE,
            title TEXT,
            source_type TEXT,
            content TEXT,
            source_weight REAL DEFAULT 1.0,
            ingested_at TEXT
        )
        """
    )
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS chunks (
            id INTEGER PRIMARY KEY,
            source_id INTEGER REFERENCES sources(id),
            chunk_index INTEGER,
            chunk_text TEXT,
            embedding BLOB,
            embedding_dim INTEGER
        )
        """
    )
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS entities (
            id INTEGER PRIMARY KEY,
            source_id INTEGER REFERENCES sources(id),
            name TEXT,
            entity_type TEXT
        )
        """
    )
    conn.execute(
        """
        CREATE INDEX IF NOT EXISTS idx_chunks_source_id ON chunks(source_id)
        """
    )
    conn.execute(
        """
        CREATE INDEX IF NOT EXISTS idx_entities_source_id ON entities(source_id)
        """
    )
    conn.execute(
        """
        CREATE INDEX IF NOT EXISTS idx_sources_ingested_at ON sources(ingested_at)
        """
    )
    conn.commit()


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


COMPANY_SUFFIXES = [
    "Inc", "Inc.", "Corp", "Corp.", "Corporation", "LLC", "Ltd", "Ltd.",
    "Group", "Technologies", "Labs", "Systems", "AI", "Co", "Co.",
    "Studios", "Media", "Ventures", "Capital", "Partners", "Foundation",
]

CONCEPT_TOKENS = {
    "RAG", "LLM", "LLMs", "Embedding", "Embeddings", "Vector", "Vectors",
    "Semantic Search", "Agent", "Agents", "Reinforcement Learning",
    "Prompt Injection", "AGI", "NLP", "GPU", "GPUs", "API", "APIs",
    "RLHF", "SOTA", "SaaS", "IoT", "ML", "DL", "NER", "OCR", "VPN",
    "TCP", "HTTP", "HTTPS", "DNS", "SQL", "CSS", "HTML", "JSON", "YAML",
    "Deep Learning", "Machine Learning", "Natural Language Processing",
    "Computer Vision", "Neural Network", "Neural Networks",
    "Transformer", "Transformers", "Fine Tuning",
}

STOP_WORDS = {
    "The", "This", "That", "These", "Those", "Here", "There", "Where",
    "When", "What", "Which", "Who", "Whom", "Why", "How",
    "He", "She", "His", "Her", "Him", "Its", "They", "Them", "Their",
    "We", "Our", "You", "Your", "It", "My",
    "And", "But", "Or", "Not", "Nor", "Yet", "So", "For", "If", "As",
    "In", "On", "At", "To", "Of", "By", "Is", "Are", "Was", "Were",
    "Be", "Do", "Does", "Did", "Has", "Had", "Have", "Can", "Will",
    "Just", "Also", "Now", "New", "Some", "Any", "All", "Each", "Every",
    "No", "Yes", "True", "False", "Much", "Many", "More", "Most", "Very",
    "About", "After", "Before", "Between", "Into", "From", "With",
    "However", "Because", "Although", "While", "Since", "Until",
    "Instead", "During", "Without", "Within", "Through",
    "Would", "Could", "Should", "Might", "Must",
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
    "Overview", "Summary", "Introduction", "Conclusion", "References",
    "Section", "Chapter", "Part", "Act", "Episode", "Key", "Core",
    "Note", "Notes", "Example", "Examples", "Source", "Sources",
    "Question", "Questions", "Answer", "Answers", "Argument",
    "Interview", "Review", "Analysis", "Discussion", "Themes",
    "Real", "Actual", "Normal", "Final", "Main", "First", "Second",
    "Third", "Last", "Next", "Other", "Another", "Both", "Few",
    "Great", "Good", "Bad", "Big", "Small", "Long", "Short", "Old",
    "Best", "Worst", "Only", "Right", "Wrong", "Well",
    "Calls", "Argues", "Claims", "Says", "Said", "Asks", "Asked",
    "Believes", "Thinks", "Wants", "Needs", "Makes", "Takes",
    "Criticizes", "Challenges", "Identifies", "Describes",
    "Millions", "Billions", "Thousands", "Hundreds",
    "Companies", "Markets", "Investors", "Retail", "Financial",
    "Marketing", "Technology", "Expertise", "Reality",
    "Black", "White", "Red", "Blue", "Green",
    "Podcast", "Video", "Article", "Post", "Thread",
}

def classify_entity(name):
    if name in CONCEPT_TOKENS:
        return "concept"
    for suffix in COMPANY_SUFFIXES:
        if name.endswith(f" {suffix}") or name == suffix:
            return "company"
    if re.fullmatch(r"[A-Z]{2,}", name):
        return "concept"
    return "person"


def _clean_for_ner(text):
    text = re.sub(r"^#{1,6}\s+.*$", ".", text, flags=re.MULTILINE)
    text = re.sub(r"^\*\*[^*]+\*\*:?\s*$", ".", text, flags=re.MULTILINE)
    text = re.sub(r"^---+$", ".", text, flags=re.MULTILINE)
    text = re.sub(r"\*\*([^*]+)\*\*", r"\1", text)
    text = re.sub(r"\*([^*]+)\*", r"\1", text)
    text = re.sub(r"`[^`]+`", " ", text)
    text = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", text)
    text = re.sub(r"^[-*]\s+", "", text, flags=re.MULTILINE)
    text = re.sub(r"[.!?;:\n]+", " . ", text)
    text = re.sub(r"\s+", " ", text)
    return text


def extract_entities(text, max_entities=80):
    cleaned = _clean_for_ner(text)

    sentences = [s.strip() for s in cleaned.split(" . ") if s.strip()]

    seen = set()
    results = []
    for sentence in sentences:
        multi = re.findall(
            r"\b([A-Z][a-z]+(?:\s+[A-Z][a-z&'-]+){1,3})\b", sentence
        )
        acronyms = re.findall(
            r"\b([A-Z]{2,}(?:\s+[A-Z]{2,}){0,2})\b", sentence
        )
        for c in multi + acronyms:
            c = c.strip()
            if len(c) < 3:
                continue
            words = c.split()
            if len(words) > 1 and words[0] in {
                "On",
                "In",
                "At",
                "By",
                "As",
                "Because",
                "However",
                "But",
                "And",
                "Or",
                "From",
                "To",
                "Of",
                "With",
                "Without",
                "Within",
                "Through",
                "During",
                "After",
                "Before",
                "Between",
                "Into",
                "Since",
                "Until",
            }:
                continue
            if all(w in STOP_WORDS for w in words):
                continue
            if c.lower() in seen:
                continue
            seen.add(c.lower())
            results.append({"name": c, "entity_type": classify_entity(c)})
            if len(results) >= max_entities:
                return results
    return results


def openai_client(api_key):
    try:
        return OpenAI(api_key=api_key)
    except Exception:
        return None


def embed_texts_http(api_key, texts, model):
    url = "https://api.openai.com/v1/embeddings"
    payload = json.dumps({"model": model, "input": texts}).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=payload,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            data = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"OpenAI embeddings HTTP error {exc.code}: {body}")
    except urllib.error.URLError as exc:
        raise RuntimeError(f"OpenAI embeddings network error: {exc}")
    items = sorted(data.get("data", []), key=lambda d: d.get("index", 0))
    vectors = []
    for item in items:
        vec = np.array(item.get("embedding", []), dtype=np.float32)
        vectors.append(vec)
    if len(vectors) != len(texts):
        raise RuntimeError("Unexpected OpenAI embeddings response size.")
    return vectors


def embed_texts(client, texts, model=DEFAULT_MODEL, batch_size=64, api_key=None):
    vectors = []
    for i in range(0, len(texts), batch_size):
        batch = texts[i : i + batch_size]
        if client is not None:
            try:
                response = client.embeddings.create(model=model, input=batch)
                data = sorted(response.data, key=lambda d: d.index)
                for item in data:
                    vec = np.array(item.embedding, dtype=np.float32)
                    vectors.append(vec)
                continue
            except Exception:
                pass
        key = api_key or resolve_openai_api_key()
        vectors.extend(embed_texts_http(key, batch, model))
    return vectors


def read_input_text(args):
    if args.file:
        p = Path(args.file)
        return p.read_text(encoding="utf-8")
    if not sys.stdin.isatty():
        return sys.stdin.read()
    return ""


def cmd_init(args):
    conn = get_conn(args.db)
    init_db(conn)
    print(json.dumps({"ok": True, "db": str(args.db), "initialized_at": utc_now_iso()}))


def cmd_backfill_ingested_at(args):
    conn = get_conn(args.db)
    init_db(conn)
    ts = args.timestamp
    cur = conn.execute("UPDATE sources SET ingested_at = ?", (ts,))
    conn.commit()
    print(json.dumps({"ok": True, "updated": cur.rowcount, "ingested_at": ts}))


def upsert_source(conn, url, title, source_type, content, source_weight, ingested_at):
    row = conn.execute("SELECT id FROM sources WHERE url = ?", (url,)).fetchone()
    if row:
        source_id = int(row["id"])
        conn.execute(
            """
            UPDATE sources
            SET title = ?, source_type = ?, content = ?, source_weight = ?, ingested_at = ?
            WHERE id = ?
            """,
            (title, source_type, content, float(source_weight), ingested_at, source_id),
        )
        conn.execute("DELETE FROM chunks WHERE source_id = ?", (source_id,))
        conn.execute("DELETE FROM entities WHERE source_id = ?", (source_id,))
        return source_id, True
    cur = conn.execute(
        """
        INSERT INTO sources (url, title, source_type, content, source_weight, ingested_at)
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (url, title, source_type, content, float(source_weight), ingested_at),
    )
    return int(cur.lastrowid), False


def cmd_ingest(args):
    text = read_input_text(args).strip()
    if not text:
        raise SystemExit("No content provided. Pipe content via stdin or use --file.")
    if not args.url:
        raise SystemExit("--url is required.")
    if not args.title:
        raise SystemExit("--title is required.")
    api_key = resolve_openai_api_key(args.openai_api_key)
    if not api_key:
        raise SystemExit("OPENAI_API_KEY not found.")
    conn = get_conn(args.db)
    init_db(conn)
    chunks = chunk_text(text, max_words=args.max_words, overlap_words=args.overlap_words)
    if not chunks:
        raise SystemExit("No chunks generated from content.")
    client = openai_client(api_key)
    vectors = embed_texts(client, chunks, model=args.model, batch_size=args.batch_size, api_key=api_key)
    ingested_at = args.ingested_at or utc_now_iso()
    source_id, updated = upsert_source(
        conn,
        args.url,
        args.title,
        args.type,
        text,
        args.source_weight,
        ingested_at,
    )
    for idx, (chunk, vec) in enumerate(zip(chunks, vectors)):
        conn.execute(
            """
            INSERT INTO chunks (source_id, chunk_index, chunk_text, embedding, embedding_dim)
            VALUES (?, ?, ?, ?, ?)
            """,
            (source_id, idx, chunk, vec.tobytes(), int(vec.shape[0])),
        )
    entities = extract_entities(text, max_entities=args.max_entities)
    for e in entities:
        conn.execute(
            """
            INSERT INTO entities (source_id, name, entity_type)
            VALUES (?, ?, ?)
            """,
            (source_id, e["name"], e["entity_type"]),
        )
    conn.commit()
    print(
        json.dumps(
            {
                "ok": True,
                "updated": updated,
                "source_id": source_id,
                "url": args.url,
                "title": args.title,
                "source_type": args.type,
                "chunks": len(chunks),
                "entities": entities,
                "ingested_at": ingested_at,
            },
            ensure_ascii=True,
        )
    )


def cosine_similarity(query_vec, matrix):
    q_norm = np.linalg.norm(query_vec)
    m_norm = np.linalg.norm(matrix, axis=1)
    denom = np.maximum(q_norm * m_norm, 1e-12)
    return np.dot(matrix, query_vec) / denom


def time_decay_factor(ingested_at, now_utc, decay_per_day=0.01):
    dt = parse_dt(ingested_at)
    if not dt:
        return 1.0
    delta_days = max(0.0, (now_utc - dt).total_seconds() / 86400.0)
    return 1.0 / (1.0 + delta_days * decay_per_day)


def cmd_search(args):
    api_key = resolve_openai_api_key(args.openai_api_key)
    if not api_key:
        raise SystemExit("OPENAI_API_KEY not found.")
    conn = get_conn(args.db)
    init_db(conn)
    where_parts = []
    params = []
    if args.since:
        since_iso = date_to_since_iso(args.since)
        if since_iso:
            where_parts.append("s.ingested_at >= ?")
            params.append(since_iso)
    if args.until:
        until_iso = date_to_until_iso(args.until)
        if until_iso:
            where_parts.append("s.ingested_at <= ?")
            params.append(until_iso)
    where_sql = ("WHERE " + " AND ".join(where_parts)) if where_parts else ""
    rows = conn.execute(
        f"""
        SELECT
            c.id AS chunk_id,
            c.source_id AS source_id,
            c.chunk_index AS chunk_index,
            c.chunk_text AS chunk_text,
            c.embedding AS embedding,
            c.embedding_dim AS embedding_dim,
            s.url AS url,
            s.title AS title,
            s.source_type AS source_type,
            s.source_weight AS source_weight,
            s.ingested_at AS ingested_at
        FROM chunks c
        JOIN sources s ON s.id = c.source_id
        {where_sql}
        """,
        params,
    ).fetchall()
    if not rows:
        print(json.dumps({"ok": True, "query": args.query, "results": []}))
        return
    dim = int(rows[0]["embedding_dim"])
    vectors = np.vstack([
        np.frombuffer(row["embedding"], dtype=np.float32, count=dim) for row in rows
    ])
    client = openai_client(api_key)
    query_vec = embed_texts(client, [args.query], model=args.model, api_key=api_key)[0]
    sims = cosine_similarity(query_vec, vectors)
    now_utc = datetime.now(timezone.utc)
    scored = []
    for row, sim in zip(rows, sims):
        decay = time_decay_factor(row["ingested_at"], now_utc, decay_per_day=args.decay_per_day)
        source_weight = float(row["source_weight"] or 1.0)
        final = float(sim) * decay * source_weight
        scored.append(
            {
                "chunk_id": int(row["chunk_id"]),
                "source_id": int(row["source_id"]),
                "chunk_index": int(row["chunk_index"]),
                "title": row["title"],
                "url": row["url"],
                "source_type": row["source_type"],
                "ingested_at": row["ingested_at"],
                "chunk_text": row["chunk_text"],
                "cosine_similarity": float(sim),
                "time_decay": float(decay),
                "source_weight": float(source_weight),
                "score": float(final),
            }
        )
    scored.sort(key=lambda r: r["score"], reverse=True)
    print(json.dumps({"ok": True, "query": args.query, "results": scored[: args.limit]}, ensure_ascii=True))


def cmd_list(args):
    conn = get_conn(args.db)
    init_db(conn)
    where_parts = []
    params = []
    if args.since:
        since_iso = date_to_since_iso(args.since)
        if since_iso:
            where_parts.append("ingested_at >= ?")
            params.append(since_iso)
    if args.until:
        until_iso = date_to_until_iso(args.until)
        if until_iso:
            where_parts.append("ingested_at <= ?")
            params.append(until_iso)
    where_sql = ("WHERE " + " AND ".join(where_parts)) if where_parts else ""
    params.append(args.limit)
    rows = conn.execute(
        f"""
        SELECT id, url, title, source_type, source_weight, ingested_at
        FROM sources
        {where_sql}
        ORDER BY datetime(ingested_at) DESC
        LIMIT ?
        """,
        params,
    ).fetchall()
    out = [dict(row) for row in rows]
    print(json.dumps({"ok": True, "sources": out}, ensure_ascii=True))


def cmd_stats(args):
    conn = get_conn(args.db)
    init_db(conn)
    source_count = conn.execute("SELECT COUNT(*) AS n FROM sources").fetchone()["n"]
    chunk_count = conn.execute("SELECT COUNT(*) AS n FROM chunks").fetchone()["n"]
    entity_count = conn.execute("SELECT COUNT(*) AS n FROM entities").fetchone()["n"]
    by_type_rows = conn.execute(
        """
        SELECT source_type, COUNT(*) AS n
        FROM sources
        GROUP BY source_type
        ORDER BY n DESC
        """
    ).fetchall()
    by_type = {row["source_type"]: row["n"] for row in by_type_rows}
    print(
        json.dumps(
            {
                "ok": True,
                "stats": {
                    "sources": int(source_count),
                    "chunks": int(chunk_count),
                    "entities": int(entity_count),
                    "by_source_type": by_type,
                },
            },
            ensure_ascii=True,
        )
    )


def cmd_entities(args):
    conn = get_conn(args.db)
    init_db(conn)
    where_parts = []
    params = []
    if args.type:
        where_parts.append("e.entity_type = ?")
        params.append(args.type)
    if args.since:
        since_iso = date_to_since_iso(args.since)
        if since_iso:
            where_parts.append("s.ingested_at >= ?")
            params.append(since_iso)
    if args.until:
        until_iso = date_to_until_iso(args.until)
        if until_iso:
            where_parts.append("s.ingested_at <= ?")
            params.append(until_iso)
    where_sql = ("WHERE " + " AND ".join(where_parts)) if where_parts else ""
    params.append(args.limit)
    rows = conn.execute(
        f"""
        SELECT e.name, e.entity_type, e.source_id, s.title, s.url, s.ingested_at
        FROM entities e
        JOIN sources s ON s.id = e.source_id
        {where_sql}
        ORDER BY datetime(s.ingested_at) DESC, e.name ASC
        LIMIT ?
        """,
        params,
    ).fetchall()
    print(json.dumps({"ok": True, "entities": [dict(r) for r in rows]}, ensure_ascii=True))


def build_parser():
    parser = argparse.ArgumentParser()
    parser.add_argument("--db", default=str(DEFAULT_DB), type=str)
    sub = parser.add_subparsers(dest="command", required=True)

    p_init = sub.add_parser("init")
    p_init.set_defaults(func=cmd_init)

    p_backfill = sub.add_parser("backfill-ingested-at")
    p_backfill.add_argument("--timestamp", default="2026-02-18T12:00:00+00:00", type=str)
    p_backfill.set_defaults(func=cmd_backfill_ingested_at)

    p_ingest = sub.add_parser("ingest")
    p_ingest.add_argument("--url", required=True)
    p_ingest.add_argument("--title", required=True)
    p_ingest.add_argument("--type", choices=["article", "youtube", "tweet", "reddit", "pdf", "podcast"], required=True)
    p_ingest.add_argument("--source-weight", type=float, default=1.0)
    p_ingest.add_argument("--file", type=str)
    p_ingest.add_argument("--max-words", type=int, default=180)
    p_ingest.add_argument("--overlap-words", type=int, default=30)
    p_ingest.add_argument("--batch-size", type=int, default=64)
    p_ingest.add_argument("--max-entities", type=int, default=80)
    p_ingest.add_argument("--model", type=str, default=DEFAULT_MODEL)
    p_ingest.add_argument("--openai-api-key", type=str)
    p_ingest.add_argument("--ingested-at", type=str)
    p_ingest.set_defaults(func=cmd_ingest)

    p_search = sub.add_parser("search")
    p_search.add_argument("--query", required=True)
    p_search.add_argument("--limit", type=int, default=10)
    p_search.add_argument("--since", type=str)
    p_search.add_argument("--until", type=str)
    p_search.add_argument("--decay-per-day", type=float, default=0.01)
    p_search.add_argument("--model", type=str, default=DEFAULT_MODEL)
    p_search.add_argument("--openai-api-key", type=str)
    p_search.set_defaults(func=cmd_search)

    p_list = sub.add_parser("list")
    p_list.add_argument("--limit", type=int, default=20)
    p_list.add_argument("--since", type=str)
    p_list.add_argument("--until", type=str)
    p_list.set_defaults(func=cmd_list)

    p_stats = sub.add_parser("stats")
    p_stats.set_defaults(func=cmd_stats)

    p_entities = sub.add_parser("entities")
    p_entities.add_argument("--type", choices=["person", "company", "concept"])
    p_entities.add_argument("--limit", type=int, default=100)
    p_entities.add_argument("--since", type=str)
    p_entities.add_argument("--until", type=str)
    p_entities.set_defaults(func=cmd_entities)

    return parser


def main():
    parser = build_parser()
    args = parser.parse_args()
    args.db = Path(args.db).expanduser().resolve()
    args.func(args)


if __name__ == "__main__":
    main()
