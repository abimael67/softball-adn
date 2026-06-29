import type { Database } from "../../lib/supabase";

export type SeasonRoster = Database["public"]["Tables"]["season_rosters"]["Row"];
export type SeasonRosterInsert = Database["public"]["Tables"]["season_rosters"]["Insert"];
export type SeasonRosterUpdate = Database["public"]["Tables"]["season_rosters"]["Update"];
