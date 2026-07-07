import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SupabaseBattingStatsRepository } from "@/services/repositories/supabase-batting-stats-repository";
import type { BattingStatsInsert } from "@/types/database";

const repository = new SupabaseBattingStatsRepository();

export function useBattingStatsByGame(gameId: string) {
  return useQuery({
    queryKey: ["batting-stats", "game", gameId],
    queryFn: () => repository.findByGameId(gameId),
    enabled: !!gameId,
  });
}

export function useBattingStatsByPlayerAndSeason(playerId: string, seasonId: string) {
  return useQuery({
    queryKey: ["batting-stats", "player", playerId, "season", seasonId],
    queryFn: () => repository.findByPlayerAndSeason(playerId, seasonId),
    enabled: !!playerId && !!seasonId,
  });
}

export function useCreateBattingStats() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BattingStatsInsert) => repository.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["batting-stats"] });
      queryClient.invalidateQueries({ queryKey: ["game", variables.game_id] });
    },
  });
}

export function useUpdateBattingStats() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BattingStatsInsert> }) =>
      repository.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["batting-stats"] });
    },
  });
}
