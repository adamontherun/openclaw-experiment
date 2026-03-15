---
name: volleyball-teamsnap
description: Access volleyball team information via TeamSnap for SASVBC B 12 JON (Alex and Liam's team). Use when Adam asks about volleyball schedule, practice times, game times, or roster information including player and parent details.
metadata:
  openclaw:
    requires:
      browser: openclaw
---

# Volleyball TeamSnap Skill

This skill provides access to the volleyball team information for **SASVBC B 12 JON** (Spike and Serve Volleyball Club, Boys 12, coached by Jon). This is Alex and Liam's team for the 2025-2026 season. Uses `profile="openclaw"` (not the Chrome extension) so it works when Adam is away from his computer.

## Team Information

- **Team Name:** SASVBC B 12 JON
- **Organization:** SASVBC (Spike and Serve Volleyball Club)
- **Level:** U12 Boys
- **Season:** 2025-2026
- **Team ID:** 10160681
- **Coach:** Jon
- **Home URL:** https://go.teamsnap.com/10160681/home

## Available Features

### 1. Schedule (Practice & Games)

**URLs:**

- Main Schedule: https://go.teamsnap.com/10160681/schedule
- Event Details: https://go.teamsnap.com/10160681/schedule/view_event/{event_id}
- Game Details: https://go.teamsnap.com/10160681/schedule/view_game/{game_id}

**What you can query:**

- Next practice/game
- Schedule for a specific date
- Full season calendar
- Event locations

**Example events observed:**

- **Next:** Saturday, February 14th, 11:30 AM–1:30 PM - Practice - B12 Jon at SAS Gym (arrive 15 minutes early)
- **Last Game:** vs. SASVBC B 12 BRIANA on Friday, November 14 at 4:00 PM

### 2. Roster (Players & Parents)

**URLs:**

- Roster List: https://go.teamsnap.com/10160681/roster
- Roster List (alternate): https://go.teamsnap.com/10160681/roster/list
- Player Profile: https://go.teamsnap.com/10160681/roster/player/{player_id}

**Roster Information Available:**

- Player names and jersey numbers
- Parent/guardian contact information
- Profile photos
- Player details (position, etc.)

**Known Roster:**

- **Alex Bow-Smith** (#7) - Player ID: 136878359
- **Liam Lawson** - (on team)

**How to access roster:**

1. Navigate to roster page via browser
2. List shows all players with photos and numbers
3. Click individual player for parent contact info

## How to Use This Skill

**Browser:** Always use the browser tool with `profile="openclaw"`. Do not use `profile="chrome"` (extension relay).

### Querying Schedule

When Adam asks about volleyball schedule:

1. **"When is the next volleyball practice?"**
   - Navigate to home page via browser
   - Look for "next event" section
   - Extract date, time, location, and arrival note

2. **"What time is the game on [date]?"**
   - Navigate to schedule page
   - Check the calendar view for that date
   - Look for game events

3. **"Where is practice?"**
   - Click "view location" on the event
   - Example: "SAS Gym"

### Checking Roster

When Adam asks about the team roster:

1. **"Who's on the volleyball team?"**
   - Navigate to roster page: https://go.teamsnap.com/10160681/roster
   - List all players and their numbers

2. **"Who are the parents on Alex's volleyball team?"**
   - Navigate to roster page
   - Click on Alex's profile or view roster list
   - Extract parent/guardian names and contact info

3. **"What's the contact info for [player]'s parents?"**
   - Find player on roster
   - Click player name for detailed profile
   - Extract parent contact information

## Navigation Structure

TeamSnap left sidebar:

- ⌂ home - Shows next event, last game, player profile
- 👥 roster - Team members list with photos and parent info
- 📅 schedule - Full calendar view
- ⮺ availability - Player availability tracking
- ⮻ tracking - Team tracking features
- ⯮ statistics - Team stats
- ⵐ assignments - Team assignments
- 📷 Media - Photos and files
- ⚙ preferences - Settings

## Implementation Notes

**Current Approach:**

- Uses **OpenClaw-managed browser** (`profile="openclaw"`), not the Chrome extension relay
- Works when Adam is away: no tab attachment required; the managed browser runs on the Gateway host
- Navigate to relevant page, extract information, present to Adam
- **Login:** Adam must sign in manually once in the openclaw browser (`openclaw browser start` then `openclaw browser open https://go.teamsnap.com/10160681/home`). Session persists in the profile

**TeamSnap URLs:**

- Home: https://go.teamsnap.com/10160681/home
- Schedule: https://go.teamsnap.com/10160681/schedule
- Roster: https://go.teamsnap.com/10160681/roster
- Roster List: https://go.teamsnap.com/10160681/roster/list

**Note on Messages:**
TeamSnap messages/chat functionality is primarily available through the mobile app, not the web interface. This skill focuses on schedule and roster information which is accessible via web browser.
