import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SupabaseVenueRepository } from "@/services/repositories/supabase-venue-repository";
import type { VenueInsert, VenueUpdate } from "@/types/database";

const repository = new SupabaseVenueRepository();

export function useVenues() {
  return useQuery({
    queryKey: ["venues"],
    queryFn: () => repository.findAll(),
  });
}

export function useVenue(id: string) {
  return useQuery({
    queryKey: ["venue", id],
    queryFn: () => repository.findById(id),
    enabled: !!id,
  });
}

export function useCreateVenue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: VenueInsert) => repository.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["venues"] });
    },
  });
}

export function useUpdateVenue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: VenueUpdate }) =>
      repository.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["venues"] });
      queryClient.invalidateQueries({ queryKey: ["venue", id] });
    },
  });
}
