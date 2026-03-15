#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { resolve } from "node:path";
import process from "node:process";

function loadEnvFallback() {
  const envPath = resolve(homedir(), ".openclaw", ".env");
  let raw = "";
  try {
    raw = readFileSync(envPath, "utf8");
  } catch {
    return;
  }
  const lines = raw.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }
    const separator = trimmed.indexOf("=");
    if (separator <= 0) {
      continue;
    }
    const name = trimmed.slice(0, separator).trim();
    if (!name || process.env[name]) {
      continue;
    }
    const value = trimmed.slice(separator + 1);
    process.env[name] = value;
  }
}

loadEnvFallback();

const key = process.env.POSTHOG_PERSONAL_API_KEY;
const projectId = process.env.POSTHOG_PROJECT_ID;
const mode = process.argv[2] || "web";

if (!key) {
  console.error("Missing POSTHOG_PERSONAL_API_KEY");
  process.exit(1);
}

if (!projectId) {
  console.error("Missing POSTHOG_PROJECT_ID");
  process.exit(1);
}

const base = `https://us.posthog.com/api/projects/${projectId}`;

const headers = {
  Authorization: `Bearer ${key}`,
  "Content-Type": "application/json"
};

async function request(path, payload) {
  const res = await fetch(`${base}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload)
  });
  const text = await res.text();
  let data = null;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }
  if (!res.ok) {
    return { ok: false, status: res.status, data };
  }
  return { ok: true, status: res.status, data };
}

async function runWeb() {
  const trend = await request("/query/", {
    query: {
      kind: "HogQLQuery",
      query:
        "SELECT toDate(timestamp) AS day, count() AS pageviews FROM events WHERE event = '$pageview' AND timestamp >= now() - INTERVAL 7 DAY GROUP BY day ORDER BY day"
    },
    name: "web_pageviews_daily_7d"
  });
  const totals = await request("/query/", {
    query: {
      kind: "HogQLQuery",
      query:
        "SELECT count() AS pageviews, count(DISTINCT distinct_id) AS unique_visitors FROM events WHERE event = '$pageview' AND timestamp >= now() - INTERVAL 7 DAY"
    },
    name: "web_totals_7d"
  });
  const payload = {
    mode: "web",
    trend,
    totals
  };
  console.log(JSON.stringify(payload, null, 2));
}

async function runUsage() {
  const trend = await request("/query/", {
    query: {
      kind: "HogQLQuery",
      query:
        "SELECT event, count() AS count FROM events WHERE event IN ('school_viewed', 'search_submitted', 'search_result_clicked', 'school_card_clicked', 'outbound_link_clicked') AND timestamp >= now() - INTERVAL 7 DAY GROUP BY event ORDER BY count DESC"
    },
    name: "usage_event_counts_7d"
  });
  const recent = await request("/query/", {
    query: {
      kind: "HogQLQuery",
      query:
        "SELECT event, timestamp, distinct_id FROM events WHERE timestamp >= now() - INTERVAL 1 DAY ORDER BY timestamp DESC LIMIT 100"
    },
    name: "usage_recent_events_24h"
  });
  const payload = {
    mode: "usage",
    trend,
    recent
  };
  console.log(JSON.stringify(payload, null, 2));
}

if (mode === "web") {
  runWeb().catch((err) => {
    console.error(String(err));
    process.exit(1);
  });
} else if (mode === "usage") {
  runUsage().catch((err) => {
    console.error(String(err));
    process.exit(1);
  });
} else {
  console.error("Usage: node scripts/posthog.mjs <web|usage>");
  process.exit(1);
}
