import type { Database } from "../supabase-schema";

export type GameScoreSheet = Database["public"]["Tables"]["game_score_sheets"]["Row"];
export type GameScoreSheetInsert = Database["public"]["Tables"]["game_score_sheets"]["Insert"];
