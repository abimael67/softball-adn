# Softball League Management & Statistics Website

## Overview

This project is a modern web application for a local softball league. Its primary goal is to provide players, fans, and organizers with an easy way to follow the season through schedules, standings, player statistics, team information, and game results.

The project is intentionally lightweight, fast, and inexpensive to host. It is a community project with no commercial purpose.

The website should feel like a simplified version of Baseball Reference, focused on usability rather than overwhelming users with every possible statistic.

---

# Goals

* Display league standings.
* Display game schedules and results.
* Maintain team rosters.
* Track player statistics throughout the season.
* Display league leaders.
* Provide individual player pages.
* Provide team pages.
* Provide game box scores.
* Be mobile-first and responsive.
* Load quickly even on slow internet connections.
* Minimize infrastructure costs.
* Be easy to maintain for future seasons.

---

# Tech Stack

## Frontend

* React
* Vite
* TypeScript
* TanStack Router
* TanStack Query
* Tailwind CSS
* shadcn/ui
* Lucide Icons

## Backend

* Supabase PostgreSQL
* Supabase Auth (optional, admin only)

## Storage

Media files are **NOT** stored in Supabase.

Instead:

* Cloudflare R2
* Cloudflare CDN

Supabase only stores database records and media references.

Example:

```text
players.photo_key

↓

players/juan-perez.webp
```

The frontend builds the public media URL.

---

# Deployment

Frontend:

* Cloudflare Pages

Database:

* Supabase PostgreSQL

Media:

* Cloudflare R2

This architecture minimizes database bandwidth usage while taking advantage of Cloudflare's generous object storage and CDN.

---

# Design Principles

## Mobile First

Most users will access the website from their phones.

Every page should be designed for mobile before desktop.

---

## Performance First

The application should feel instant.

Prioritize:

* small bundle sizes
* lazy loading
* image optimization
* caching
* minimal API requests

---

## Simplicity

Avoid unnecessary abstractions.

Prefer simple, readable code over clever solutions.

---

## Type Safety

Use TypeScript everywhere.

Avoid `any`.

Create reusable types whenever possible.

---

## Reusable Components

UI components should be reusable.

Avoid duplicated layouts or repeated business logic.

---

## Accessibility

Use semantic HTML whenever possible.

Support keyboard navigation.

Provide alt text for images.

---

# Folder Structure

```text
src/
│
├── components/
├── features/
│   ├── teams/
│   ├── players/
│   ├── games/
│   ├── standings/
│   ├── leaders/
│   └── admin/
│
├── routes/
├── hooks/
├── services/
├── lib/
├── utils/
├── types/
└── assets/
```

---

# Database Philosophy

PostgreSQL is the source of truth.

Avoid storing calculated values whenever possible.

Standings, league leaders, and aggregated statistics should be calculated from game statistics instead of being manually maintained.

The database should prioritize consistency over convenience.

---

# Core Entities

* Seasons
* Teams
* Players
* Games
* Game Lineups
* Batting Stats
* Pitching Stats
* Fielding Stats

---

# Statistics

Batting statistics include:

* Games
* Plate Appearances
* At Bats
* Runs
* Hits
* Doubles
* Triples
* Home Runs
* RBIs
* Walks
* Strikeouts
* Stolen Bases
* Caught Stealing
* Batting Average
* On-base Percentage
* Slugging Percentage
* OPS

Pitching statistics include:

* Wins
* Losses
* Saves
* Innings Pitched
* Hits Allowed
* Earned Runs
* Walks
* Strikeouts
* ERA
* WHIP

Fielding statistics include:

* Putouts
* Assists
* Errors
* Double Plays
* Fielding Percentage

---

# Pages

## Home

* Current standings
* Upcoming games
* Recent results
* League leaders
* Latest news (optional)

## Teams

Each team page includes:

* Logo
* Roster
* Record
* Schedule
* Results
* Team statistics

## Players

Each player page includes:

* Photo
* Team
* Position
* Batting statistics
* Pitching statistics (if applicable)
* Season totals
* Game log

## Games

Each game page includes:

* Final score
* Line score
* Box score
* Batting statistics
* Pitching statistics

## Standings

Display:

* Wins
* Losses
* Winning Percentage
* Games Behind
* Runs For
* Runs Against

## League Leaders

Examples:

* Batting Average
* Hits
* Home Runs
* RBIs
* OPS
* ERA
* Strikeouts
* Wins
* Saves

---

# Images

Images should be optimized before upload.

Preferred formats:

* WebP
* AVIF

Avoid uploading large JPEG or PNG files.

Player photos should remain under approximately 200 KB whenever possible.

---

# Coding Standards

* Prefer composition over inheritance.
* Keep components small.
* One responsibility per component.
* Extract reusable logic into hooks.
* Avoid deeply nested components.
* Write descriptive variable names.
* Avoid magic numbers.
* Prefer early returns.
* Keep files organized.

---

# API Guidelines

Use React Query for server state.

Cache aggressively.

Invalidate queries only when necessary.

Avoid unnecessary refetching.

---

# Future Features

Possible future improvements:

* Multiple seasons
* Player career statistics
* Team history
* Awards
* MVP voting
* AI-generated game summaries
* Social media sharing
* Printable box scores
* Search
* Advanced filters

---

# Out of Scope

The following features are intentionally excluded unless requirements change:

* Online payments
* Public user accounts
* Fantasy leagues
* Chat
* Push notifications

---

# Philosophy

This project prioritizes clarity, reliability, and maintainability over unnecessary complexity.

Every feature should answer one question:

> Does this make the website more useful for players, coaches, and fans without making the system significantly harder to maintain?

If the answer is no, it probably doesn't belong in the project.

