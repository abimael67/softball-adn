/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "@/lib/supabase";
import type { UserRoleAssignment, UserRole } from "@/types/database";
import type { UserRoleRepository } from "@/services/repositories/user-role-repository";
import { DatabaseError } from "@/lib/errors";

export class SupabaseUserRoleRepository implements UserRoleRepository {
  async findByUserId(userId: string): Promise<UserRoleAssignment[]> {
    const { data, error } = await supabase
      .from("user_roles")
      .select("*")
      .eq("user_id", userId)
      .order("assigned_at", { ascending: false });

    if (error) throw new DatabaseError("Failed to fetch user roles", error);
    return data;
  }

  async getActiveRoles(userId: string): Promise<UserRole[]> {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("is_active", true);

    if (error) throw new DatabaseError("Failed to fetch active roles", error);
    return (data as any).map((item: any) => item.role);
  }

  async assignRole(
    userId: string,
    role: UserRole,
    assignedBy: string,
  ): Promise<UserRoleAssignment> {
    const { data, error } = await supabase
      .from("user_roles")
      .insert({
        user_id: userId,
        role,
        assigned_by: assignedBy,
      } as any)
      .select()
      .single();

    if (error) throw new DatabaseError("Failed to assign role", error);
    return data;
  }

  async revokeRole(userId: string, role: UserRole): Promise<void> {
    const { error } = await supabase
      .from("user_roles")
      .update({ is_active: false } as any)
      .eq("user_id", userId)
      .eq("role", role);

    if (error) throw new DatabaseError("Failed to revoke role", error);
  }

  async activateRole(userId: string, role: UserRole): Promise<void> {
    const { error } = await supabase
      .from("user_roles")
      .update({ is_active: true } as any)
      .eq("user_id", userId)
      .eq("role", role);

    if (error) throw new DatabaseError("Failed to activate role", error);
  }

  async deactivateRole(userId: string, role: UserRole): Promise<void> {
    const { error } = await supabase
      .from("user_roles")
      .update({ is_active: false } as any)
      .eq("user_id", userId)
      .eq("role", role);

    if (error) throw new DatabaseError("Failed to deactivate role", error);
  }
}
