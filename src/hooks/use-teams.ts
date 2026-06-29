import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SupabaseTeamRepository } from "@/services/repositories/supabase-team-repository";
import type { TeamInsert, TeamUpdate } from "@/types/database";
import { QUERY_KEYS } from "@/lib/constants";

const repository = new SupabaseTeamRepository();

export function useTeams() {
  return useQuery({
    queryKey: ["teams"],
    queryFn: () => repository.findAll(),
  });
}

export function useTeam(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.team(id),
    queryFn: () => repository.findById(id),
    enabled: !!id,
  });
}

export function useTeamsBySeason(seasonId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.teams(seasonId),
    queryFn: () => repository.findBySeasonId(seasonId),
    enabled: !!seasonId,
  });
}

export function useCreateTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TeamInsert) => repository.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });
}

export function useUpdateTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TeamUpdate }) => repository.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.team(id) });
    },
  });
}
