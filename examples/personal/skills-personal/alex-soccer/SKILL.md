---
name: alex-soccer
description: Check Alex's soccer schedule. Use when Adam asks about Alex's soccer games, such as "When is the next game?", "What field is the game on?", "What time is the game?", "Is there a game on [date]?", or "Tell me about the next game." Provides game date, time, field, opponent, and score information for Inter Ohana CF - 14B Blanco (Alex's team) in the Oahu League Spring 2025/26 season.
---

# Alex Soccer Schedule Checker

This skill provides quick access to Alex's soccer game schedule. The team is **Inter Ohana CF - 14B Blanco** playing in the Oahu League Spring 2025/26 season.

## Available Commands

The script supports three main queries:

### 1. Next Game

```bash
python3 scripts/alex_soccer.py next
```

Shows the next upcoming game with all details (date, time, field, opponent).

### 2. Games on a Specific Date

```bash
python3 scripts/alex_soccer.py on MM/DD/YYYY
python3 scripts/alex_soccer.py on today
python3 scripts/alex_soccer.py on tomorrow
```

Checks if there's a game on a specific date.

### 3. Full Schedule

```bash
python3 scripts/alex_soccer.py list
```

Shows all upcoming games and a summary of past games with scores.

## How to Respond to User Queries

When Adam asks about soccer:

1. **"When is the next game?"** → Run `next` command
2. **"What time is the game?"** → Run `next` command, extract time
3. **"What field is the game on?"** → Run `next` command, extract field
4. **"Is there a game on [date]?"** → Run `on <date>` command
5. **"Tell me about the next game"** → Run `next` command, provide full details

## Output Format

The script returns formatted game info:

- 📅 Date: Day, Month DD, YYYY
- ⏰ Time: HH:MM AM/PM
- 🏟️ Field: [Field Code] at Oahu League Fields
- ⚽ Opponent: [Team Name] (Home/Away)

## Team Info

- **Team**: Inter Ohana CF - 14B Blanco
- **Team Code**: P21
- **League**: Oahu League Spring 2025/26
- **Venue**: Oahu League Fields
