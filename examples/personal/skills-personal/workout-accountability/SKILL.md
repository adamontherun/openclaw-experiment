---
name: workout-accountability
description: Dynamic daily workout accountability messaging for Adam with morning motivation and afternoon context-aware check-ins. Uses ladder-fitness when needed and avoids duplicate nagging when other workouts are already planned or done.
---

# Workout Accountability Skill

Use this skill for Adam's daily workout accountability messages to Telegram group `telegram:-5277817028`.

## Inputs

The caller should specify one mode:

- `morning-motivation`
- `afternoon-accountability`

If mode is missing, infer from local HST time:

- Before 12:00 HST -> `morning-motivation`
- 12:00 HST or later -> `afternoon-accountability`

## Global Messaging Rules

- Send at most one Telegram message.
- Keep to 3-4 short lines.
- Use 1-2 emojis.
- Keep tone direct, funny, and human.
- Never repeat yesterday's exact structure or voice.
- Avoid generic filler lines.

## Variation System

Before writing, pick one daily persona and one day theme.

Personas:

- Coach film-room analyst
- Trash-talking gym friend
- Calm high-performance mentor
- Competitive sports commentator
- Tough-love parent energy
- Dry deadpan comedian

Day themes:

- Monday: reset and momentum
- Tuesday: consistency and discipline
- Wednesday: midweek grit
- Thursday: finish setup
- Friday: close strong
- Saturday: athletic movement and fun
- Sunday: recovery discipline or light effort

Blend persona + theme + today's real context in each message.

## Mode: morning-motivation

1. Use `ladder-fitness` to check today's Ladder workout details on `https://www.joinladder.com/app`.
2. Build a message that references the actual workout or at least today's completion state.
3. If workout details cannot be retrieved, send motivation without fabricating details.
4. Send one concise motivational message to `telegram:-5277817028`.

Morning tone target:

- More energizing than nagging
- Strong opening line
- One concrete action cue for this morning

## Mode: afternoon-accountability

Use HST day boundaries.

Step 1: read the workout Telegram group conversation for today's context.

The workout Telegram group has its own session file, separate from the main session.
Read the last 30 lines of the session file to find today's messages from Adam:

- `tail -30 /Users/adamsmith/.openclaw/agents/main/sessions/01b1fb4f-69ed-459f-9a10-3a65b6f67405.jsonl`

If that file does not exist, try looking up the current path:

- `grep -A2 '"agent:main:telegram:group:-5277817028"' /Users/adamsmith/.openclaw/agents/main/sessions/sessions.json | grep sessionFile`

Parse the JSONL output for `"role":"user"` entries with today's date.
Look for skip signals in those messages:

- illness: sick, not feeling well, under the weather, injured, recovery day, not working out today, resting, taking it easy
- alternative workout: volleyball, beach volleyball, practice, lifting session, run, bike, hike, surf, basketball, conditioning, training, gym (outside Ladder)
- explicit rest: rest day, off day, taking the day off

Step 2: decide whether Ladder nagging should be skipped.

- If conversation indicates he already trained, has volleyball, has another clear workout commitment today, or explicitly cannot train due to illness/recovery:
  - Do not nag about missing Ladder.
  - If he is sick, not feeling well, injured, or clearly taking a recovery day, skip sending any message.
  - If he is covered by another planned/done workout and not sick, send either:
    - a short supportive acknowledgment message, or
    - no message if the context already confirms he is covered and no reminder adds value.

Step 3: if not covered by context, run Ladder check.

- Use `ladder-fitness` to check completion at `https://www.joinladder.com/app`.

Step 4: message behavior.

- If Ladder is complete: send a short specific win message.
- If not complete: send a short accountability push with 4 PM urgency and one concrete next step.
- Send to `telegram:-5277817028`.

## Safety and Accuracy

- Never claim workout completion unless Ladder or conversation confirms it.
- Never claim a specific alternative workout unless conversation confirms it.
- If uncertain, choose neutral accountability phrasing over made-up specifics.
