import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SupabasePositionRepository } from "@/services/repositories/supabase-position-repository";
import type { PositionInsert, PositionUpdate } from "@/types/database";

const repository = new SupabasePositionRepository();

export function usePositions() {
  return useQuery({
    queryKey: ["positions"],
    queryFn: () => repository.findAll(),
  });
}

export function usePosition(id: string) {
  return useQuery({
    queryKey: ["position", id],
    queryFn: () => repository.findById(id),
    enabled: !!id,
  });
}

export function useCreatePosition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PositionInsert) => repository.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["positions"] });
    },
  });
}

export function useUpdatePosition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PositionUpdate }) =>
      repository.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["positions"] });
      queryClient.invalidateQueries({ queryKey: ["position", id] });
    },
  });
}

export function useDeletePosition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => repository.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["positions"] });
    },
  });
}
