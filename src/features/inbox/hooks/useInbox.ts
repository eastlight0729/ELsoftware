import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getInboxItems,
  getArchivedInboxItems,
  createInboxItem,
  deleteInboxItem,
  updateInboxItem,
  archiveInboxItem,
  unarchiveInboxItem,
  InboxItem,
} from "../api";
import { useAuth } from "@/features/auth";

export const inboxKeys = {
  all: ["inbox"] as const,
  active: ["inbox", "active"] as const,
  archived: ["inbox", "archived"] as const,
};

export const useInboxItems = () => {
  return useQuery({
    queryKey: inboxKeys.active,
    queryFn: getInboxItems,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useArchivedInboxItems = () => {
  return useQuery({
    queryKey: inboxKeys.archived,
    queryFn: getArchivedInboxItems,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateInboxItem = () => {
  const queryClient = useQueryClient();
  const { session } = useAuth();

  return useMutation({
    mutationFn: (content: string) => {
      if (!session?.user?.id) throw new Error("User not authenticated");
      return createInboxItem({ content, userId: session.user.id });
    },
    onMutate: async (newContent) => {
      await queryClient.cancelQueries({ queryKey: inboxKeys.active });
      const previousItems = queryClient.getQueryData<InboxItem[]>(inboxKeys.active);

      if (previousItems) {
        const optimisticItem: InboxItem = {
          id: "temp-" + Date.now(),
          content: newContent,
          created_at: new Date().toISOString(),
          user_id: session?.user?.id || "",
          archived_at: null,
        };
        queryClient.setQueryData<InboxItem[]>(inboxKeys.active, [optimisticItem, ...previousItems]);
      }
      return { previousItems };
    },
    onError: (_err, _newTodo, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(inboxKeys.active, context.previousItems);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: inboxKeys.active });
    },
  });
};

export const useDeleteInboxItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteInboxItem,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: inboxKeys.archived });
      const previousItems = queryClient.getQueryData<InboxItem[]>(inboxKeys.archived);

      if (previousItems) {
        queryClient.setQueryData<InboxItem[]>(
          inboxKeys.archived,
          previousItems.filter((item) => item.id !== id)
        );
      }
      return { previousItems };
    },
    onError: (_err, _id, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(inboxKeys.archived, context.previousItems);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: inboxKeys.archived });
    },
  });
};

export const useArchiveInboxItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: archiveInboxItem,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: inboxKeys.active });
      await queryClient.cancelQueries({ queryKey: inboxKeys.archived });

      const previousActive = queryClient.getQueryData<InboxItem[]>(inboxKeys.active);
      const previousArchived = queryClient.getQueryData<InboxItem[]>(inboxKeys.archived);

      // Remove from active
      if (previousActive) {
        queryClient.setQueryData<InboxItem[]>(
          inboxKeys.active,
          previousActive.filter((item) => item.id !== id)
        );
      }

      // Add to archived (optimistic)
      const cachedItem = previousActive?.find((item) => item.id === id);
      if (cachedItem) {
        const archivedItem = { ...cachedItem, archived_at: new Date().toISOString() };
        if (previousArchived) {
          queryClient.setQueryData<InboxItem[]>(inboxKeys.archived, [archivedItem, ...previousArchived]);
        } else {
          queryClient.setQueryData<InboxItem[]>(inboxKeys.archived, [archivedItem]);
        }
      }

      return { previousActive, previousArchived };
    },
    onError: (_err, _id, context) => {
      if (context?.previousActive) {
        queryClient.setQueryData(inboxKeys.active, context.previousActive);
      }
      if (context?.previousArchived) {
        queryClient.setQueryData(inboxKeys.archived, context.previousArchived);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: inboxKeys.active });
      queryClient.invalidateQueries({ queryKey: inboxKeys.archived });
    },
  });
};

export const useUnarchiveInboxItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unarchiveInboxItem,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: inboxKeys.active });
      await queryClient.cancelQueries({ queryKey: inboxKeys.archived });

      const previousActive = queryClient.getQueryData<InboxItem[]>(inboxKeys.active);
      const previousArchived = queryClient.getQueryData<InboxItem[]>(inboxKeys.archived);

      // Remove from archived
      if (previousArchived) {
        queryClient.setQueryData<InboxItem[]>(
          inboxKeys.archived,
          previousArchived.filter((item) => item.id !== id)
        );
      }

      // Add to active (optimistic)
      const cachedItem = previousArchived?.find((item) => item.id === id);
      if (cachedItem) {
        const unarchivedItem = { ...cachedItem, archived_at: null };
        if (previousActive) {
          const newActive = [unarchivedItem, ...previousActive].sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
          queryClient.setQueryData<InboxItem[]>(inboxKeys.active, newActive);
        } else {
          queryClient.setQueryData<InboxItem[]>(inboxKeys.active, [unarchivedItem]);
        }
      }

      return { previousActive, previousArchived };
    },
    onError: (_err, _id, context) => {
      if (context?.previousActive) {
        queryClient.setQueryData(inboxKeys.active, context.previousActive);
      }
      if (context?.previousArchived) {
        queryClient.setQueryData(inboxKeys.archived, context.previousArchived);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: inboxKeys.active });
      queryClient.invalidateQueries({ queryKey: inboxKeys.archived });
    },
  });
};

export const useUpdateInboxItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateInboxItem,
    onMutate: async ({ id, content }) => {
      await queryClient.cancelQueries({ queryKey: inboxKeys.active });
      const previousItems = queryClient.getQueryData<InboxItem[]>(inboxKeys.active);

      if (previousItems) {
        queryClient.setQueryData<InboxItem[]>(
          inboxKeys.active,
          previousItems.map((item) => (item.id === id ? { ...item, content } : item))
        );
      }
      return { previousItems };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(inboxKeys.active, context.previousItems);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: inboxKeys.active });
    },
  });
};
