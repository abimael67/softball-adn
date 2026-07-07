import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SupabasePitchingStatsRepository } from "@/services/repositories/supabase-pitching-stats-repository";
import type { PitchingStatsInsert } from "@/types/database";

const repository = new SupabasePitchingStatsRepository();

export function usePitchingStatsByGame(gameId: string) {
  return useQuery({
    queryKey: ["pitching-stats", "game", gameId],
    queryFn: () => repository.findByGameId(gameId),
    enabled: !!gameId,
  });
}

export function usePitchingStatsByPlayerAndSeason(playerId: string, seasonId: string) {
  return useQuery({
    queryKey: ["pitching-stats", "player", playerId, "season", seasonId],
    queryFn: () => repository.findByPlayerAndSeason(playerId, seasonId),
    enabled: !!playerId && !!seasonId,
  });
}

export function useCreatePitchingStats() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PitchingStatsInsert) => repository.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pitching-stats"] });
      queryClient.invalidateQueries({ queryKey: ["game", variables.game_id] });
    },
  });
}

export function useUpdatePitchingStats() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PitchingStatsInsert> }) =>
      repository.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pitching-stats"] });
    },
  });
}
