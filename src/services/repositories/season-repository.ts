import type { Season, SeasonInsert, SeasonUpdate } from "@/types/database";

export interface SeasonRepository {
  findAll(): Promise<Season[]>;
  findById(id: string): Promise<Season | null>;
  findActive(): Promise<Season | null>;
  findLatest(): Promise<Season | null>;
  findByYear(year: number): Promise<Season[]>;
  create(data: SeasonInsert): Promise<Season>;
  update(id: string, data: SeasonUpdate): Promise<Season>;
}
