import { supabase } from "@/lib/supabase";
import type { PitchingStats, PitchingStatsInsert, PitchingStatsUpdate } from "@/types/database";
import type { PitchingStatsRepository } from "@/services/repositories/pitching-stats-repository";
import { DatabaseError, NotFoundError } from "@/lib/errors";

export class SupabasePitchingStatsRepository implements PitchingStatsRepository {
  async findByGameId(gameId: string): Promise<PitchingStats[]> {
    const { data, error } = await supabase
      .from("pitching_stats")
      .select("*")
      .eq("game_id", gameId);

    if (error) throw new DatabaseError("Failed to fetch pitching stats", error);
    return data;
  }

  async findByPlayerId(playerId: string): Promise<PitchingStats[]> {
    const { data, error } = await supabase
      .from("pitching_stats")
      .select("*")
      .eq("player_id", playerId);

    if (error) throw new DatabaseError("Failed to fetch pitching stats", error);
    return data;
  }

  async findByPlayerAndSeason(playerId: string, seasonId: string): Promise<PitchingStats[]> {
    const { data, error } = await supabase
      .from("pitching_stats")
      .select("*")
      .eq("player_id", playerId)
      .eq("season_id", seasonId);

    if (error) throw new DatabaseError("Failed to fetch pitching stats", error);
    return data;
  }

  async findByPlayerAndGame(playerId: string, gameId: string): Promise<PitchingStats | null> {
    const { data, error } = await supabase
      .from("pitching_stats")
      .select("*")
      .eq("player_id", playerId)
      .eq("game_id", gameId)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw new DatabaseError("Failed to fetch pitching stats", error);
    }

    return data;
  }

  async create(data: PitchingStatsInsert): Promise<PitchingStats> {
    const { data: stats, error } = await supabase
      .from("pitching_stats")
      .insert(data)
      .select()
      .single();

    if (error) throw new DatabaseError("Failed to create pitching stats", error);
    return stats;
  }

  async update(id: string, data: PitchingStatsUpdate): Promise<PitchingStats> {
    const { data: stats, error } = await supabase
      .from("pitching_stats")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new DatabaseError("Failed to update pitching stats", error);
    if (!stats) throw new NotFoundError("PitchingStats", id);

    return stats;
  }
}
