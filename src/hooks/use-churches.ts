import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SupabaseChurchRepository } from "@/services/repositories/supabase-church-repository";
import type { ChurchInsert, ChurchUpdate } from "@/types/database";

const repository = new SupabaseChurchRepository();

export function useChurches() {
  return useQuery({
    queryKey: ["churches"],
    queryFn: () => repository.findAll(),
  });
}

export function useChurch(id: string) {
  return useQuery({
    queryKey: ["church", id],
    queryFn: () => repository.findById(id),
    enabled: !!id,
  });
}

export function useCreateChurch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ChurchInsert) => repository.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["churches"] });
    },
  });
}

export function useUpdateChurch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ChurchUpdate }) =>
      repository.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["churches"] });
      queryClient.invalidateQueries({ queryKey: ["church", id] });
    },
  });
}

export function useDeleteChurch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => repository.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["churches"] });
    },
  });
}
