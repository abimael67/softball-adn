/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "@/lib/supabase";
import type { Position, PositionInsert, PositionUpdate } from "@/types/database";
import type { PositionRepository } from "@/services/repositories/position-repository";
import { DatabaseError, NotFoundError } from "@/lib/errors";

export class SupabasePositionRepository implements PositionRepository {
  async findAll(): Promise<Position[]> {
    const { data, error } = await supabase
      .from("positions")
      .select("*")
      .order("display_order");

    if (error) throw new DatabaseError("Failed to fetch positions", error);
    return data;
  }

  async findById(id: string): Promise<Position | null> {
    const { data, error } = await supabase
      .from("positions")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw new DatabaseError("Failed to fetch position", error);
    }

    return data;
  }

  async findByCode(code: string): Promise<Position | null> {
    const { data, error } = await supabase
      .from("positions")
      .select("*")
      .eq("code", code)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw new DatabaseError("Failed to fetch position", error);
    }

    return data;
  }

  async create(data: PositionInsert): Promise<Position> {
    const { data: position, error } = await supabase
      .from("positions")
      .insert(data as any)
      .select()
      .single();

    if (error) throw new DatabaseError("Failed to create position", error);
    return position;
  }

  async update(id: string, data: PositionUpdate): Promise<Position> {
    const { data: position, error } = await supabase
      .from("positions")
      .update(data as any)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new DatabaseError("Failed to update position", error);
    if (!position) throw new NotFoundError("Position", id);

    return position;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("positions")
      .delete()
      .eq("id", id);

    if (error) throw new DatabaseError("Failed to delete position", error);
  }
}
