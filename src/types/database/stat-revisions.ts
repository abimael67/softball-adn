import type { Database } from "../supabase-schema";

export type StatRevision = Database["public"]["Tables"]["stat_revisions"]["Row"];
export type StatRevisionInsert = Database["public"]["Tables"]["stat_revisions"]["Insert"];
