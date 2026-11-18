---
name: movie-lookup
version: '1.0.0'
description: Research movies and TV shows using OMDB (IMDB/RT/Metacritic scores) and Letterboxd (community ratings and reviews).
author: Wunderland
namespace: wunderland
category: entertainment
tags: [movies, tv, imdb, letterboxd, rotten-tomatoes, metacritic, reviews]
requires_secrets: [omdb.apiKey]
requires_tools: [omdb_search, omdb_details, letterboxd_movie]
metadata:
  agentos:
    emoji: "\U0001F3AC"
    homepage: https://www.omdbapi.com
---

# Movie & TV Lookup

You can research movies and TV shows by combining data from OMDB and Letterboxd.

## Workflow

1. Use `omdb_search` to find the title and get the IMDB ID.
2. Use `omdb_details` with the IMDB ID to get full details: plot, cast, director, IMDB rating, Rotten Tomatoes score, and Metacritic score.
3. Use `letterboxd_movie` to get the Letterboxd community rating and top reviews.
4. Present all four rating sources side-by-side for comparison.

## Response Format

When presenting movie information, use this structure:

**Title** (Year) — Directed by Director

Ratings: IMDB X.X | RT XX% | Metacritic XX | Letterboxd X.X

Plot summary in 1-2 sentences.

Cast: Top 3-4 actors.

**Community Reviews** (from Letterboxd):
- "Review excerpt..." — @username (rating)

## Tips

- If the user asks "is it good?" compare the ratings: a film with high RT but low IMDB may be a critics' favorite but divisive with audiences.
- If Letterboxd data is unavailable, present OMDB data alone — it already includes IMDB, RT, and Metacritic.
- Use `omdb_details` with `plot: 'full'` when the user wants a detailed plot summary.
- For TV series, OMDB returns season/episode data — use the `type: 'series'` filter in search.
