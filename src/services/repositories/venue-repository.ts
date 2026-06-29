import type { Venue, VenueInsert, VenueUpdate } from "@/types/database";

export interface VenueRepository {
  findAll(): Promise<Venue[]>;
  findById(id: string): Promise<Venue | null>;
  findByName(name: string): Promise<Venue | null>;
  create(data: VenueInsert): Promise<Venue>;
  update(id: string, data: VenueUpdate): Promise<Venue>;
}
