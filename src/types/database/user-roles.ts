import type { Database } from "../../lib/supabase";

export type UserRoleAssignment = Database["public"]["Tables"]["user_roles"]["Row"];
export type UserRoleAssignmentInsert = Database["public"]["Tables"]["user_roles"]["Insert"];
export type UserRole = Database["public"]["Enums"]["user_role"];

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  roles: UserRole[];
  created_at: string;
  updated_at: string;
}
