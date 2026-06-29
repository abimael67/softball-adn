import { SupabaseUserRoleRepository } from "@/services/repositories/supabase-user-role-repository";

const repository = new SupabaseUserRoleRepository();

export function useUserRoleRepository() {
  return repository;
}
