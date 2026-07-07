import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { SupabaseGameScoreSheetRepository } from "@/services/repositories/supabase-game-score-sheet-repository";
import type { GameScoreSheetInsert } from "@/types/database";

const repository = new SupabaseGameScoreSheetRepository();

export function useGameScoreSheets(gameId: string) {
  return useQuery({
    queryKey: ["game-score-sheets", gameId],
    queryFn: () => repository.findByGameId(gameId),
    enabled: !!gameId,
  });
}

export function useCreateGameScoreSheet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<GameScoreSheetInsert, "uploaded_by">) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user?.id) throw new Error("Usuario no autenticado");

      return repository.create({
        ...data,
        uploaded_by: user.user.id,
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["game-score-sheets", variables.game_id] });
    },
  });
}

export function useDeleteGameScoreSheet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, gameId }: { id: string; gameId: string }) => {
      await repository.delete(id);
      return gameId;
    },
    onSuccess: (gameId) => {
      queryClient.invalidateQueries({ queryKey: ["game-score-sheets", gameId] });
    },
  });
}
