# Database Schema

## Overview

This document describes the PostgreSQL database schema for the Softball ADN application.

The schema is designed to support multiple seasons while preserving historical data with full accuracy.

## Entity Relationship Diagram

```
┌─────────────┐
│   seasons   │
└──────┬──────┘
       │
       ├──────────────────────────────────────┐
       │                                      │
┌──────┴──────┐                        ┌──────┴──────┐
│    teams    │                        │    games    │
└──────┬──────┘                        └──────┬──────┘
       │                                      │
       │                                      ├──────────────────┐
       │                                      │                  │
       │                               ┌──────┴──────┐   ┌──────┴──────┐
       │                               │batting_stats│   │pitching_stats│
       │                               └─────────────┘   └─────────────┘
       │
       │                               ┌─────────────┐
       │                               │fielding_stats│
       │                               └─────────────┘
       │
┌──────┴──────────┐
│ season_rosters  │
└──────┬──────────┘
       │
┌──────┴──────┐         ┌─────────────┐
│   players   │────────▶│  positions  │
└─────────────┘         └─────────────┘

┌─────────────┐
│   venues    │◀──────── games.venue_id
└─────────────┘
```

## Tables

### seasons

Represents a league season (e.g., "2026 Spring", "2026 Fall").

| Column      | Type           | Constraints                    | Description                      |
|-------------|----------------|--------------------------------|----------------------------------|
| id          | UUID           | PRIMARY KEY                    | Unique identifier                |
| name        | TEXT           | NOT NULL, UNIQUE               | Human-readable season name       |
| year        | INTEGER        | NOT NULL, > 0                  | Calendar year                    |
| description | TEXT           | NULLABLE                       | Optional description             |
| start_date  | DATE           | NOT NULL                       | Season start date                |
| end_date    | DATE           | NOT NULL, >= start_date        | Season end date                  |
| status      | season_status  | NOT NULL, DEFAULT 'draft'      | Season lifecycle status          |
| created_at  | TIMESTAMPTZ    | NOT NULL, DEFAULT now()        | Creation timestamp               |
| updated_at  | TIMESTAMPTZ    | NOT NULL, DEFAULT now()        | Last update timestamp            |

### teams

League teams that persist across all seasons.

| Column          | Type        | Constraints                    | Description                      |
|-----------------|-------------|--------------------------------|----------------------------------|
| id              | UUID        | PRIMARY KEY                    | Unique identifier                |
| name            | TEXT        | NOT NULL, UNIQUE               | Full team name                   |
| short_name      | TEXT        | NOT NULL, UNIQUE, <= 10 chars  | Abbreviated name                 |
| city            | TEXT        | NULLABLE                       | Team city                        |
| logo_key        | TEXT        | NULLABLE                       | Object storage key for logo      |
| primary_color   | TEXT        | NULLABLE, hex format           | Primary brand color              |
| secondary_color | TEXT        | NULLABLE, hex format           | Secondary brand color            |
| created_at      | TIMESTAMPTZ | NOT NULL, DEFAULT now()        | Creation timestamp               |
| updated_at      | TIMESTAMPTZ | NOT NULL, DEFAULT now()        | Last update timestamp            |

### positions

Reference table for defensive positions.

| Column        | Type        | Constraints                    | Description                      |
|---------------|-------------|--------------------------------|----------------------------------|
| id            | UUID        | PRIMARY KEY                    | Unique identifier                |
| code          | TEXT        | NOT NULL, UNIQUE               | Short code (P, C, 1B, SS, etc.)  |
| name          | TEXT        | NOT NULL, UNIQUE               | Full position name               |
| display_order | INTEGER     | NOT NULL, > 0                  | Order for display sorting        |
| created_at    | TIMESTAMPTZ | NOT NULL, DEFAULT now()        | Creation timestamp               |

**Seed Data:**

| Code | Name                | Order |
|------|---------------------|-------|
| P    | Lanzador            | 1     |
| C    | Receptor            | 2     |
| 1B   | Primera Base        | 3     |
| 2B   | Segunda Base        | 4     |
| 3B   | Tercera Base        | 5     |
| SS   | Campo Corto         | 6     |
| LF   | Jardinero Izquierdo | 7     |
| CF   | Jardinero Central   | 8     |
| RF   | Jardinero Derecho   | 9     |
| DH   | Bateador Designado  | 10    |
| UTIL | Utilidad            | 11    |

### players

Player information independent of any season.

| Column              | Type           | Constraints                    | Description                      |
|---------------------|----------------|--------------------------------|----------------------------------|
| id                  | UUID           | PRIMARY KEY                    | Unique identifier                |
| first_name          | TEXT           | NOT NULL                       | Player first name                |
| last_name           | TEXT           | NOT NULL                       | Player last name                 |
| nickname            | TEXT           | NULLABLE                       | Optional nickname                |
| birth_date          | DATE           | NULLABLE, < CURRENT_DATE       | Date of birth                    |
| bats                | batting_hand   | NULLABLE                       | Batting hand preference          |
| throws              | throwing_hand  | NULLABLE                       | Throwing hand preference         |
| primary_position_id | UUID           | NULLABLE, FK → positions       | Primary defensive position       |
| photo_key           | TEXT           | NULLABLE                       | Object storage key for photo     |
| created_at          | TIMESTAMPTZ    | NOT NULL, DEFAULT now()        | Creation timestamp               |
| updated_at          | TIMESTAMPTZ    | NOT NULL, DEFAULT now()        | Last update timestamp            |

### venues

Game venues that persist across all seasons.

| Column    | Type          | Constraints                    | Description                      |
|-----------|---------------|--------------------------------|----------------------------------|
| id        | UUID          | PRIMARY KEY                    | Unique identifier                |
| name      | TEXT          | NOT NULL, UNIQUE               | Venue name                       |
| city      | TEXT          | NULLABLE                       | City where venue is located      |
| address   | TEXT          | NULLABLE                       | Street address                   |
| latitude  | DECIMAL(10,8) | NULLABLE, -90 to 90            | GPS latitude coordinate          |
| longitude | DECIMAL(11,8) | NULLABLE, -180 to 180          | GPS longitude coordinate         |
| created_at| TIMESTAMPTZ   | NOT NULL, DEFAULT now()        | Creation timestamp               |
| updated_at| TIMESTAMPTZ   | NOT NULL, DEFAULT now()        | Last update timestamp            |

### season_rosters

Tracks player-team assignments for each season, supporting transfers.

| Column        | Type        | Constraints                              | Description                      |
|---------------|-------------|------------------------------------------|----------------------------------|
| id            | UUID        | PRIMARY KEY                              | Unique identifier                |
| season_id     | UUID        | NOT NULL, FK → seasons, ON DELETE RESTRICT | Season this roster entry belongs to |
| team_id       | UUID        | NOT NULL, FK → teams, ON DELETE RESTRICT   | Team the player was assigned to  |
| player_id     | UUID        | NOT NULL, FK → players, ON DELETE RESTRICT | Player in this roster            |
| jersey_number | INTEGER     | NULLABLE, 0-99                           | Jersey number worn               |
| joined_at     | TIMESTAMPTZ | NOT NULL, DEFAULT now()                  | When the player joined this team |
| left_at       | TIMESTAMPTZ | NULLABLE                                 | When the player left this team   |
| is_active     | BOOLEAN     | NOT NULL, DEFAULT true                   | Whether this entry is active     |
| created_at    | TIMESTAMPTZ | NOT NULL, DEFAULT now()                  | Creation timestamp               |
| updated_at    | TIMESTAMPTZ | NOT NULL, DEFAULT now()                  | Last update timestamp            |

**Constraints:**
- `is_active = true` requires `left_at IS NULL`
- `is_active = false` requires `left_at IS NOT NULL`
- `left_at >= joined_at` when set

**Partial Unique Index:**
- Only one active roster per player per season: `UNIQUE (season_id, player_id) WHERE is_active = true`

**Important:** This table tracks roster membership only. It is NOT used to determine which team a player's statistics belong to. Statistics store the team explicitly.

### games

Scheduled and completed games within a season.

| Column       | Type           | Constraints                              | Description                      |
|--------------|----------------|------------------------------------------|----------------------------------|
| id           | UUID           | PRIMARY KEY                              | Unique identifier                |
| season_id    | UUID           | NOT NULL, FK → seasons, ON DELETE RESTRICT | Season this game belongs to      |
| home_team_id | UUID           | NOT NULL, FK → teams, ON DELETE RESTRICT   | Home team                        |
| away_team_id | UUID           | NOT NULL, FK → teams, ON DELETE RESTRICT   | Away team                        |
| venue_id     | UUID           | NULLABLE, FK → venues, ON DELETE SET NULL  | Venue where game was played      |
| scheduled_at | TIMESTAMPTZ    | NOT NULL                                 | Scheduled date and time          |
| status       | game_status    | NOT NULL, DEFAULT 'scheduled'            | Current game status              |
| home_score   | INTEGER        | NULLABLE, >= 0                           | Final score for home team        |
| away_score   | INTEGER        | NULLABLE, >= 0                           | Final score for away team        |
| created_at   | TIMESTAMPTZ    | NOT NULL, DEFAULT now()                  | Creation timestamp               |
| updated_at   | TIMESTAMPTZ    | NOT NULL, DEFAULT now()                  | Last update timestamp            |

**Constraints:**
- home_team_id != away_team_id
- Scores are only set when status = 'completed'

### batting_stats

Batting statistics for each player per game.

| Column          | Type        | Constraints                              | Description                      |
|-----------------|-------------|------------------------------------------|----------------------------------|
| id              | UUID        | PRIMARY KEY                              | Unique identifier                |
| season_id       | UUID        | NOT NULL, FK → seasons, ON DELETE RESTRICT | Season (denormalized for performance) |
| game_id         | UUID        | NOT NULL, FK → games, ON DELETE CASCADE  | Game this stat belongs to        |
| player_id       | UUID        | NOT NULL, FK → players, ON DELETE RESTRICT | Player who generated these stats |
| team_id         | UUID        | NOT NULL, FK → teams, ON DELETE RESTRICT   | Team player was on during game   |
| at_bats         | INTEGER     | NOT NULL, DEFAULT 0, >= 0                | Official at-bats (AB)            |
| runs            | INTEGER     | NOT NULL, DEFAULT 0, >= 0                | Runs scored (R)                  |
| hits            | INTEGER     | NOT NULL, DEFAULT 0, >= 0                | Total hits (H)                   |
| doubles         | INTEGER     | NOT NULL, DEFAULT 0, >= 0                | Doubles (2B)                     |
| triples         | INTEGER     | NOT NULL, DEFAULT 0, >= 0                | Triples (3B)                     |
| home_runs       | INTEGER     | NOT NULL, DEFAULT 0, >= 0                | Home runs (HR)                   |
| rbi             | INTEGER     | NOT NULL, DEFAULT 0, >= 0                | Runs batted in (RBI)             |
| walks           | INTEGER     | NOT NULL, DEFAULT 0, >= 0                | Base on balls (BB)               |
| strikeouts      | INTEGER     | NOT NULL, DEFAULT 0, >= 0                | Strikeouts (SO)                  |
| stolen_bases    | INTEGER     | NOT NULL, DEFAULT 0, >= 0                | Stolen bases (SB)                |
| caught_stealing | INTEGER     | NOT NULL, DEFAULT 0, >= 0                | Caught stealing (CS)             |
| hit_by_pitch    | INTEGER     | NOT NULL, DEFAULT 0, >= 0                | Hit by pitch (HBP)               |
| sacrifice_flies | INTEGER     | NOT NULL, DEFAULT 0, >= 0                | Sacrifice flies (SF)             |
| created_at      | TIMESTAMPTZ | NOT NULL, DEFAULT now()                  | Creation timestamp               |
| updated_at      | TIMESTAMPTZ | NOT NULL, DEFAULT now()                  | Last update timestamp            |

**Unique Constraint:** (game_id, player_id) - One batting stat line per player per game.

### pitching_stats

Pitching statistics for each pitcher per game.

| Column            | Type          | Constraints                              | Description                      |
|-------------------|---------------|------------------------------------------|----------------------------------|
| id                | UUID          | PRIMARY KEY                              | Unique identifier                |
| season_id         | UUID          | NOT NULL, FK → seasons, ON DELETE RESTRICT | Season (denormalized for performance) |
| game_id           | UUID          | NOT NULL, FK → games, ON DELETE CASCADE  | Game this stat belongs to        |
| player_id         | UUID          | NOT NULL, FK → players, ON DELETE RESTRICT | Pitcher who generated these stats |
| team_id           | UUID          | NOT NULL, FK → teams, ON DELETE RESTRICT   | Team pitcher was on during game  |
| innings_pitched   | NUMERIC(4,1)  | NOT NULL, DEFAULT 0, >= 0                | Innings pitched (IP)             |
| hits_allowed      | INTEGER       | NOT NULL, DEFAULT 0, >= 0                | Hits allowed (H)                 |
| runs_allowed      | INTEGER       | NOT NULL, DEFAULT 0, >= 0                | Total runs allowed (R)           |
| earned_runs       | INTEGER       | NOT NULL, DEFAULT 0, >= 0, <= runs_allowed | Earned runs allowed (ER)         |
| walks             | INTEGER       | NOT NULL, DEFAULT 0, >= 0                | Base on balls allowed (BB)       |
| strikeouts        | INTEGER       | NOT NULL, DEFAULT 0, >= 0                | Strikeouts (SO)                  |
| home_runs_allowed | INTEGER       | NOT NULL, DEFAULT 0, >= 0                | Home runs allowed (HR)           |
| wild_pitches      | INTEGER       | NOT NULL, DEFAULT 0, >= 0                | Wild pitches (WP)                |
| wins              | INTEGER       | NOT NULL, DEFAULT 0, 0 or 1              | Win decision (W)                 |
| losses            | INTEGER       | NOT NULL, DEFAULT 0, 0 or 1              | Loss decision (L)                |
| saves             | INTEGER       | NOT NULL, DEFAULT 0, >= 0                | Saves (SV)                       |
| created_at        | TIMESTAMPTZ   | NOT NULL, DEFAULT now()                  | Creation timestamp               |
| updated_at        | TIMESTAMPTZ   | NOT NULL, DEFAULT now()                  | Last update timestamp            |

**Unique Constraint:** (game_id, player_id) - One pitching stat line per pitcher per game.

### fielding_stats

Fielding statistics for each player per game.

| Column       | Type        | Constraints                              | Description                      |
|--------------|-------------|------------------------------------------|----------------------------------|
| id           | UUID        | PRIMARY KEY                              | Unique identifier                |
| season_id    | UUID        | NOT NULL, FK → seasons, ON DELETE RESTRICT | Season (denormalized for performance) |
| game_id      | UUID        | NOT NULL, FK → games, ON DELETE CASCADE  | Game this stat belongs to        |
| player_id    | UUID        | NOT NULL, FK → players, ON DELETE RESTRICT | Player who generated these stats |
| team_id      | UUID        | NOT NULL, FK → teams, ON DELETE RESTRICT   | Team player was on during game   |
| putouts      | INTEGER     | NOT NULL, DEFAULT 0, >= 0                | Putouts (PO)                     |
| assists      | INTEGER     | NOT NULL, DEFAULT 0, >= 0                | Assists (A)                      |
| errors       | INTEGER     | NOT NULL, DEFAULT 0, >= 0                | Errors (E)                       |
| double_plays | INTEGER     | NOT NULL, DEFAULT 0, >= 0                | Double plays turned (DP)         |
| created_at   | TIMESTAMPTZ | NOT NULL, DEFAULT now()                  | Creation timestamp               |
| updated_at   | TIMESTAMPTZ | NOT NULL, DEFAULT now()                  | Last update timestamp            |

**Unique Constraint:** (game_id, player_id) - One fielding stat line per player per game.

## Custom Types (Enums)

### season_status

- `draft` - Season is being set up
- `active` - Season is currently in progress
- `completed` - Season has ended
- `archived` - Season is archived for historical purposes

### game_status

- `scheduled` - Game is scheduled for a future date
- `in_progress` - Game is currently being played
- `completed` - Game has finished with final scores
- `postponed` - Game has been postponed
- `cancelled` - Game has been cancelled

### batting_hand

- `left` - Bats left-handed
- `right` - Bats right-handed
- `switch` - Switch hitter

### throwing_hand

- `left` - Throws left-handed
- `right` - Throws right-handed

## Design Decisions

### No Standings Table

Standings are calculated from completed games, not stored. This ensures:
- No data duplication
- Standings are always accurate
- Historical standings remain consistent

### No League Leaders Table

League leaders are calculated from game statistics, not stored. This ensures:
- No data duplication
- Leaders are always accurate
- Historical leaders remain consistent

### Season Rosters vs Statistics

The `season_rosters` table tracks which players belonged to which teams during a season. However, **statistics store the team explicitly** and do not infer it from rosters.

This design supports:
- Players transferring between teams during a season
- Accurate historical statistics showing the correct team at game time
- Statistics before and after transfers
- Career totals across multiple teams

### Explicit Season ID in Statistics

All statistics tables include `season_id` explicitly (denormalized from games). This enables:
- Efficient season-level aggregations without joins
- Clear data lineage
- Simplified queries for season totals

### Historical Data Preservation

- Foreign keys use `ON DELETE RESTRICT` for core entities (seasons, teams, players, positions)
- Foreign keys use `ON DELETE CASCADE` for statistics (when a game is deleted, its stats are deleted)
- `venues` uses `ON DELETE SET NULL` (games remain if venue is deleted)
- Roster records are never deleted; `is_active` and `left_at` track transfers

### Player Transfers

A player can transfer between teams during a season:
1. Current roster entry is marked `is_active = false` with `left_at` set
2. New roster entry is created with `is_active = true`
3. Statistics for games before the transfer show the original team
4. Statistics for games after the transfer show the new team

### Updated At Triggers

All tables with `updated_at` columns have triggers that automatically update the timestamp on row modifications.

## Indexes

Indexes are created for common query patterns:

- Foreign key columns (season_id, team_id, player_id, game_id, venue_id)
- Status columns
- Date columns (scheduled_at, joined_at)
- Composite indexes for common filter combinations
- Partial unique index for active roster entries

See `012_create_indexes.sql` for the complete list.
