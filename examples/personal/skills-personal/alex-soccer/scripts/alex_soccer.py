#!/usr/bin/env python3
"""
Alex Soccer Schedule Checker
Fetches and parses Alex's soccer schedule from SportsAffinity.
"""

import sys
import urllib.request
import urllib.error
import re
from datetime import datetime, timedelta
from typing import List, Dict, Optional

# Schedule URL for Inter Ohana CF - 14B Blanco (Alex's team)
SCHEDULE_URL = "https://ol-spring-25-26.sportsaffinity.com/tour/public/info/schedule_results2.asp?sessionguid=94D44303-F331-4505-92B2-813593B3FC50&tournamentguid=94D44303-F331-4505-92B2-813593B3FC50&flightguid=CC38311E-E439-4EED-8E83-CE70BC2D30D6&tourappguid=DA453BDE-88CF-4409-9ECB-F905A744DD0F&teamname=Inter%20Ohana%20CF%20-%2014B%20Blanco&teamcode=01OL-98CB12-1242&groupcode=P2"

# Team name constant
TEAM_NAME = "Inter Ohana CF - 14B Blanco"
TEAM_CODE = "P21"


def fetch_schedule() -> str:
    """Fetch the raw HTML from the schedule page."""
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    }
    req = urllib.request.Request(SCHEDULE_URL, headers=headers)
    with urllib.request.urlopen(req, timeout=30) as response:
        return response.read().decode('utf-8')


def parse_date(date_str: str, year_hint: int = 2026) -> Optional[datetime]:
    """Parse date like 'Saturday, January 10, 2026' to datetime."""
    try:
        # Clean up the string
        date_str = re.sub(r'\s+', ' ', date_str.strip())
        # Remove day of week and parse
        date_str = re.sub(r'^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),\s*', '', date_str)
        return datetime.strptime(date_str.strip(), "%B %d, %Y")
    except ValueError:
        return None


def extract_text_from_html(html: str) -> str:
    """Extract text content from HTML, removing tags."""
    # Replace common tags with spaces
    text = re.sub(r'<br\s*/?>', ' ', html, flags=re.IGNORECASE)
    text = re.sub(r'<[^>]+>', ' ', text)
    # Clean up whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    return text


def parse_games(html: str) -> List[Dict]:
    """Parse the HTML to extract game schedule."""
    games = []
    
    # Clean up HTML entities
    clean_html = html.replace('&nbsp;', ' ').replace('\r\n', '\n').replace('\r', '\n')
    
    # Find all date sections
    date_pattern = r'Bracket\s+-\s+([^<\n]+)'
    date_matches = list(re.finditer(date_pattern, clean_html))
    
    for i, date_match in enumerate(date_matches):
        date_str = date_match.group(1).strip()
        date_str = re.sub(r'\s+', ' ', date_str)
        game_date = parse_date(date_str)
        if not game_date:
            continue
        
        # Get section HTML
        start_pos = date_match.end()
        if i + 1 < len(date_matches):
            end_pos = date_matches[i + 1].start()
        else:
            end_pos = len(clean_html)
        section = clean_html[start_pos:end_pos]
        
        # Find all table rows in this section
        # Look for <tr> ... </tr> patterns
        row_pattern = r'<tr[^>]*>(.*?)</tr>'
        rows = re.findall(row_pattern, section, re.DOTALL | re.IGNORECASE)
        
        for row in rows:
            # Extract all table cells from this row
            cell_pattern = r'<td[^>]*>(.*?)</td>'
            cells = re.findall(cell_pattern, row, re.DOTALL | re.IGNORECASE)
            
            if len(cells) < 10:
                continue
            
            # Parse cells
            game_id = extract_text_from_html(cells[0])
            venue = extract_text_from_html(cells[1])
            time_str = extract_text_from_html(cells[2])
            field = extract_text_from_html(cells[3])
            group = extract_text_from_html(cells[4])
            home_team = extract_text_from_html(cells[5])
            home_score = extract_text_from_html(cells[6])
            away_team = extract_text_from_html(cells[8])
            away_score = extract_text_from_html(cells[9])
            
            # Validate game_id is numeric
            if not re.match(r'^\d+$', game_id):
                continue
            
            # Check if our team is playing
            is_home = TEAM_NAME in home_team or (TEAM_CODE in group and group.index(TEAM_CODE) < len(group)//2) if TEAM_CODE in group else TEAM_NAME in home_team
            is_away = TEAM_NAME in away_team or (TEAM_CODE in group and group.index(TEAM_CODE) > len(group)//2) if TEAM_CODE in group else TEAM_NAME in away_team
            
            if ' vs ' in group or ' VS ' in group:
                parts = re.split(r'\s+vs\.?\s+', group, flags=re.IGNORECASE)
                if len(parts) == 2:
                    is_home = is_home or TEAM_CODE in parts[0]
                    is_away = is_away or TEAM_CODE in parts[1]
            
            if not (is_home or is_away):
                continue
            
            # Parse time
            try:
                time_obj = datetime.strptime(time_str.strip(), "%I:%M %p")
                game_datetime = game_date.replace(hour=time_obj.hour, minute=time_obj.minute)
            except:
                game_datetime = game_date
            
            # Determine opponent and location
            if is_home:
                opponent = away_team
                our_score = home_score
                their_score = away_score
                location_type = "Home"
            else:
                opponent = home_team
                our_score = away_score
                their_score = home_score
                location_type = "Away"
            
            game = {
                'game_id': game_id,
                'date': game_date,
                'datetime': game_datetime,
                'time': time_str,
                'venue': venue,
                'field': field,
                'opponent': opponent,
                'location_type': location_type,
                'home_team': home_team,
                'away_team': away_team,
                'our_score': our_score if our_score else None,
                'their_score': their_score if their_score else None,
            }
            games.append(game)
    
    # Sort by date
    games.sort(key=lambda x: x['datetime'])
    return games


def get_next_game(games: List[Dict], from_date: datetime = None) -> Optional[Dict]:
    """Get the next upcoming game."""
    if from_date is None:
        from_date = datetime.now()
    
    for game in games:
        if game['datetime'] >= from_date:
            return game
    return None


def get_games_on_date(games: List[Dict], target_date: datetime) -> List[Dict]:
    """Get all games on a specific date."""
    return [g for g in games if g['date'].date() == target_date.date()]


def format_game(game: Dict, include_date: bool = True) -> str:
    """Format a game for display."""
    lines = []
    
    if include_date:
        date_str = game['date'].strftime("%A, %B %d, %Y")
        lines.append(f"📅 Date: {date_str}")
    
    lines.append(f"⏰ Time: {game['time']}")
    lines.append(f"🏟️ Field: {game['field']} at {game['venue']}")
    lines.append(f"⚽ Opponent: {game['opponent']} ({game['location_type']})")
    
    if game['our_score'] and game['their_score']:
        lines.append(f"📊 Score: {game['our_score']} - {game['their_score']}")
    
    return "\n".join(lines)


def main():
    """Main entry point for CLI usage."""
    if len(sys.argv) < 2:
        print("Usage: alex_soccer.py <command> [args]")
        print("Commands: next, on <date>, list")
        sys.exit(1)
    
    command = sys.argv[1].lower()
    
    try:
        html = fetch_schedule()
        games = parse_games(html)
    except Exception as e:
        print(f"Error fetching schedule: {e}")
        sys.exit(1)
    
    if command == "next":
        game = get_next_game(games)
        if game:
            print("🥅 Next Game:\n")
            print(format_game(game))
        else:
            print("No upcoming games found.")
    
    elif command == "on":
        if len(sys.argv) < 3:
            print("Usage: alex_soccer.py on <date>")
            print("Date format: MM/DD/YYYY or 'today' or 'tomorrow'")
            sys.exit(1)
        
        date_arg = sys.argv[2].lower()
        
        if date_arg == "today":
            target_date = datetime.now()
        elif date_arg == "tomorrow":
            target_date = datetime.now() + timedelta(days=1)
        else:
            try:
                target_date = datetime.strptime(date_arg, "%m/%d/%Y")
            except ValueError:
                try:
                    target_date = datetime.strptime(date_arg, "%Y-%m-%d")
                except ValueError:
                    print(f"Unable to parse date: {date_arg}")
                    print("Try formats: MM/DD/YYYY, YYYY-MM-DD, 'today', or 'tomorrow'")
                    sys.exit(1)
        
        day_games = get_games_on_date(games, target_date)
        
        if day_games:
            date_str = target_date.strftime("%A, %B %d, %Y")
            print(f"🥅 Games on {date_str}:\n")
            for i, game in enumerate(day_games, 1):
                if i > 1:
                    print("\n---\n")
                print(format_game(game, include_date=False))
        else:
            date_str = target_date.strftime("%A, %B %d, %Y")
            print(f"No games scheduled for {date_str}.")
    
    elif command == "list":
        print(f"🥅 Full Schedule for {TEAM_NAME}:\n")
        
        now = datetime.now()
        upcoming = [g for g in games if g['datetime'] >= now]
        past = [g for g in games if g['datetime'] < now]
        
        if upcoming:
            print("--- Upcoming Games ---\n")
            for game in upcoming:
                print(format_game(game))
                print("\n")
        
        if past:
            print("--- Past Games ---\n")
            for game in reversed(past):
                status = ""
                if game['our_score'] and game['their_score']:
                    try:
                        our = int(game['our_score'])
                        their = int(game['their_score'])
                        if our > their:
                            status = " (W)"
                        elif our < their:
                            status = " (L)"
                        else:
                            status = " (T)"
                    except:
                        pass
                print(f"{game['date'].strftime('%b %d')}: vs {game['opponent']}{status}")
    
    else:
        print(f"Unknown command: {command}")
        print("Commands: next, on <date>, list")
        sys.exit(1)


if __name__ == "__main__":
    main()
