#!/usr/bin/env python3
"""
Volleyball TeamSnap Helper
Provides utility functions for accessing SASVBC B 12 JON team information.

Note: TeamSnap has anti-bot protection, so this script provides reference data
and URL helpers. For live data, use browser automation.
"""

from typing import Dict, List, Optional

TEAM_ID = "10160681"
BASE_URL = f"https://go.teamsnap.com/{TEAM_ID}"

# Team information
TEAM_INFO = {
    "name": "SASVBC B 12 JON",
    "organization": "SASVBC (Spike and Serve Volleyball Club)",
    "level": "U12 Boys",
    "season": "2025-2026",
    "team_id": TEAM_ID,
    "coach": "Jon",
}

# URLs for different sections
URLS = {
    "home": f"{BASE_URL}/home",
    "schedule": f"{BASE_URL}/schedule",
    "roster": f"{BASE_URL}/roster",
    "roster_list": f"{BASE_URL}/roster/list",
    "availability": f"{BASE_URL}/availability",
}

# Known roster information (players and parents)
ROSTER = {
    "136878359": {
        "name": "Alex Bow-Smith",
        "number": "#7",
        "profile_url": f"{BASE_URL}/roster/player/136878359",
        "parents": [
            {
                "name": "Adam Smith",
                "email": "adaminhonolulu+alex@gmail.com",
                "role": "Father",
            },
            {
                "name": "Heather Smith",
                "role": "Mother",
            }
        ],
    },
    "liam_lawson": {
        "name": "Liam Lawson",
        "number": None,
        "profile_url": None,
        "parents": [
            {
                "name": "Unknown",
                "role": "Parent/Guardian",
            }
        ],
        "note": "Player ID to be determined from roster page",
    }
}

# Sample schedule data (from observation - update via browser as needed)
SAMPLE_EVENTS = [
    {
        "date": "Saturday, February 14th",
        "time": "11:30 AM–1:30 PM",
        "title": "Practice - B12 Jon",
        "location": "SAS Gym",
        "notes": "arrive 15 minutes early",
        "type": "practice",
    },
    {
        "date": "Friday, November 14",
        "time": "4:00 PM",
        "title": "vs. SASVBC B 12 BRIANA",
        "location": None,
        "notes": None,
        "type": "game",
    }
]


def get_team_info() -> Dict:
    """Return basic team information."""
    return TEAM_INFO


def get_urls() -> Dict[str, str]:
    """Return dictionary of TeamSnap URLs."""
    return URLS


def get_roster() -> Dict[str, Dict]:
    """Return known roster information including players and parents."""
    return ROSTER


def get_player_info(player_id: str) -> Optional[Dict]:
    """Get detailed info for a specific player."""
    return ROSTER.get(player_id)


def get_parents_for_player(player_id: str) -> List[Dict]:
    """Get parent/guardian information for a player."""
    player = ROSTER.get(player_id)
    if player:
        return player.get("parents", [])
    return []


def get_sample_events() -> List[Dict]:
    """Return sample events for reference."""
    return SAMPLE_EVENTS


def format_event(event: Dict) -> str:
    """Format an event for display."""
    lines = []
    
    if "date" in event:
        lines.append(f"📅 {event['date']}")
    if "time" in event:
        lines.append(f"⏰ {event['time']}")
    if "title" in event:
        lines.append(f"🏐 {event['title']}")
    if "location" in event and event['location']:
        lines.append(f"📍 {event['location']}")
    if "notes" in event and event['notes']:
        lines.append(f"📝 {event['notes']}")
    
    return "\n".join(lines)


def format_player_info(player_id: str) -> Optional[str]:
    """Format player and parent information for display."""
    player = ROSTER.get(player_id)
    if not player:
        return None
    
    lines = [
        f"👤 {player['name']}",
    ]
    
    if player.get('number'):
        lines.append(f"🔢 Number: {player['number']}")
    
    if player.get('profile_url'):
        lines.append(f"🔗 Profile: {player['profile_url']}")
    
    parents = player.get('parents', [])
    if parents:
        lines.append("\n👪 Parents/Guardians:")
        for parent in parents:
            parent_info = f"  • {parent['name']} ({parent['role']})"
            if parent.get('email'):
                parent_info += f"\n    📧 {parent['email']}"
            lines.append(parent_info)
    
    if player.get('note'):
        lines.append(f"\n📝 Note: {player['note']}")
    
    return "\n".join(lines)


def format_roster_summary() -> str:
    """Format a summary of all known roster players."""
    lines = ["👥 Team Roster:\n"]
    
    for player_id, player in ROSTER.items():
        number = player.get('number', '')
        name = player['name']
        lines.append(f"  {name} {number}")
        
        parents = player.get('parents', [])
        if parents:
            parent_names = [p['name'] for p in parents if p['name'] != 'Unknown']
            if parent_names:
                lines.append(f"    Parents: {', '.join(parent_names)}")
        lines.append("")
    
    return "\n".join(lines)


def get_next_event() -> Optional[Dict]:
    """Return the next upcoming event (from cached sample data)."""
    # In practice, this would be fetched live via browser
    # For now, return the known next event
    return SAMPLE_EVENTS[0] if SAMPLE_EVENTS else None


def main():
    """CLI entry point for quick lookups."""
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: volleyball_teamsnap.py <command>")
        print("Commands: info, urls, roster, player <id>, next")
        sys.exit(1)
    
    command = sys.argv[1].lower()
    
    if command == "info":
        info = get_team_info()
        print("🏐 Team Information:\n")
        for key, value in info.items():
            print(f"  {key}: {value}")
    
    elif command == "urls":
        urls = get_urls()
        print("🔗 TeamSnap URLs:\n")
        for name, url in urls.items():
            print(f"  {name}: {url}")
    
    elif command == "roster":
        print(format_roster_summary())
    
    elif command == "player":
        if len(sys.argv) < 3:
            print("Usage: volleyball_teamsnap.py player <player_id>")
            print(f"Known player IDs: {', '.join(ROSTER.keys())}")
            sys.exit(1)
        
        player_id = sys.argv[2]
        info = format_player_info(player_id)
        if info:
            print(info)
        else:
            print(f"Player '{player_id}' not found.")
            print(f"Known player IDs: {', '.join(ROSTER.keys())}")
            sys.exit(1)
    
    elif command == "next":
        event = get_next_event()
        if event:
            print("🏐 Next Event:\n")
            print(format_event(event))
        else:
            print("No upcoming events found.")
    
    else:
        print(f"Unknown command: {command}")
        print("Commands: info, urls, roster, player <id>, next")
        sys.exit(1)


if __name__ == "__main__":
    main()
