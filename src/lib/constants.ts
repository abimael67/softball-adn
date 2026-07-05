export const ROUTES = {
  HOME: "/",
  TEAMS: "/teams",
  TEAM_DETAILS: "/teams/$teamId",
  PLAYERS: "/players",
  PLAYER_DETAILS: "/players/$playerId",
  SCHEDULE: "/schedule",
  GAME_DETAILS: "/schedule/$gameId",
  STANDINGS: "/standings",
  LEADERS: "/leaders",
  ABOUT: "/about",
  ADMIN: "/admin",
  ADMIN_SEASONS: "/admin/seasons",
  ADMIN_VENUES: "/admin/venues",
  ADMIN_TEAMS: "/admin/teams",
  ADMIN_PLAYERS: "/admin/players",
  ADMIN_ROSTERS: "/admin/rosters",
  ADMIN_SCHEDULE: "/admin/schedule",
} as const;

export const SEASON_PARAM = "seasonId" as const;

export const QUERY_KEYS = {
  seasons: ["seasons"] as const,
  season: (seasonId: string) => ["season", seasonId] as const,
  latestSeason: ["latest-season"] as const,
  teams: (seasonId: string) => ["teams", seasonId] as const,
  team: (teamId: string) => ["team", teamId] as const,
  positions: ["positions"] as const,
  players: (seasonId: string) => ["players", seasonId] as const,
  playersPaginated: (page: number, search?: string) => ["players", "page", page, search] as const,
  player: (playerId: string) => ["player", playerId] as const,
  venues: ["venues"] as const,
  rosters: (seasonId: string, teamId: string) => ["rosters", seasonId, teamId] as const,
  games: (seasonId: string) => ["games", seasonId] as const,
  game: (gameId: string) => ["game", gameId] as const,
  teamRecentGames: (teamId: string, seasonId: string) => ["games", "team", teamId, "recent", seasonId] as const,
  standings: (seasonId: string) => ["standings", seasonId] as const,
  leaders: (seasonId: string) => ["leaders", seasonId] as const,
  battingStats: (gameId: string) => ["batting-stats", gameId] as const,
  pitchingStats: (gameId: string) => ["pitching-stats", gameId] as const,
  fieldingStats: (gameId: string) => ["fielding-stats", gameId] as const,
  playerSeasonBatting: (playerId: string, seasonId: string) => ["batting-stats", playerId, seasonId] as const,
  playerSeasonPitching: (playerId: string, seasonId: string) => ["pitching-stats", playerId, seasonId] as const,
  playerSeasonFielding: (playerId: string, seasonId: string) => ["fielding-stats", playerId, seasonId] as const,
} as const;

export const POSITION_CODES = [
  "P",
  "C",
  "1B",
  "2B",
  "3B",
  "SS",
  "LF",
  "CF",
  "RF",
  "DH",
  "UTIL",
] as const;

export type PositionCode = (typeof POSITION_CODES)[number];

export const GAME_STATUS_CONTRIBUTES_TO_STATS = ["completed"] as const;

export const STANDINGS_SORT_CRITERIA = {
  primary: "winningPercentage",
  secondary: "runDifferential",
} as const;

export const LEADERBOARD_CATEGORIES = {
  batting: [
    "batting_average",
    "home_runs",
    "rbi",
    "runs",
    "hits",
    "stolen_bases",
    "on_base_percentage",
    "slugging_percentage",
    "ops",
  ],
  pitching: ["wins", "strikeouts_pitching", "era", "whip", "saves"],
} as const;

export const STAT_CALCULATION_INSTRUCTIONS = {
  battingAverage: {
    formula: "H / AB",
    description: "Hits divided by at-bats",
    minimumAB: 0,
  },
  onBasePercentage: {
    formula: "(H + BB + HBP) / (AB + BB + HBP + SF)",
    description: "Times on base divided by plate appearances",
    minimumPA: 0,
  },
  sluggingPercentage: {
    formula: "TB / AB",
    description: "Total bases divided by at-bats",
    minimumAB: 0,
  },
  ops: {
    formula: "OBP + SLG",
    description: "On-base percentage plus slugging percentage",
    minimumPA: 0,
  },
  era: {
    formula: "(ER × 7) / IP",
    description: "Earned runs per 7 innings pitched",
    minimumIP: 0,
  },
  whip: {
    formula: "(BB + H) / IP",
    description: "Walks plus hits per inning pitched",
    minimumIP: 0,
  },
  winningPercentage: {
    formula: "W / (W + L)",
    description: "Wins divided by total decisions",
    minimumDecisions: 0,
  },
} as const;
