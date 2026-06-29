/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "@/lib/supabase";
import type { Church, ChurchInsert, ChurchUpdate } from "@/types/database";
import type { ChurchRepository } from "@/services/repositories/church-repository";
import { DatabaseError, NotFoundError } from "@/lib/errors";

export class SupabaseChurchRepository implements ChurchRepository {
  async findAll(): Promise<Church[]> {
    const { data, error } = await supabase
      .from("churches")
      .select("*")
      .order("name");

    if (error) throw new DatabaseError("Failed to fetch churches", error);
    return data;
  }

  async findById(id: string): Promise<Church | null> {
    const { data, error } = await supabase
      .from("churches")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw new DatabaseError("Failed to fetch church", error);
    }

    return data;
  }

  async create(data: ChurchInsert): Promise<Church> {
    const { data: church, error } = await supabase
      .from("churches")
      .insert(data as any)
      .select()
      .single();

    if (error) throw new DatabaseError("Failed to create church", error);
    return church;
  }

  async update(id: string, data: ChurchUpdate): Promise<Church> {
    const { data: church, error } = await supabase
      .from("churches")
      .update(data as any)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new DatabaseError("Failed to update church", error);
    if (!church) throw new NotFoundError("Church", id);

    return church;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("churches")
      .delete()
      .eq("id", id);

    if (error) throw new DatabaseError("Failed to delete church", error);
  }
}
