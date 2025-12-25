import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createColumn, deleteColumn, getColumns, updateColumn } from "../api";
import { KanbanColumn, NewKanbanColumn } from "../types";

export const columnKeys = {
  all: ["columns"] as const,
};

export function useColumns() {
  return useQuery({
    queryKey: columnKeys.all,
    queryFn: getColumns,
  });
}

export function useCreateColumn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newColumn: NewKanbanColumn) => createColumn(newColumn),
    onMutate: async (newColumn) => {
      await queryClient.cancelQueries({ queryKey: columnKeys.all });
      const previousColumns = queryClient.getQueryData<KanbanColumn[]>(columnKeys.all);

      const optimisticColumn: KanbanColumn = {
        id: "temp-id-" + Date.now(),
        user_id: "temp-user",
        ...newColumn,
        created_at: new Date().toISOString(),
      };

      if (previousColumns) {
        queryClient.setQueryData<KanbanColumn[]>(columnKeys.all, [...previousColumns, optimisticColumn]);
      }

      return { previousColumns };
    },
    onError: (_err, _newColumn, context) => {
      if (context?.previousColumns) {
        queryClient.setQueryData(columnKeys.all, context.previousColumns);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: columnKeys.all });
    },
  });
}

export function useUpdateColumn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<KanbanColumn> }) => updateColumn(id, updates),
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: columnKeys.all });
      const previousColumns = queryClient.getQueryData<KanbanColumn[]>(columnKeys.all);

      if (previousColumns) {
        queryClient.setQueryData<KanbanColumn[]>(
          columnKeys.all,
          previousColumns.map((col) => (col.id === id ? { ...col, ...updates } : col))
        );
      }

      return { previousColumns };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousColumns) {
        queryClient.setQueryData(columnKeys.all, context.previousColumns);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: columnKeys.all });
    },
  });
}

export function useDeleteColumn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteColumn(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: columnKeys.all });
      const previousColumns = queryClient.getQueryData<KanbanColumn[]>(columnKeys.all);

      if (previousColumns) {
        queryClient.setQueryData<KanbanColumn[]>(
          columnKeys.all,
          previousColumns.filter((col) => col.id !== id)
        );
      }

      return { previousColumns };
    },
    onError: (_err, _id, context) => {
      if (context?.previousColumns) {
        queryClient.setQueryData(columnKeys.all, context.previousColumns);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: columnKeys.all });
    },
  });
}
