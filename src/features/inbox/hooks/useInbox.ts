import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getInboxItems, createInboxItem, deleteInboxItem, InboxItem } from "../api";
import { useAuth } from "@/features/auth";

export const inboxKeys = {
  all: ["inbox"] as const,
};

export const useInboxItems = () => {
  return useQuery({
    queryKey: inboxKeys.all,
    queryFn: getInboxItems,
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
      await queryClient.cancelQueries({ queryKey: inboxKeys.all });
      const previousItems = queryClient.getQueryData<InboxItem[]>(inboxKeys.all);

      if (previousItems) {
        const optimisticItem: InboxItem = {
          id: "temp-" + Date.now(),
          content: newContent,
          created_at: new Date().toISOString(),
          user_id: session?.user?.id || "",
        };
        queryClient.setQueryData<InboxItem[]>(inboxKeys.all, [optimisticItem, ...previousItems]);
      }
      return { previousItems };
    },
    onError: (_err, _newTodo, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(inboxKeys.all, context.previousItems);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: inboxKeys.all });
    },
  });
};

export const useDeleteInboxItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteInboxItem,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: inboxKeys.all });
      const previousItems = queryClient.getQueryData<InboxItem[]>(inboxKeys.all);

      if (previousItems) {
        queryClient.setQueryData<InboxItem[]>(
          inboxKeys.all,
          previousItems.filter((item) => item.id !== id)
        );
      }
      return { previousItems };
    },
    onError: (_err, _id, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(inboxKeys.all, context.previousItems);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: inboxKeys.all });
    },
  });
};
