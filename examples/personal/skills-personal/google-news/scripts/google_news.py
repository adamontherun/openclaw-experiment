#!/usr/bin/env python3
"""
Google News Helper
Provides utility functions and browser automation for accessing Google News.

Note: This script is designed to work with browser automation for live data access.
"""

import urllib.parse
from typing import Dict, List, Optional

# Google News URLs
URLS = {
    "home": "https://news.google.com",
    "top_stories": "https://news.google.com/topstories",
    "search": "https://news.google.com/search",
}

def get_search_url(query: str) -> str:
    """Generate a Google News search URL for the given query."""
    encoded_query = urllib.parse.quote(query)
    return f"{URLS['search']}?q={encoded_query}"


def format_top_stories_guide() -> str:
    """Return instructions for extracting top stories via browser."""
    return """
📰 To get top stories from Google News:

1. Navigate to: https://news.google.com
2. Wait for the page to fully load (personalized feed)
3. Look for article cards with:
   - Headline (usually h3 or h4 elements)
   - Source name (e.g., "CNN", "BBC", "Reuters")
   - Time posted (e.g., "2 hours ago", "4 hours ago")
   - Snippet/description
4. Extract the top 5-10 stories
5. Format with emoji: 📰 Headline / 📰 Source • Time / snippet

Common selectors to look for:
- Article containers: [data-n-tid], article elements
- Headlines: h3, h4, or elements with headline classes
- Sources: span or div with source name
- Time: time elements or relative time text
"""


def format_search_guide(query: str) -> str:
    """Return instructions for searching news via browser."""
    search_url = get_search_url(query)
    return f"""
🔍 To search Google News for "{query}":

1. Navigate to: {search_url}
2. Wait for search results to load
3. Look for article cards with:
   - Headline
   - Source name and time
   - Snippet
   - Original source URL
4. Extract top 5-10 results
5. Format with emoji: 📰 Headline / 📰 Source • Time / snippet / 🔗 URL

Search URL: {search_url}
"""


def main():
    """CLI entry point."""
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: google_news.py <command> [args]")
        print("Commands: home, search <query>, guide")
        sys.exit(1)
    
    command = sys.argv[1].lower()
    
    if command == "home" or command == "url":
        print("Google News Home URL:")
        print(URLS['home'])
    
    elif command == "search":
        if len(sys.argv) < 3:
            print("Usage: google_news.py search <query>")
            sys.exit(1)
        query = " ".join(sys.argv[2:])
        url = get_search_url(query)
        print(f"Search URL for '{query}':")
        print(url)
    
    elif command == "guide":
        if len(sys.argv) >= 3:
            query = " ".join(sys.argv[2:])
            print(format_search_guide(query))
        else:
            print(format_top_stories_guide())
    
    else:
        print(f"Unknown command: {command}")
        print("Commands: home, search <query>, guide [query]")
        sys.exit(1)


if __name__ == "__main__":
    main()
