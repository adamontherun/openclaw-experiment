#!/usr/bin/env python3
"""
Ladder Fitness Helper
Provides utility functions for accessing Ladder fitness platform.

Note: This script is designed to work with browser automation for live data access.
"""

from typing import Dict, List, Optional

# Ladder URLs
URLS = {
    "home": "https://www.joinladder.com/app",
    "workouts": "https://www.joinladder.com/app/workouts",
    "journal": "https://www.joinladder.com/app/journal",
    "team": "https://www.joinladder.com/app/team",
    "chat": "https://www.joinladder.com/app/chat",
}


def get_urls() -> Dict[str, str]:
    """Return dictionary of Ladder URLs."""
    return URLS


def format_workout_guide() -> str:
    """Return instructions for checking workouts via browser."""
    return """
💪 To check today's workout on Ladder:

1. Navigate to: https://www.joinladder.com/app
2. Look for:
   - Today's workout card/section
   - Workout completion status (checkmark, "Done", etc.)
   - Exercise list with sets/reps
3. Extract:
   - Workout title/type
   - Completion status (done/pending)
   - List of exercises with details
   - Any notes or PRs (personal records)

Common elements to look for:
- Workout cards with date
- "Complete" or "Done" buttons/status
- Exercise names, sets, reps, weight
- Timer or duration info
"""


def format_journal_guide() -> str:
    """Return instructions for updating journal via browser."""
    return """
📝 To update journal on Ladder:

1. Navigate to: https://www.joinladder.com/app/journal
   (or find Journal section from home)
2. Click "Add Entry" or "+" button
3. Enter journal text:
   - Workout notes
   - Measurements
   - How you felt
   - Progress reflections
4. Save/submit entry
5. Confirm entry was added
"""


def format_chat_guide() -> str:
    """Return instructions for checking team chat via browser."""
    return """
💬 To check team chat on Ladder:

1. Navigate to: https://www.joinladder.com/app
2. Find Team or Chat section
3. Look for:
   - Coach messages
   - Team announcements
   - Workout reminders
   - Community posts
4. Extract recent messages (last 5-10)
5. Note sender name and timestamp
"""


def format_workout_status(completed: bool, details: Optional[str] = None) -> str:
    """Format workout status for display."""
    status = "✅ Completed" if completed else "⬜ Not Done"
    lines = [
        "💪 Today's Workout (Ladder):",
        "",
        f"Status: {status}",
    ]
    if details:
        lines.extend(["", "Details:", details])
    return "\n".join(lines)


def main():
    """CLI entry point."""
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: ladder_fitness.py <command>")
        print("Commands: urls, workout, journal, chat")
        sys.exit(1)
    
    command = sys.argv[1].lower()
    
    if command == "urls":
        urls = get_urls()
        print("🔗 Ladder URLs:\n")
        for name, url in urls.items():
            print(f"  {name}: {url}")
    
    elif command == "workout":
        print(format_workout_guide())
    
    elif command == "journal":
        print(format_journal_guide())
    
    elif command == "chat":
        print(format_chat_guide())
    
    else:
        print(f"Unknown command: {command}")
        print("Commands: urls, workout, journal, chat")
        sys.exit(1)


if __name__ == "__main__":
    main()
