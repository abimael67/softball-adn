/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "@/lib/supabase";
import type { Team, TeamInsert, TeamUpdate } from "@/types/database";
import type { TeamRepository } from "@/services/repositories/team-repository";
import { DatabaseError, NotFoundError } from "@/lib/errors";

export class SupabaseTeamRepository implements TeamRepository {
  async findAll(): Promise<Team[]> {
    const { data, error } = await supabase.from("teams").select("*").order("name");

    if (error) throw new DatabaseError("Failed to fetch teams", error);
    return data;
  }

  async findById(id: string): Promise<Team | null> {
    const { data, error } = await supabase.from("teams").select("*").eq("id", id).single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw new DatabaseError("Failed to fetch team", error);
    }

    return data;
  }

  async findBySeasonId(seasonId: string): Promise<Team[]> {
    const { data, error } = await supabase
      .from("season_rosters")
      .select("team:teams(*)")
      .eq("season_id", seasonId)
      .eq("is_active", true);

    if (error) throw new DatabaseError("Failed to fetch teams by season", error);

    const teams = (data as any)
      .map((item: any) => item.team)
      .filter((team: any): team is Team => team !== null)
      .filter((team: Team, index: number, self: Team[]) => self.findIndex((t) => t.id === team.id) === index);

    return teams;
  }

  async create(data: TeamInsert): Promise<Team> {
    const { data: team, error } = await supabase
      .from("teams")
      .insert(data as any)
      .select()
      .single();

    if (error) throw new DatabaseError("Failed to create team", error);
    return team;
  }

  async update(id: string, data: TeamUpdate): Promise<Team> {
    const { data: team, error } = await supabase
      .from("teams")
      .update(data as any)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new DatabaseError("Failed to update team", error);
    if (!team) throw new NotFoundError("Team", id);

    return team;
  }
}
