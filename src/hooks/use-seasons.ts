import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SupabaseSeasonRepository } from "@/services/repositories/supabase-season-repository";
import type { SeasonInsert, SeasonUpdate } from "@/types/database";
import { QUERY_KEYS } from "@/lib/constants";

const repository = new SupabaseSeasonRepository();

export function useSeasons() {
  return useQuery({
    queryKey: QUERY_KEYS.seasons,
    queryFn: () => repository.findAll(),
  });
}

export function useSeason(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.season(id),
    queryFn: () => repository.findById(id),
    enabled: !!id,
  });
}

export function useActiveSeason() {
  return useQuery({
    queryKey: ["active-season"],
    queryFn: () => repository.findActive(),
  });
}

export function useSeasonsByYear(year: number) {
  return useQuery({
    queryKey: ["seasons", "year", year],
    queryFn: () => repository.findByYear(year),
    enabled: !!year,
  });
}

export function useCreateSeason() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SeasonInsert) => repository.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.seasons });
    },
  });
}

export function useUpdateSeason() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: SeasonUpdate }) =>
      repository.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.seasons });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.season(id) });
    },
  });
}
