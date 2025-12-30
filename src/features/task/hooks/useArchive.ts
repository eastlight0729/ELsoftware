import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getArchivedCards,
  getArchivedColumns,
  restoreCard,
  restoreColumn,
  hardDeleteCard,
  hardDeleteColumn,
} from "../api";
import { ArchivedKanbanCard, KanbanColumn } from "../types";
import { cardKeys } from "./useCards";
import { columnKeys } from "./useColumns";

export const archiveKeys = {
  cards: ["archived-cards"] as const,
  columns: ["archived-columns"] as const,
};

export function useArchivedCards() {
  return useQuery({
    queryKey: archiveKeys.cards,
    queryFn: getArchivedCards,
  });
}

export function useArchivedColumns() {
  return useQuery({
    queryKey: archiveKeys.columns,
    queryFn: getArchivedColumns,
  });
}

export function useRestoreCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: restoreCard,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: archiveKeys.cards });
      await queryClient.cancelQueries({ queryKey: cardKeys.all });

      const prevArchived = queryClient.getQueryData<ArchivedKanbanCard[]>(archiveKeys.cards);

      if (prevArchived) {
        queryClient.setQueryData<ArchivedKanbanCard[]>(
          archiveKeys.cards,
          prevArchived.filter((c) => c.id !== id)
        );
      }

      // Optimistically add to active cards?
      // We assume it's restored. But we don't have the full card object with deleted_at = null here easily
      // without transforming the archived card.
      const cardToRestore = prevArchived?.find((c) => c.id === id);
      if (cardToRestore) {
        // const { kanban_columns, ...rest } = cardToRestore;
        // Add to active cards list
        /* 
           Note: We might not want to optimistically update the active list if it's complex, 
           Invalidate is safer here as we are moving between lists.
        */
      }

      return { prevArchived };
    },
    onError: (_err, _id, context) => {
      if (context?.prevArchived) {
        queryClient.setQueryData(archiveKeys.cards, context.prevArchived);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: archiveKeys.cards });
      queryClient.invalidateQueries({ queryKey: cardKeys.all });
    },
  });
}

export function useHardDeleteCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: hardDeleteCard,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: archiveKeys.cards });
      const prevArchived = queryClient.getQueryData<ArchivedKanbanCard[]>(archiveKeys.cards);

      if (prevArchived) {
        queryClient.setQueryData<ArchivedKanbanCard[]>(
          archiveKeys.cards,
          prevArchived.filter((c) => c.id !== id)
        );
      }

      return { prevArchived };
    },
    onError: (_err, _id, context) => {
      if (context?.prevArchived) {
        queryClient.setQueryData(archiveKeys.cards, context.prevArchived);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: archiveKeys.cards });
    },
  });
}

export function useRestoreColumn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: restoreColumn,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: archiveKeys.columns });
      await queryClient.cancelQueries({ queryKey: columnKeys.all });

      const prevArchived = queryClient.getQueryData<KanbanColumn[]>(archiveKeys.columns);

      if (prevArchived) {
        queryClient.setQueryData<KanbanColumn[]>(
          archiveKeys.columns,
          prevArchived.filter((c) => c.id !== id)
        );
      }

      return { prevArchived };
    },
    onError: (_err, _id, context) => {
      if (context?.prevArchived) {
        queryClient.setQueryData(archiveKeys.columns, context.prevArchived);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: archiveKeys.columns });
      queryClient.invalidateQueries({ queryKey: columnKeys.all });
      // Also invalidate cards because hidden cards in this column might now be visible?
      // Actually my getCards logic might filter based on column existence if I did a join, but I am not.
      // Active cards in an archived column are still fetched by getCards (deleted_at is null).
      // They are just filtered out by UI because the column isn't in the columns list.
      // So once the column reappears in columns list, the cards should appear.
    },
  });
}

export function useHardDeleteColumn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: hardDeleteColumn,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: archiveKeys.columns });
      const prevArchived = queryClient.getQueryData<KanbanColumn[]>(archiveKeys.columns);

      if (prevArchived) {
        queryClient.setQueryData<KanbanColumn[]>(
          archiveKeys.columns,
          prevArchived.filter((c) => c.id !== id)
        );
      }

      return { prevArchived };
    },
    onError: (_err, _id, context) => {
      if (context?.prevArchived) {
        queryClient.setQueryData(archiveKeys.columns, context.prevArchived);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: archiveKeys.columns });
      // Hard delete column also deletes cards (cascade).
      // We should invalidate archive cards too, in case some were from this column?
      // "System checks for cards inside... Cascading Hard Delete".
      // If the column was archived, its cards were hidden (active).
      // But they are not in "archived cards" list (since they are active).
      // So we don't need to invalidate archived cards list unless we support mixed states.
    },
  });
}
