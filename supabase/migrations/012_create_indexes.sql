-- Migration: Create indexes
-- Description: Performance indexes for common queries

-- Seasons indexes
CREATE INDEX idx_seasons_status ON seasons(status);
CREATE INDEX idx_seasons_year ON seasons(year);

-- Teams indexes
CREATE INDEX idx_teams_name ON teams(name);

-- Positions indexes
CREATE INDEX idx_positions_display_order ON positions(display_order);

-- Players indexes
CREATE INDEX idx_players_last_name ON players(last_name);
CREATE INDEX idx_players_first_name ON players(first_name);
CREATE INDEX idx_players_primary_position_id ON players(primary_position_id);

-- Venues indexes
CREATE INDEX idx_venues_name ON venues(name);
CREATE INDEX idx_venues_city ON venues(city);

-- Season rosters indexes
CREATE INDEX idx_season_rosters_season_id ON season_rosters(season_id);
CREATE INDEX idx_season_rosters_team_id ON season_rosters(team_id);
CREATE INDEX idx_season_rosters_player_id ON season_rosters(player_id);
CREATE INDEX idx_season_rosters_is_active ON season_rosters(is_active);
CREATE INDEX idx_season_rosters_season_team ON season_rosters(season_id, team_id);
CREATE INDEX idx_season_rosters_season_player ON season_rosters(season_id, player_id);
CREATE INDEX idx_season_rosters_player_team ON season_rosters(player_id, team_id);

-- Games indexes
CREATE INDEX idx_games_season_id ON games(season_id);
CREATE INDEX idx_games_home_team_id ON games(home_team_id);
CREATE INDEX idx_games_away_team_id ON games(away_team_id);
CREATE INDEX idx_games_venue_id ON games(venue_id);
CREATE INDEX idx_games_scheduled_at ON games(scheduled_at);
CREATE INDEX idx_games_status ON games(status);
CREATE INDEX idx_games_season_status ON games(season_id, status);
CREATE INDEX idx_games_season_scheduled ON games(season_id, scheduled_at);
CREATE INDEX idx_games_team_season ON games(season_id, home_team_id);
CREATE INDEX idx_games_away_team_season ON games(season_id, away_team_id);

-- Batting stats indexes
CREATE INDEX idx_batting_stats_season_id ON batting_stats(season_id);
CREATE INDEX idx_batting_stats_game_id ON batting_stats(game_id);
CREATE INDEX idx_batting_stats_player_id ON batting_stats(player_id);
CREATE INDEX idx_batting_stats_team_id ON batting_stats(team_id);
CREATE INDEX idx_batting_stats_game_player ON batting_stats(game_id, player_id);
CREATE INDEX idx_batting_stats_player_game ON batting_stats(player_id, game_id);
CREATE INDEX idx_batting_stats_season_player ON batting_stats(season_id, player_id);
CREATE INDEX idx_batting_stats_season_team ON batting_stats(season_id, team_id);

-- Pitching stats indexes
CREATE INDEX idx_pitching_stats_season_id ON pitching_stats(season_id);
CREATE INDEX idx_pitching_stats_game_id ON pitching_stats(game_id);
CREATE INDEX idx_pitching_stats_player_id ON pitching_stats(player_id);
CREATE INDEX idx_pitching_stats_team_id ON pitching_stats(team_id);
CREATE INDEX idx_pitching_stats_game_player ON pitching_stats(game_id, player_id);
CREATE INDEX idx_pitching_stats_player_game ON pitching_stats(player_id, game_id);
CREATE INDEX idx_pitching_stats_season_player ON pitching_stats(season_id, player_id);
CREATE INDEX idx_pitching_stats_season_team ON pitching_stats(season_id, team_id);

-- Fielding stats indexes
CREATE INDEX idx_fielding_stats_season_id ON fielding_stats(season_id);
CREATE INDEX idx_fielding_stats_game_id ON fielding_stats(game_id);
CREATE INDEX idx_fielding_stats_player_id ON fielding_stats(player_id);
CREATE INDEX idx_fielding_stats_team_id ON fielding_stats(team_id);
CREATE INDEX idx_fielding_stats_game_player ON fielding_stats(game_id, player_id);
CREATE INDEX idx_fielding_stats_player_game ON fielding_stats(player_id, game_id);
CREATE INDEX idx_fielding_stats_season_player ON fielding_stats(season_id, player_id);
CREATE INDEX idx_fielding_stats_season_team ON fielding_stats(season_id, team_id);
