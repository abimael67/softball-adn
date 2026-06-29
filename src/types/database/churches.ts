import type { Database } from "../../lib/supabase";

export type Church = Database["public"]["Tables"]["churches"]["Row"];
export type ChurchInsert = Database["public"]["Tables"]["churches"]["Insert"];
export type ChurchUpdate = Database["public"]["Tables"]["churches"]["Update"];
