import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SupabaseGameRepository } from "@/services/repositories/supabase-game-repository";
import type { GameInsert, GameUpdate, GameWorkflowStatus } from "@/types/database";
import { QUERY_KEYS } from "@/lib/constants";

const repository = new SupabaseGameRepository();

export function useGames(seasonId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.games(seasonId),
    queryFn: () => repository.findBySeasonId(seasonId),
    enabled: !!seasonId,
  });
}

export function useGame(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.game(id),
    queryFn: () => repository.findById(id),
    enabled: !!id,
  });
}

export function useGamesByTeam(teamId: string, seasonId: string) {
  return useQuery({
    queryKey: ["games", "team", teamId, "season", seasonId],
    queryFn: () => repository.findByTeamId(teamId, seasonId),
    enabled: !!teamId && !!seasonId,
  });
}

export function useGamesByStatus(status: GameWorkflowStatus, seasonId: string) {
  return useQuery({
    queryKey: ["games", "status", status, "season", seasonId],
    queryFn: () => repository.findByStatus(status, seasonId),
    enabled: !!seasonId,
  });
}

export function useUpcomingGames(seasonId: string, limit?: number) {
  return useQuery({
    queryKey: ["games", "upcoming", seasonId],
    queryFn: () => repository.findUpcoming(seasonId, limit),
    enabled: !!seasonId,
  });
}

export function useRecentGames(seasonId: string, limit?: number) {
  return useQuery({
    queryKey: ["games", "recent", seasonId],
    queryFn: () => repository.findRecent(seasonId, limit),
    enabled: !!seasonId,
  });
}

export function usePendingReviewGames(seasonId: string) {
  return useQuery({
    queryKey: ["games", "pending-review", seasonId],
    queryFn: () => repository.findPendingReview(seasonId),
    enabled: !!seasonId,
  });
}

export function useApprovedGames(seasonId: string) {
  return useQuery({
    queryKey: ["games", "approved", seasonId],
    queryFn: () => repository.findApproved(seasonId),
    enabled: !!seasonId,
  });
}

export function useCreateGame() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GameInsert) => repository.create(data),
    onSuccess: (_, data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.games(data.season_id) });
    },
  });
}

export function useUpdateGame() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: GameUpdate }) => repository.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["games"] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.game(id) });
    },
  });
}

export function useDeleteGame() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => repository.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["games"] });
    },
  });
}

export function useSubmitGameForReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, userId }: { id: string; userId: string }) =>
      repository.submitForReview(id, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["games"] });
    },
  });
}

export function useApproveGame() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, userId }: { id: string; userId: string }) =>
      repository.approve(id, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["games"] });
    },
  });
}

export function usePublishGame() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, userId }: { id: string; userId: string }) =>
      repository.publish(id, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["games"] });
    },
  });
}

export function useReturnGameForCorrection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, userId, notes }: { id: string; userId: string; notes: string }) =>
      repository.returnForCorrection(id, userId, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["games"] });
    },
  });
}
