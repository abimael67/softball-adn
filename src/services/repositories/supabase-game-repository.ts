/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "@/lib/supabase";
import type { Game, GameInsert, GameUpdate, GameWorkflowStatus } from "@/types/database";
import type { GameRepository } from "@/services/repositories/game-repository";
import { DatabaseError, NotFoundError } from "@/lib/errors";

export class SupabaseGameRepository implements GameRepository {
  async findAll(): Promise<Game[]> {
    const { data, error } = await supabase
      .from("games")
      .select("*")
      .order("scheduled_at", { ascending: false });

    if (error) throw new DatabaseError("Failed to fetch games", error);
    return data;
  }

  async findById(id: string): Promise<Game | null> {
    const { data, error } = await supabase.from("games").select("*").eq("id", id).single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw new DatabaseError("Failed to fetch game", error);
    }

    return data;
  }

  async findBySeasonId(seasonId: string): Promise<Game[]> {
    const { data, error } = await supabase
      .from("games")
      .select("*")
      .eq("season_id", seasonId)
      .order("scheduled_at", { ascending: false });

    if (error) throw new DatabaseError("Failed to fetch games by season", error);
    return data;
  }

  async findByTeamId(teamId: string, seasonId: string): Promise<Game[]> {
    const { data, error } = await supabase
      .from("games")
      .select("*")
      .eq("season_id", seasonId)
      .or(`home_team_id.eq.${teamId},away_team_id.eq.${teamId}`)
      .order("scheduled_at", { ascending: false });

    if (error) throw new DatabaseError("Failed to fetch games by team", error);
    return data;
  }

  async findByStatus(status: GameWorkflowStatus, seasonId: string): Promise<Game[]> {
    const { data, error } = await supabase
      .from("games")
      .select("*")
      .eq("status", status)
      .eq("season_id", seasonId)
      .order("scheduled_at", { ascending: false });

    if (error) throw new DatabaseError("Failed to fetch games by status", error);
    return data;
  }

  async findUpcoming(seasonId: string, limit = 10): Promise<Game[]> {
    const { data, error } = await supabase
      .from("games")
      .select("*")
      .eq("season_id", seasonId)
      .eq("status", "scheduled")
      .gte("scheduled_at", new Date().toISOString())
      .order("scheduled_at", { ascending: true })
      .limit(limit);

    if (error) throw new DatabaseError("Failed to fetch upcoming games", error);
    return data;
  }

  async findRecent(seasonId: string, limit = 10): Promise<Game[]> {
    const { data, error } = await supabase
      .from("games")
      .select("*")
      .eq("season_id", seasonId)
      .in("status", ["published", "approved"])
      .lte("scheduled_at", new Date().toISOString())
      .order("scheduled_at", { ascending: false })
      .limit(limit);

    if (error) throw new DatabaseError("Failed to fetch recent games", error);
    return data;
  }

  async findPendingReview(seasonId: string): Promise<Game[]> {
    const { data, error } = await supabase
      .from("games")
      .select("*")
      .eq("status", "pending_review")
      .eq("season_id", seasonId)
      .order("submitted_at", { ascending: true });

    if (error) throw new DatabaseError("Failed to fetch pending review games", error);
    return data;
  }

  async findApproved(seasonId: string): Promise<Game[]> {
    const { data, error } = await supabase
      .from("games")
      .select("*")
      .eq("status", "approved")
      .eq("season_id", seasonId)
      .order("approved_at", { ascending: true });

    if (error) throw new DatabaseError("Failed to fetch approved games", error);
    return data;
  }

  async create(data: GameInsert): Promise<Game> {
    const { data: game, error } = await supabase
      .from("games")
      .insert(data as any)
      .select()
      .single();

    if (error) throw new DatabaseError("Failed to create game", error);
    return game;
  }

  async update(id: string, data: GameUpdate): Promise<Game> {
    const { data: game, error } = await supabase
      .from("games")
      .update(data as any)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new DatabaseError("Failed to update game", error);
    if (!game) throw new NotFoundError("Game", id);

    return game;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("games").delete().eq("id", id);

    if (error) throw new DatabaseError("Failed to delete game", error);
  }

  async submitForReview(id: string, userId: string): Promise<Game> {
    const { data: game, error } = await supabase
      .from("games")
      .update({
        status: "pending_review",
        submitted_by: userId,
        submitted_at: new Date().toISOString(),
      } as any)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new DatabaseError("Failed to submit game for review", error);
    if (!game) throw new NotFoundError("Game", id);

    return game;
  }

  async approve(id: string, userId: string): Promise<Game> {
    const { data: game, error } = await supabase
      .from("games")
      .update({
        status: "approved",
        approved_by: userId,
        approved_at: new Date().toISOString(),
      } as any)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new DatabaseError("Failed to approve game", error);
    if (!game) throw new NotFoundError("Game", id);

    return game;
  }

  async publish(id: string, userId: string): Promise<Game> {
    const { data: game, error } = await supabase
      .from("games")
      .update({
        status: "published",
        published_by: userId,
        published_at: new Date().toISOString(),
      } as any)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new DatabaseError("Failed to publish game", error);
    if (!game) throw new NotFoundError("Game", id);

    return game;
  }

  async returnForCorrection(id: string, userId: string, notes: string): Promise<Game> {
    const { data: game, error } = await supabase
      .from("games")
      .update({
        status: "statistics_entry",
        review_notes: notes,
        last_edited_by: userId,
        last_edited_at: new Date().toISOString(),
      } as any)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new DatabaseError("Failed to return game for correction", error);
    if (!game) throw new NotFoundError("Game", id);

    return game;
  }
}
