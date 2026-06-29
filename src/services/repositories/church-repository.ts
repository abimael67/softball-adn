import type { Church, ChurchInsert, ChurchUpdate } from "@/types/database";

export interface ChurchRepository {
  findAll(): Promise<Church[]>;
  findById(id: string): Promise<Church | null>;
  create(data: ChurchInsert): Promise<Church>;
  update(id: string, data: ChurchUpdate): Promise<Church>;
  delete(id: string): Promise<void>;
}
