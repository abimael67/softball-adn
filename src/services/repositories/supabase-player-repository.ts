/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "@/lib/supabase";
import type { Player, PlayerInsert, PlayerUpdate } from "@/types/database";
import type { PlayerRepository, PaginatedResult } from "@/services/repositories/player-repository";
import { DatabaseError, NotFoundError } from "@/lib/errors";

export class SupabasePlayerRepository implements PlayerRepository {
  async findAll(): Promise<Player[]> {
    const { data, error } = await supabase
      .from("players")
      .select("*")
      .order("last_name")
      .order("first_name");

    if (error) throw new DatabaseError("Failed to fetch players", error);
    return data;
  }

  async findAllPaginated(
    offset: number,
    limit: number,
    search?: string
  ): Promise<PaginatedResult<Player>> {
    let query = supabase
      .from("players")
      .select("*", { count: "exact" })
      .order("last_name")
      .order("first_name")
      .range(offset, offset + limit - 1);

    if (search) {
      query = query.or(
        `first_name.ilike.%${search}%,last_name.ilike.%${search}%,nickname.ilike.%${search}%`
      );
    }

    const { data, error, count } = await query;

    if (error) throw new DatabaseError("Failed to fetch players", error);
    return { data, count: count ?? 0 };
  }

  async findById(id: string): Promise<Player | null> {
    const { data, error } = await supabase.from("players").select("*").eq("id", id).single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw new DatabaseError("Failed to fetch player", error);
    }

    return data;
  }

  async findByTeamId(teamId: string, seasonId: string): Promise<Player[]> {
    const { data, error } = await supabase
      .from("season_rosters")
      .select("player:players(*)")
      .eq("team_id", teamId)
      .eq("season_id", seasonId)
      .eq("is_active", true);

    if (error) throw new DatabaseError("Failed to fetch players by team", error);

    return (data as any)
      .map((item: any) => item.player)
      .filter((player: any): player is Player => player !== null);
  }

  async search(query: string): Promise<Player[]> {
    const { data, error } = await supabase
      .from("players")
      .select("*")
      .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,nickname.ilike.%${query}%`)
      .order("last_name")
      .order("first_name");

    if (error) throw new DatabaseError("Failed to search players", error);
    return data;
  }

  async create(data: PlayerInsert): Promise<Player> {
    const { data: player, error } = await supabase
      .from("players")
      .insert(data as any)
      .select()
      .single();

    if (error) throw new DatabaseError("Failed to create player", error);
    return player;
  }

  async update(id: string, data: PlayerUpdate): Promise<Player> {
    const { data: player, error } = await supabase
      .from("players")
      .update(data as any)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new DatabaseError("Failed to update player", error);
    if (!player) throw new NotFoundError("Player", id);

    return player;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("players")
      .delete()
      .eq("id", id);

    if (error) throw new DatabaseError("Failed to delete player", error);
  }
}
