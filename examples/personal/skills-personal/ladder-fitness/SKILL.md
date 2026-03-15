---
name: ladder-fitness
description: Access Ladder fitness app to check workouts, update journal entries, view team chat, and track daily workout completion. Use when Adam wants to check his workout for the day, log journal entries, or interact with his fitness team on joinladder.com.
metadata:
  openclaw:
    requires:
      browser: openclaw
---

# Ladder Fitness Skill

This skill provides access to the Ladder fitness platform through the OpenClaw-managed browser, allowing workout tracking, journal updates, and team interaction. Uses `profile="openclaw"` (not the Chrome extension) so it works when Adam is away from his computer.

## Features

### 1. Workouts

Check daily workouts and track completion.

**URL:** https://www.joinladder.com/app

**What you can do:**
- View today's assigned workout
- See workout details (exercises, sets, reps)
- Check if workout is completed
- View workout history

### 2. Journal

Log and view fitness journal entries.

**What you can do:**
- View existing journal entries
- Add new journal entries
- Track progress notes
- Record measurements or reflections

### 3. Team Chat

Interact with fitness team/coach.

**What you can do:**
- View team messages
- Read coach updates
- Check announcements
- View team activity

## How to Use

**Browser:** Always use the browser tool with `profile="openclaw"`. Do not use `profile="chrome"` (extension relay).

### Check Today's Workout

When Adam asks:
- "What's my workout today?"
- "Have I done my workout?"
- "Show me my Ladder workout"
- "Did I complete my workout?"

**Steps:**
1. Navigate to https://www.joinladder.com/app
2. Look for today's workout card/section
3. Check completion status (done/pending)
4. Extract workout details if available

### Update Journal

When Adam asks:
- "Log a journal entry"
- "Update my fitness journal"
- "Add a note to my journal"

**Steps:**
1. Navigate to journal section
2. Click add entry
3. Enter text
4. Save entry

### Check Team Chat

When Adam asks:
- "Check my Ladder team chat"
- "Any messages from my coach?"
- "What's happening in my fitness team?"

**Steps:**
1. Navigate to team/chat section
2. Read recent messages
3. Summarize for Adam

## Output Format

Example workout check:
```
💪 Today's Workout (Ladder):

Status: ✅ Completed / ⬜ Not Done

Exercises:
• Exercise Name - 3 sets x 10 reps
• Exercise Name - 3 sets x 12 reps
...
```

Example journal update:
```
📝 Journal Entry Added:

Your entry has been logged for [date].
```

Example team chat:
```
💬 Ladder Team Updates:

• Coach message about...
• Team member posted...
• New announcement: ...
```

## Implementation Notes

- Uses **OpenClaw-managed browser** (`profile="openclaw"`), not the Chrome extension relay
- Works when Adam is away: no tab attachment required; the managed browser runs on the Gateway host
- Navigates to https://www.joinladder.com/app
- Extracts information from the Ladder web interface
- **Login:** Adam must sign in manually once in the openclaw browser (`openclaw browser start` then `openclaw browser open https://www.joinladder.com/app`). Session persists in the profile
