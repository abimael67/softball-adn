import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SupabaseSeasonRosterRepository } from "@/services/repositories/supabase-season-roster-repository";
import type { SeasonRosterInsert, SeasonRosterUpdate } from "@/types/database";

const repository = new SupabaseSeasonRosterRepository();

export function useRostersBySeason(seasonId: string) {
  return useQuery({
    queryKey: ["rosters", "season", seasonId],
    queryFn: () => repository.findBySeasonId(seasonId),
    enabled: !!seasonId,
  });
}

export function useRostersByTeam(teamId: string, seasonId: string) {
  return useQuery({
    queryKey: ["rosters", "team", teamId, "season", seasonId],
    queryFn: () => repository.findByTeamId(teamId, seasonId),
    enabled: !!teamId && !!seasonId,
  });
}

export function useRostersByPlayer(playerId: string, seasonId: string) {
  return useQuery({
    queryKey: ["rosters", "player", playerId, "season", seasonId],
    queryFn: () => repository.findByPlayerId(playerId, seasonId),
    enabled: !!playerId && !!seasonId,
  });
}

export function useActiveRoster(playerId: string, seasonId: string) {
  return useQuery({
    queryKey: ["rosters", "active", playerId, seasonId],
    queryFn: () => repository.findActiveByPlayerId(playerId, seasonId),
    enabled: !!playerId && !!seasonId,
  });
}

export function useRosterHistory(playerId: string, seasonId: string) {
  return useQuery({
    queryKey: ["rosters", "history", playerId, seasonId],
    queryFn: () => repository.getHistory(playerId, seasonId),
    enabled: !!playerId && !!seasonId,
  });
}

export function useCreateRoster() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SeasonRosterInsert) => repository.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rosters"] });
    },
  });
}

export function useUpdateRoster() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: SeasonRosterUpdate }) =>
      repository.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rosters"] });
    },
  });
}

export function useDeactivateRoster() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => repository.deactivate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rosters"] });
    },
  });
}
