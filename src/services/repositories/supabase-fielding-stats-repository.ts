import { supabase } from "@/lib/supabase";
import type { FieldingStats, FieldingStatsInsert, FieldingStatsUpdate } from "@/types/database";
import type { FieldingStatsRepository } from "@/services/repositories/fielding-stats-repository";
import { DatabaseError, NotFoundError } from "@/lib/errors";

export class SupabaseFieldingStatsRepository implements FieldingStatsRepository {
  async findByGameId(gameId: string): Promise<FieldingStats[]> {
    const { data, error } = await supabase
      .from("fielding_stats")
      .select("*")
      .eq("game_id", gameId);

    if (error) throw new DatabaseError("Failed to fetch fielding stats", error);
    return data;
  }

  async findByPlayerId(playerId: string): Promise<FieldingStats[]> {
    const { data, error } = await supabase
      .from("fielding_stats")
      .select("*")
      .eq("player_id", playerId);

    if (error) throw new DatabaseError("Failed to fetch fielding stats", error);
    return data;
  }

  async findByPlayerAndSeason(playerId: string, seasonId: string): Promise<FieldingStats[]> {
    const { data, error } = await supabase
      .from("fielding_stats")
      .select("*")
      .eq("player_id", playerId)
      .eq("season_id", seasonId);

    if (error) throw new DatabaseError("Failed to fetch fielding stats", error);
    return data;
  }

  async findByTeamAndSeason(teamId: string, seasonId: string): Promise<FieldingStats[]> {
    const { data, error } = await supabase
      .from("fielding_stats")
      .select("*")
      .eq("team_id", teamId)
      .eq("season_id", seasonId);

    if (error) throw new DatabaseError("Failed to fetch fielding stats", error);
    return data;
  }

  async findByPlayerAndGame(playerId: string, gameId: string): Promise<FieldingStats | null> {
    const { data, error } = await supabase
      .from("fielding_stats")
      .select("*")
      .eq("player_id", playerId)
      .eq("game_id", gameId)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw new DatabaseError("Failed to fetch fielding stats", error);
    }

    return data;
  }

  async create(data: FieldingStatsInsert): Promise<FieldingStats> {
    const { data: stats, error } = await supabase
      .from("fielding_stats")
      .insert(data)
      .select()
      .single();

    if (error) throw new DatabaseError("Failed to create fielding stats", error);
    return stats;
  }

  async update(id: string, data: FieldingStatsUpdate): Promise<FieldingStats> {
    const { data: stats, error } = await supabase
      .from("fielding_stats")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new DatabaseError("Failed to update fielding stats", error);
    if (!stats) throw new NotFoundError("FieldingStats", id);

    return stats;
  }
}
