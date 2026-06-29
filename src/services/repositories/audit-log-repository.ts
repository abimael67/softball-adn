import type { AuditLog, AuditLogInsert } from "@/types/database";
import type { AuditLogFilter } from "@/types/domain";

export interface AuditLogRepository {
  findAll(filter?: AuditLogFilter): Promise<AuditLog[]>;
  findById(id: string): Promise<AuditLog | null>;
  findByEntity(entity: string, entityId: string): Promise<AuditLog[]>;
  findByUser(userId: string): Promise<AuditLog[]>;
  create(data: AuditLogInsert): Promise<AuditLog>;
}
