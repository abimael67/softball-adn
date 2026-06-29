/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "@/lib/supabase";
import type { SeasonRoster, SeasonRosterInsert, SeasonRosterUpdate } from "@/types/database";
import type { SeasonRosterRepository } from "@/services/repositories/season-roster-repository";
import { DatabaseError, NotFoundError } from "@/lib/errors";

export class SupabaseSeasonRosterRepository implements SeasonRosterRepository {
  async findBySeasonId(seasonId: string): Promise<SeasonRoster[]> {
    const { data, error } = await supabase
      .from("season_rosters")
      .select("*")
      .eq("season_id", seasonId)
      .order("created_at", { ascending: false });

    if (error) throw new DatabaseError("Failed to fetch rosters by season", error);
    return data;
  }

  async findByTeamId(teamId: string, seasonId: string): Promise<SeasonRoster[]> {
    const { data, error } = await supabase
      .from("season_rosters")
      .select("*")
      .eq("team_id", teamId)
      .eq("season_id", seasonId)
      .order("jersey_number", { ascending: true });

    if (error) throw new DatabaseError("Failed to fetch rosters by team", error);
    return data;
  }

  async findByPlayerId(playerId: string, seasonId: string): Promise<SeasonRoster[]> {
    const { data, error } = await supabase
      .from("season_rosters")
      .select("*")
      .eq("player_id", playerId)
      .eq("season_id", seasonId)
      .order("joined_at", { ascending: false });

    if (error) throw new DatabaseError("Failed to fetch rosters by player", error);
    return data;
  }

  async findActiveByPlayerId(playerId: string, seasonId: string): Promise<SeasonRoster | null> {
    const { data, error } = await supabase
      .from("season_rosters")
      .select("*")
      .eq("player_id", playerId)
      .eq("season_id", seasonId)
      .eq("is_active", true)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw new DatabaseError("Failed to fetch active roster", error);
    }

    return data;
  }

  async getHistory(playerId: string, seasonId: string): Promise<SeasonRoster[]> {
    const { data, error } = await supabase
      .from("season_rosters")
      .select("*")
      .eq("player_id", playerId)
      .eq("season_id", seasonId)
      .order("joined_at", { ascending: false });

    if (error) throw new DatabaseError("Failed to fetch roster history", error);
    return data;
  }

  async create(data: SeasonRosterInsert): Promise<SeasonRoster> {
    const { data: roster, error } = await supabase
      .from("season_rosters")
      .insert(data as any)
      .select()
      .single();

    if (error) throw new DatabaseError("Failed to create roster entry", error);
    return roster;
  }

  async update(id: string, data: SeasonRosterUpdate): Promise<SeasonRoster> {
    const { data: roster, error } = await supabase
      .from("season_rosters")
      .update(data as any)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new DatabaseError("Failed to update roster entry", error);
    if (!roster) throw new NotFoundError("Roster entry", id);

    return roster;
  }

  async deactivate(id: string): Promise<SeasonRoster> {
    const { data: roster, error } = await supabase
      .from("season_rosters")
      .update({
        is_active: false,
        left_at: new Date().toISOString(),
      } as any)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new DatabaseError("Failed to deactivate roster entry", error);
    if (!roster) throw new NotFoundError("Roster entry", id);

    return roster;
  }
}
