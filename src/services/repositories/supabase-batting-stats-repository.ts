import { supabase } from "@/lib/supabase";
import type { BattingStats, BattingStatsInsert, BattingStatsUpdate } from "@/types/database";
import type { BattingStatsRepository } from "@/services/repositories/batting-stats-repository";
import { DatabaseError, NotFoundError } from "@/lib/errors";

export class SupabaseBattingStatsRepository implements BattingStatsRepository {
  async findByGameId(gameId: string): Promise<BattingStats[]> {
    const { data, error } = await supabase
      .from("batting_stats")
      .select("*")
      .eq("game_id", gameId);

    if (error) throw new DatabaseError("Failed to fetch batting stats", error);
    return data;
  }

  async findByPlayerId(playerId: string): Promise<BattingStats[]> {
    const { data, error } = await supabase
      .from("batting_stats")
      .select("*")
      .eq("player_id", playerId);

    if (error) throw new DatabaseError("Failed to fetch batting stats", error);
    return data;
  }

  async findByPlayerAndSeason(playerId: string, seasonId: string): Promise<BattingStats[]> {
    const { data, error } = await supabase
      .from("batting_stats")
      .select("*")
      .eq("player_id", playerId)
      .eq("season_id", seasonId);

    if (error) throw new DatabaseError("Failed to fetch batting stats", error);
    return data;
  }

  async findByTeamAndSeason(teamId: string, seasonId: string): Promise<BattingStats[]> {
    const { data, error } = await supabase
      .from("batting_stats")
      .select("*")
      .eq("team_id", teamId)
      .eq("season_id", seasonId);

    if (error) throw new DatabaseError("Failed to fetch batting stats", error);
    return data;
  }

  async findByPlayerAndGame(playerId: string, gameId: string): Promise<BattingStats | null> {
    const { data, error } = await supabase
      .from("batting_stats")
      .select("*")
      .eq("player_id", playerId)
      .eq("game_id", gameId)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw new DatabaseError("Failed to fetch batting stats", error);
    }

    return data;
  }

  async create(data: BattingStatsInsert): Promise<BattingStats> {
    const { data: stats, error } = await supabase
      .from("batting_stats")
      .insert(data)
      .select()
      .single();

    if (error) throw new DatabaseError("Failed to create batting stats", error);
    return stats;
  }

  async update(id: string, data: BattingStatsUpdate): Promise<BattingStats> {
    const { data: stats, error } = await supabase
      .from("batting_stats")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new DatabaseError("Failed to update batting stats", error);
    if (!stats) throw new NotFoundError("BattingStats", id);

    return stats;
  }
}
