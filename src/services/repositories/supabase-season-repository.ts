/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "@/lib/supabase";
import type { Season, SeasonInsert, SeasonUpdate } from "@/types/database";
import type { SeasonRepository } from "@/services/repositories/season-repository";
import { DatabaseError, NotFoundError } from "@/lib/errors";

export class SupabaseSeasonRepository implements SeasonRepository {
  async findAll(): Promise<Season[]> {
    const { data, error } = await supabase
      .from("seasons")
      .select("*")
      .order("year", { ascending: false })
      .order("start_date", { ascending: false });

    if (error) throw new DatabaseError("Failed to fetch seasons", error);
    return data;
  }

  async findById(id: string): Promise<Season | null> {
    const { data, error } = await supabase.from("seasons").select("*").eq("id", id).single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw new DatabaseError("Failed to fetch season", error);
    }

    return data;
  }

  async findActive(): Promise<Season | null> {
    const { data, error } = await supabase.from("seasons").select("*").eq("status", "active").single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw new DatabaseError("Failed to fetch active season", error);
    }

    return data;
  }

  async findLatest(): Promise<Season | null> {
    const active = await this.findActive();
    if (active) return active;

    const { data, error } = await supabase
      .from("seasons")
      .select("*")
      .order("year", { ascending: false })
      .order("start_date", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw new DatabaseError("Failed to fetch latest season", error);
    }

    return data;
  }

  async findByYear(year: number): Promise<Season[]> {
    const { data, error } = await supabase
      .from("seasons")
      .select("*")
      .eq("year", year)
      .order("start_date", { ascending: false });

    if (error) throw new DatabaseError("Failed to fetch seasons by year", error);
    return data;
  }

  async create(data: SeasonInsert): Promise<Season> {
    const { data: season, error } = await supabase
      .from("seasons")
      .insert(data as any)
      .select()
      .single();

    if (error) throw new DatabaseError("Failed to create season", error);
    return season;
  }

  async update(id: string, data: SeasonUpdate): Promise<Season> {
    const { data: season, error } = await supabase
      .from("seasons")
      .update(data as any)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new DatabaseError("Failed to update season", error);
    if (!season) throw new NotFoundError("Season", id);

    return season;
  }
}
