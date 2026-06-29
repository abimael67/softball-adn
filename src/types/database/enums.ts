import type { Database } from "../../lib/supabase";

export type SeasonStatus = Database["public"]["Enums"]["season_status"];
export type BattingHand = Database["public"]["Enums"]["batting_hand"];
export type ThrowingHand = Database["public"]["Enums"]["throwing_hand"];
export type UserRole = Database["public"]["Enums"]["user_role"];
export type GameWorkflowStatus = Database["public"]["Enums"]["game_status"];
