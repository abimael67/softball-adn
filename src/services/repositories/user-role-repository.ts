import type { UserRoleAssignment, UserRole } from "@/types/database";

export interface UserRoleRepository {
  findByUserId(userId: string): Promise<UserRoleAssignment[]>;
  getActiveRoles(userId: string): Promise<UserRole[]>;
  assignRole(userId: string, role: UserRole, assignedBy: string): Promise<UserRoleAssignment>;
  revokeRole(userId: string, role: UserRole): Promise<void>;
  activateRole(userId: string, role: UserRole): Promise<void>;
  deactivateRole(userId: string, role: UserRole): Promise<void>;
}
