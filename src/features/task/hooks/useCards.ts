import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCard, deleteCard, getCards, updateCard } from "../api";
import { KanbanCard, NewKanbanCard } from "../types";

export const cardKeys = {
  all: ["cards"] as const,
};

export function useCards() {
  return useQuery({
    queryKey: cardKeys.all,
    queryFn: getCards,
  });
}

export function useCreateCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newCard: NewKanbanCard) => createCard(newCard),
    onMutate: async (newCard) => {
      await queryClient.cancelQueries({ queryKey: cardKeys.all });
      const previousCards = queryClient.getQueryData<KanbanCard[]>(cardKeys.all);

      const optimisticCard: KanbanCard = {
        id: "temp-id-" + Date.now(),
        user_id: "temp-user",
        ...newCard,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (previousCards) {
        queryClient.setQueryData<KanbanCard[]>(cardKeys.all, [...previousCards, optimisticCard]);
      }

      return { previousCards };
    },
    onError: (_err, _newCard, context) => {
      if (context?.previousCards) {
        queryClient.setQueryData(cardKeys.all, context.previousCards);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cardKeys.all });
    },
  });
}

export function useUpdateCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<KanbanCard> }) => updateCard(id, updates),
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: cardKeys.all });
      const previousCards = queryClient.getQueryData<KanbanCard[]>(cardKeys.all);

      if (previousCards) {
        queryClient.setQueryData<KanbanCard[]>(
          cardKeys.all,
          previousCards.map((card) => (card.id === id ? { ...card, ...updates } : card))
        );
      }

      return { previousCards };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousCards) {
        queryClient.setQueryData(cardKeys.all, context.previousCards);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cardKeys.all });
    },
  });
}

export function useDeleteCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCard(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: cardKeys.all });
      const previousCards = queryClient.getQueryData<KanbanCard[]>(cardKeys.all);

      if (previousCards) {
        queryClient.setQueryData<KanbanCard[]>(
          cardKeys.all,
          previousCards.filter((card) => card.id !== id)
        );
      }

      return { previousCards };
    },
    onError: (_err, _id, context) => {
      if (context?.previousCards) {
        queryClient.setQueryData(cardKeys.all, context.previousCards);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cardKeys.all });
    },
  });
}
