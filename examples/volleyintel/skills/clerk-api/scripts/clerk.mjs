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

const key = process.env.CLERK_SECRET_KEY;
if (!key) {
  console.error("Missing CLERK_SECRET_KEY");
  process.exit(1);
}

const base = "https://api.clerk.com/v1";
const headers = {
  Authorization: `Bearer ${key}`,
  "Content-Type": "application/json"
};

function sinceMs(hours) {
  return Date.now() - hours * 60 * 60 * 1000;
}

async function get(path) {
  const res = await fetch(`${base}${path}`, { headers });
  const text = await res.text();
  let data = null;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }
  return { ok: res.ok, status: res.status, data };
}

function summarizeSubscription(sub) {
  const items = Array.isArray(sub?.subscription_items) ? sub.subscription_items : [];
  const amount = items.reduce((sum, item) => {
    const fee = Number(item?.plan?.fee?.amount || 0);
    return sum + fee;
  }, 0);
  const planNames = items
    .map((item) => item?.plan?.name)
    .filter(Boolean);
  return {
    id: sub?.id ?? null,
    status: sub?.status ?? null,
    amount,
    planNames
  };
}

async function getUserSubscriptionSnapshot(users) {
  const settled = await Promise.all(
    users.map(async (user) => {
      const result = await get(`/users/${encodeURIComponent(user.id)}/billing/subscription`);
      return { user, result };
    })
  );

  const subscriptions = [];
  for (const entry of settled) {
    if (!entry.result.ok) {
      continue;
    }
    const summary = summarizeSubscription(entry.result.data);
    subscriptions.push({
      userId: entry.user.id,
      email:
        entry.user.email_addresses?.find((email) => email.id === entry.user.primary_email_address_id)
          ?.email_address ?? null,
      ...summary
    });
  }

  const summary = {
    scope: "user",
    organizationFeatureEnabled: false,
    totalChecked: users.length,
    active: subscriptions.filter((sub) => sub.status === "active").length,
    paid: subscriptions.filter((sub) => sub.amount > 0).length,
    free: subscriptions.filter((sub) => sub.amount === 0).length
  };

  return {
    ok: true,
    status: 200,
    data: {
      ...summary,
      subscriptions
    }
  };
}

async function run() {
  const since = sinceMs(24);
  const users = await get("/users?limit=100&order_by=-created_at");
  const totalUsers = await get("/users/count");
  let users24h = users;
  if (users.ok && Array.isArray(users.data)) {
    const recentUsers = users.data.filter((u) => Number(u.created_at || 0) >= since);
    users24h = {
      ok: true,
      status: users.status,
      data: {
        count: recentUsers.length,
        users: recentUsers
      }
    };
  }
  let subscriptions = null;
  if (users.ok && Array.isArray(users.data)) {
    subscriptions = await getUserSubscriptionSnapshot(users.data);
  } else {
    subscriptions = {
      ok: false,
      status: users.status,
      data: {
        skipped: true,
        scope: "user",
        reason: "user list could not be loaded"
      }
    };
  }
  const payload = {
    users24h,
    totalUsers,
    subscriptions
  };
  console.log(JSON.stringify(payload, null, 2));
}

run().catch((err) => {
  console.error(String(err));
  process.exit(1);
});
