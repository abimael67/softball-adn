import type { Database } from "../../lib/supabase";

export type Season = Database["public"]["Tables"]["seasons"]["Row"];
export type SeasonInsert = Database["public"]["Tables"]["seasons"]["Insert"];
export type SeasonUpdate = Database["public"]["Tables"]["seasons"]["Update"];
