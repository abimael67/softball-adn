import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SupabaseFieldingStatsRepository } from "@/services/repositories/supabase-fielding-stats-repository";
import type { FieldingStatsInsert } from "@/types/database";

const repository = new SupabaseFieldingStatsRepository();

export function useFieldingStatsByGame(gameId: string) {
  return useQuery({
    queryKey: ["fielding-stats", "game", gameId],
    queryFn: () => repository.findByGameId(gameId),
    enabled: !!gameId,
  });
}

export function useFieldingStatsByPlayerAndSeason(playerId: string, seasonId: string) {
  return useQuery({
    queryKey: ["fielding-stats", "player", playerId, "season", seasonId],
    queryFn: () => repository.findByPlayerAndSeason(playerId, seasonId),
    enabled: !!playerId && !!seasonId,
  });
}

export function useCreateFieldingStats() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FieldingStatsInsert) => repository.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["fielding-stats"] });
      queryClient.invalidateQueries({ queryKey: ["game", variables.game_id] });
    },
  });
}

export function useUpdateFieldingStats() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<FieldingStatsInsert> }) =>
      repository.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fielding-stats"] });
    },
  });
}
