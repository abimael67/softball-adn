import { supabase } from "@/lib/supabase";
import type { GameScoreSheet, GameScoreSheetInsert } from "@/types/database";
import type { GameScoreSheetRepository } from "@/services/repositories/game-score-sheet-repository";
import { DatabaseError } from "@/lib/errors";

export class SupabaseGameScoreSheetRepository implements GameScoreSheetRepository {
  async findByGameId(gameId: string): Promise<GameScoreSheet[]> {
    const { data, error } = await supabase
      .from("game_score_sheets")
      .select("*")
      .eq("game_id", gameId)
      .order("uploaded_at", { ascending: false });

    if (error) throw new DatabaseError("Failed to fetch score sheets", error);
    return data;
  }

  async findById(id: string): Promise<GameScoreSheet | null> {
    const { data, error } = await supabase
      .from("game_score_sheets")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw new DatabaseError("Failed to fetch score sheet", error);
    }

    return data;
  }

  async create(data: GameScoreSheetInsert): Promise<GameScoreSheet> {
    const { data: sheet, error } = await supabase
      .from("game_score_sheets")
      .insert(data)
      .select()
      .single();

    if (error) throw new DatabaseError("Failed to create score sheet", error);
    return sheet;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("game_score_sheets").delete().eq("id", id);

    if (error) throw new DatabaseError("Failed to delete score sheet", error);
  }
}
