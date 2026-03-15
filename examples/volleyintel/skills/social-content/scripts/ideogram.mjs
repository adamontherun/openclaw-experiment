#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const args = process.argv.slice(2);

function pick(name) {
  const idx = args.indexOf(`--${name}`);
  if (idx === -1) return null;
  return args[idx + 1] ?? null;
}

const prompt = pick("prompt");
const aspect = pick("aspect") || "1x1";
const output = pick("output");
const speed = pick("speed") || "BALANCED";
const apiKey = process.env.IDEOGRAM_API_KEY;

if (!apiKey) {
  console.error("Missing IDEOGRAM_API_KEY");
  process.exit(1);
}

if (!prompt || !output) {
  console.error("Usage: node ideogram.mjs --prompt <text> --output <path> [--aspect 1x1] [--speed BALANCED]");
  process.exit(1);
}

async function run() {
  const form = new FormData();
  form.append("prompt", prompt);
  form.append("aspect_ratio", aspect);
  form.append("rendering_speed", speed);
  form.append("num_images", "1");

  const res = await fetch("https://api.ideogram.ai/v1/ideogram-v3/generate", {
    method: "POST",
    headers: { "Api-Key": apiKey },
    body: form
  });

  const responsePayload = await res.json();
  if (!res.ok) {
    console.error(JSON.stringify(responsePayload, null, 2));
    process.exit(1);
  }

  const imageUrl = responsePayload?.data?.[0]?.url;
  if (!imageUrl) {
    console.error("No image URL in Ideogram response");
    process.exit(1);
  }

  const imageRes = await fetch(imageUrl);
  if (!imageRes.ok) {
    console.error(`Failed to download image: ${imageRes.status}`);
    process.exit(1);
  }

  const bytes = new Uint8Array(await imageRes.arrayBuffer());
  await fs.mkdir(path.dirname(output), { recursive: true });
  await fs.writeFile(output, bytes);
  console.log(JSON.stringify({ ok: true, output, imageUrl, prompt, aspect, speed }, null, 2));
}

run().catch((err) => {
  console.error(String(err));
  process.exit(1);
});
