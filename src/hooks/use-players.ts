import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SupabasePlayerRepository } from "@/services/repositories/supabase-player-repository";
import type { PlayerInsert, PlayerUpdate } from "@/types/database";
import { QUERY_KEYS } from "@/lib/constants";

const repository = new SupabasePlayerRepository();

export function usePlayers() {
  return useQuery({
    queryKey: ["players"],
    queryFn: () => repository.findAll(),
  });
}

export function usePlayer(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.player(id),
    queryFn: () => repository.findById(id),
    enabled: !!id,
  });
}

export function usePlayersByTeam(teamId: string, seasonId: string) {
  return useQuery({
    queryKey: ["players", "team", teamId, "season", seasonId],
    queryFn: () => repository.findByTeamId(teamId, seasonId),
    enabled: !!teamId && !!seasonId,
  });
}

export function useSearchPlayers(query: string) {
  return useQuery({
    queryKey: ["players", "search", query],
    queryFn: () => repository.search(query),
    enabled: query.length >= 2,
  });
}

export function useCreatePlayer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PlayerInsert) => repository.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["players"] });
    },
  });
}

export function useUpdatePlayer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PlayerUpdate }) =>
      repository.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["players"] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.player(id) });
    },
  });
}
