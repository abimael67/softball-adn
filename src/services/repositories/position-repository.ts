import type { Position, PositionInsert, PositionUpdate } from "@/types/database";

export interface PositionRepository {
  findAll(): Promise<Position[]>;
  findById(id: string): Promise<Position | null>;
  findByCode(code: string): Promise<Position | null>;
  create(data: PositionInsert): Promise<Position>;
  update(id: string, data: PositionUpdate): Promise<Position>;
  delete(id: string): Promise<void>;
}
