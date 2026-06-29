-- Migration: Create custom types
-- Description: Define PostgreSQL enum types for the application

CREATE TYPE season_status AS ENUM ('draft', 'active', 'completed', 'archived');

CREATE TYPE game_status AS ENUM ('scheduled', 'in_progress', 'completed', 'postponed', 'cancelled');

CREATE TYPE batting_hand AS ENUM ('left', 'right', 'switch');

CREATE TYPE throwing_hand AS ENUM ('left', 'right');
