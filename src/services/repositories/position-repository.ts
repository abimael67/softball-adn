import type { Position } from "@/types/database";

export interface PositionRepository {
  findAll(): Promise<Position[]>;
  findById(id: string): Promise<Position | null>;
  findByCode(code: string): Promise<Position | null>;
}
