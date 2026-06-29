import type { Database } from "../../lib/supabase";

export type Game = Database["public"]["Tables"]["games"]["Row"];
export type GameInsert = Database["public"]["Tables"]["games"]["Insert"];
export type GameUpdate = Database["public"]["Tables"]["games"]["Update"];
export type GameWorkflowStatus = Database["public"]["Enums"]["game_status"];
