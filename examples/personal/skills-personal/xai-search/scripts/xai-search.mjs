import process from "node:process";

function fail(message, details) {
  const payload = { ok: false, error: { message } };
  if (details !== undefined) payload.error.details = details;
  process.stdout.write(JSON.stringify(payload, null, 2) + "\n");
  process.exitCode = 1;
}

function ok(data) {
  process.stdout.write(JSON.stringify({ ok: true, data }, null, 2) + "\n");
}

function parseArgs(argv) {
  const args = { query: null, model: "grok-4-1-fast-reasoning", maxSources: 8, allow: null, exclude: null, timeoutMs: 60000 };
  const rest = argv.slice(2);
  if (rest.length === 0) return args;
  if (rest[0] && !rest[0].startsWith("--")) {
    args.query = rest[0];
    rest.shift();
  }
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i];
    if (a === "--model") args.model = rest[++i];
    else if (a === "--maxSources") args.maxSources = Number(rest[++i]);
    else if (a === "--allow") args.allow = rest[++i];
    else if (a === "--exclude") args.exclude = rest[++i];
    else if (a === "--timeoutMs") args.timeoutMs = Number(rest[++i]);
    else return fail("Unknown argument", { arg: a });
  }
  return args;
}

function pickTextFromResponse(r) {
  const out = r?.output;
  if (Array.isArray(out)) {
    const parts = [];
    for (const item of out) {
      const content = item?.content;
      if (!Array.isArray(content)) continue;
      for (const c of content) {
        if (c?.type === "output_text" && typeof c?.text === "string") parts.push(c.text);
      }
    }
    const text = parts.join("\n").trim();
    if (text) return text;
  }
  if (typeof r?.output_text === "string") return r.output_text;
  return "";
}

async function main() {
  const args = parseArgs(process.argv);
  if (!args.query) return fail("Missing query. Usage: node xai-search.mjs \"<query>\" [--model ...] [--maxSources N]");

  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) return fail("XAI_API_KEY is not set");

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), args.timeoutMs);

  const tool = { type: "web_search" };
  if (args.allow && args.exclude) return fail("Use only one of --allow or --exclude");
  if (args.allow) tool.filters = { allowed_domains: String(args.allow).split(",").map((s) => s.trim()).filter(Boolean).slice(0, 5) };
  if (args.exclude) tool.filters = { excluded_domains: String(args.exclude).split(",").map((s) => s.trim()).filter(Boolean).slice(0, 5) };

  const body = {
    model: args.model,
    input: [{ role: "user", content: args.query }],
    tools: [tool],
  };

  let res;
  let text;
  try {
    res = await fetch("https://api.x.ai/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    text = await res.text();
  } catch (e) {
    return fail("Request failed", { message: String(e?.message || e) });
  } finally {
    clearTimeout(t);
  }

  let json;
  try {
    json = JSON.parse(text);
  } catch {
    return fail("Non-JSON response from xAI", { status: res.status, body: text.slice(0, 2000) });
  }

  if (!res.ok) {
    return fail("xAI API error", { status: res.status, error: json?.error || json });
  }

  const answerText = pickTextFromResponse(json);
  const citations = Array.isArray(json?.citations) ? json.citations.slice(0, args.maxSources) : [];

  return ok({
    model: args.model,
    text: answerText,
    citations,
    usage: json?.usage,
    id: json?.id,
  });
}

main();
