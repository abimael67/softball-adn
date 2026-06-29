/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "@/lib/supabase";
import type { Venue, VenueInsert, VenueUpdate } from "@/types/database";
import type { VenueRepository } from "@/services/repositories/venue-repository";
import { DatabaseError, NotFoundError } from "@/lib/errors";

export class SupabaseVenueRepository implements VenueRepository {
  async findAll(): Promise<Venue[]> {
    const { data, error } = await supabase.from("venues").select("*").order("name");

    if (error) throw new DatabaseError("Failed to fetch venues", error);
    return data;
  }

  async findById(id: string): Promise<Venue | null> {
    const { data, error } = await supabase.from("venues").select("*").eq("id", id).single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw new DatabaseError("Failed to fetch venue", error);
    }

    return data;
  }

  async findByName(name: string): Promise<Venue | null> {
    const { data, error } = await supabase.from("venues").select("*").eq("name", name).single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw new DatabaseError("Failed to fetch venue by name", error);
    }

    return data;
  }

  async create(data: VenueInsert): Promise<Venue> {
    const { data: venue, error } = await supabase
      .from("venues")
      .insert(data as any)
      .select()
      .single();

    if (error) throw new DatabaseError("Failed to create venue", error);
    return venue;
  }

  async update(id: string, data: VenueUpdate): Promise<Venue> {
    const { data: venue, error } = await supabase
      .from("venues")
      .update(data as any)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new DatabaseError("Failed to update venue", error);
    if (!venue) throw new NotFoundError("Venue", id);

    return venue;
  }
}
