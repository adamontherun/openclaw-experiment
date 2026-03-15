#!/usr/bin/env node
import { readFileSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { resolve } from "node:path";
import process from "node:process";
import { spawnSync, execFileSync } from "node:child_process";

const CHANNEL_IDS = {
  x: "69b499da7be9f8b17153bbd1",
  instagram: "69b4999f7be9f8b17153ba90",
  threads: "69b499b77be9f8b17153bb12"
};

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

function parseArgs(argv) {
  const args = [...argv];
  const mode = args.shift() || "";
  const options = {};
  while (args.length > 0) {
    const current = args.shift();
    if (!current || !current.startsWith("--")) {
      continue;
    }
    const key = current.slice(2);
    const value = args[0] && !args[0].startsWith("--") ? args.shift() : "true";
    options[key] = value;
  }
  return { mode, options };
}

async function graphQLRequest(query) {
  const res = await fetch("https://api.buffer.com", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.BUFFER_API_KEY}`
    },
    body: JSON.stringify({ query })
  });
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text };
  }
  return { ok: res.ok, status: res.status, json };
}

function ensure(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function countChars(value) {
  return Array.from(String(value || "")).length;
}

function print(payload) {
  console.log(JSON.stringify(payload, null, 2));
}

function readTextFromFile(pathValue) {
  return readFileSync(resolve(pathValue), "utf8").trim();
}

function parseJsonSafe(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function findFirstId(value) {
  if (!value) {
    return null;
  }
  if (typeof value === "string") {
    if (/^[A-Za-z0-9_-]{10,}$/.test(value)) {
      return value;
    }
    return null;
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findFirstId(item);
      if (found) {
        return found;
      }
    }
    return null;
  }
  if (typeof value === "object") {
    if (typeof value.id === "string" && /^[A-Za-z0-9_-]{10,}$/.test(value.id)) {
      return value.id;
    }
    if (typeof value.fileId === "string" && /^[A-Za-z0-9_-]{10,}$/.test(value.fileId)) {
      return value.fileId;
    }
    for (const key of Object.keys(value)) {
      const found = findFirstId(value[key]);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

function runGog(args, account) {
  const finalArgs = [...args];
  if (account) {
    finalArgs.push(`--account=${account}`);
  }
  const result = spawnSync("gog", finalArgs, {
    encoding: "utf8",
    env: process.env
  });
  return result;
}

function readRunFromDb(dbPath, runId) {
  const out = execFileSync("sqlite3", [dbPath, ".mode json", `SELECT * FROM runs WHERE id = ${runId} LIMIT 1;`], {
    encoding: "utf8"
  }).trim();
  if (!out) return null;
  const rows = JSON.parse(out);
  if (!rows.length) return null;
  const row = rows[0];
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

function sleep(ms) {
  return new Promise((resolvePromise) => {
    setTimeout(resolvePromise, ms);
  });
}

async function waitForPublicImageUrl(urlValue) {
  for (let attempt = 0; attempt < 6; attempt += 1) {
    try {
      const res = await fetch(urlValue, { method: "HEAD", redirect: "follow" });
      if (res.ok) {
        return true;
      }
    } catch {}
    await sleep(2000);
  }
  return false;
}

async function uploadImageToDrive(localPath, account) {
  const absolutePath = resolve(localPath);
  ensure(existsSync(absolutePath), `Image file not found: ${absolutePath}`);
  const upload = runGog(["drive", "upload", absolutePath, "--json"], account);
  if (upload.error) {
    throw new Error(`Failed to execute gog upload: ${String(upload.error.message || upload.error)}`);
  }
  if (upload.status !== 0) {
    throw new Error((upload.stderr || upload.stdout || "gog upload failed").trim());
  }
  const uploadJson = parseJsonSafe(upload.stdout || "");
  const fileId = findFirstId(uploadJson) || findFirstId(upload.stdout || "");
  ensure(fileId, "Could not read uploaded Drive file ID from gog output.");
  const share = runGog(["drive", "share", fileId, "--anyone", "--role", "reader", "--json"], account);
  if (share.error) {
    throw new Error(`Failed to execute gog share: ${String(share.error.message || share.error)}`);
  }
  if (share.status !== 0) {
    throw new Error((share.stderr || share.stdout || "gog share failed").trim());
  }
  const publicUrl = `https://lh3.googleusercontent.com/d/${fileId}`;
  const available = await waitForPublicImageUrl(publicUrl);
  ensure(available, `Drive image URL did not become public in time: ${publicUrl}`);
  return publicUrl;
}

async function getOrganizations() {
  const query = `
    query GetOrganizations {
      account {
        organizations {
          id
          name
        }
      }
    }
  `;
  const result = await graphQLRequest(query);
  const organizations = result.json?.data?.account?.organizations || [];
  return { result, organizations };
}

function escapeString(value) {
  return JSON.stringify(String(value));
}

function normalizeMode(value) {
  const allowed = new Set(["shareNow", "addToQueue", "customSchedule"]);
  if (!value) {
    return "shareNow";
  }
  ensure(allowed.has(value), "Invalid --mode. Use shareNow, addToQueue, or customSchedule.");
  return value;
}

function normalizeSchedulingType(value) {
  const allowed = new Set(["automatic", "notification"]);
  if (!value) {
    return "automatic";
  }
  ensure(allowed.has(value), "Invalid --scheduling-type. Use automatic or notification.");
  return value;
}

async function runChannels(options) {
  const { result: orgResult, organizations } = await getOrganizations();
  ensure(orgResult.ok, "Failed to load organizations from Buffer.");
  ensure(Array.isArray(organizations) && organizations.length > 0, "No organizations available in Buffer account.");
  const organizationId = options.organization || organizations[0].id;
  const query = `
    query GetChannels {
      channels(input: { organizationId: ${escapeString(organizationId)} }) {
        id
        name
        displayName
        service
        avatar
        isQueuePaused
      }
    }
  `;
  const channelResult = await graphQLRequest(query);
  ensure(channelResult.ok, "Failed to load channels from Buffer.");
  return {
    ok: true,
    mode: "channels",
    organization: {
      selectedId: organizationId,
      available: organizations
    },
    channels: channelResult.json?.data?.channels || []
  };
}

async function runScheduled(options) {
  const { result: orgResult, organizations } = await getOrganizations();
  ensure(orgResult.ok, "Failed to load organizations from Buffer.");
  ensure(Array.isArray(organizations) && organizations.length > 0, "No organizations available in Buffer account.");
  const organizationId = options.organization || organizations[0].id;
  const query = `
    query GetScheduledPosts {
      posts(
        input: {
          organizationId: ${escapeString(organizationId)},
          sort: [{ field: dueAt, direction: asc }, { field: createdAt, direction: desc }],
          filter: { status: [scheduled] }
        }
      ) {
        edges {
          node {
            id
            text
            status
            dueAt
            createdAt
          }
        }
      }
    }
  `;
  const postResult = await graphQLRequest(query);
  ensure(postResult.ok, "Failed to load scheduled posts from Buffer.");
  const posts = (postResult.json?.data?.posts?.edges || []).map((edge) => edge.node);
  return {
    ok: true,
    mode: "scheduled",
    organization: {
      selectedId: organizationId,
      available: organizations
    },
    posts
  };
}

async function runPost(options) {
  const channelId = options.channel;
  const text = options.text || (options["text-file"] ? readTextFromFile(options["text-file"]) : "");
  ensure(channelId, "Missing --channel for post mode.");
  ensure(text, "Missing --text for post mode.");
  const mode = normalizeMode(options.mode);
  const schedulingType = normalizeSchedulingType(options["scheduling-type"]);
  const dueAt = options["due-at"];
  let imageUrl = options["image-url"] || "";
  if (!imageUrl && options["image-file"]) {
    const account = options["gog-account"] || process.env.GOG_ACCOUNT || "";
    imageUrl = await uploadImageToDrive(options["image-file"], account);
  }
  if (mode === "customSchedule") {
    ensure(dueAt, "Missing --due-at when --mode customSchedule.");
  }

  const inputFields = [
    `text: ${escapeString(text)}`,
    `channelId: ${escapeString(channelId)}`,
    `schedulingType: ${schedulingType}`,
    `mode: ${mode}`
  ];
  if (dueAt) {
    inputFields.push(`dueAt: ${escapeString(dueAt)}`);
  }
  if (imageUrl) {
    inputFields.push(`assets: { images: [{ url: ${escapeString(imageUrl)} }] }`);
  }
  if (channelId === CHANNEL_IDS.instagram) {
    inputFields.push("metadata: { instagram: { type: post, shouldShareToFeed: true } }");
  }

  const query = `
    mutation CreatePost {
      createPost(input: {
        ${inputFields.join(",\n        ")}
      }) {
        __typename
        ... on PostActionSuccess {
          post {
            id
            text
            status
            dueAt
            createdAt
            error {
              message
              supportUrl
              rawError
            }
          }
        }
        ... on MutationError {
          message
        }
      }
    }
  `;

  const createResult = await graphQLRequest(query);
  ensure(createResult.ok, "Buffer post request failed.");
  const payload = createResult.json?.data?.createPost;
  const type = payload?.__typename || "";
  if (type !== "PostActionSuccess") {
    return {
      ok: false,
      mode: "post",
      errorType: type,
      error: payload?.message || "Buffer rejected the post."
    };
  }
  const createdPost = payload?.post || null;
  if (createdPost?.status === "error") {
    return {
      ok: false,
      mode: "post",
      errorType: "PostPublishingError",
      error: createdPost?.error?.message || "Post was accepted but failed during publishing.",
      createdPost
    };
  }
  return {
    ok: true,
    mode: "post",
    createdPost
  };
}

async function runPublish(options) {
  const channels = {
    x: { id: CHANNEL_IDS.x, label: "X" },
    instagram: { id: CHANNEL_IDS.instagram, label: "Instagram" },
    threads: { id: CHANNEL_IDS.threads, label: "Threads" }
  };
  const runDb = resolve(options["run-db"] || "memory/content.db");
  const runId = Number(options["run-id"] || "");
  ensure(Number.isInteger(runId) && runId > 0, "Missing or invalid --run-id for publish mode.");
  const run = readRunFromDb(runDb, runId);
  ensure(run, `Run not found for --run-id ${runId}`);
  const xCopy = run.copyX;
  const igCopy = run.copyInstagram;
  const threadsCopy = run.copyThreads;
  const imageFromFile = run.imageFile;
  ensure(imageFromFile, `Run ${runId} is missing image_file.`);
  ensure(xCopy, `Run ${runId} is missing copy_x.`);
  ensure(igCopy, `Run ${runId} is missing copy_instagram.`);
  ensure(threadsCopy, `Run ${runId} is missing copy_threads.`);
  ensure(countChars(xCopy) <= 280, `Run ${runId} copy_x exceeds 280 characters.`);
  ensure(countChars(threadsCopy) <= 500, `Run ${runId} copy_threads exceeds 500 characters.`);

  const results = [];

  async function postOne(channelKey, text, imageUrl) {
    const ch = channels[channelKey];
    if (!text) {
      results.push({ channel: ch.label, ok: false, error: "No copy found for channel." });
      return;
    }
    const postOpts = { channel: ch.id, text, mode: options.mode || "shareNow" };
    if (imageUrl) postOpts["image-url"] = imageUrl;
    const result = await runPost(postOpts);
    results.push({ channel: ch.label, ...result });
  }

  let imageUrl = "";
  const account = options["gog-account"] || process.env.GOG_ACCOUNT || "";
  if (!imageUrl && imageFromFile) {
    imageUrl = await uploadImageToDrive(imageFromFile, account);
  }
  await postOne("x", xCopy, imageUrl || null);
  await postOne("instagram", igCopy, imageUrl);
  await postOne("threads", threadsCopy, imageUrl || null);

  return {
    ok: results.every((r) => r.ok),
    mode: "publish",
    results
  };
}

async function run() {
  loadEnvFallback();
  if (!process.env.BUFFER_API_KEY) {
    throw new Error("Missing BUFFER_API_KEY");
  }
  const { mode, options } = parseArgs(process.argv.slice(2));
  let result = null;
  if (mode === "channels") {
    result = await runChannels(options);
  } else if (mode === "scheduled") {
    result = await runScheduled(options);
  } else if (mode === "post") {
    result = await runPost(options);
  } else if (mode === "publish") {
    result = await runPublish(options);
  } else {
    throw new Error("Usage: node scripts/buffer.mjs <channels|scheduled|post|publish> [--options]");
  }
  print(result);
}

run().catch((error) => {
  print({
    ok: false,
    error: String(error?.message || error)
  });
  process.exit(1);
});
