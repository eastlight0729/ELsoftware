import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/features/auth";

const SETTINGS_KEY = "user-settings";

export function useBackground() {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const userId = session?.user?.id;

  const { data: settings } = useQuery({
    queryKey: [SETTINGS_KEY, userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from("user_settings")
        .select("background_path")
        .eq("user_id", userId)
        .maybeSingle(); // Use maybeSingle to avoid 406 error if 0 rows
      
      if (error) {
        console.error("Error fetching settings:", error);
        throw error;
      }
      return data;
    },
    enabled: !!userId,
    staleTime: Infinity, // Settings rarely change
  });

  const mutation = useMutation({
    mutationFn: async (path: string) => {
      if (!userId) throw new Error("User not authenticated");
      
      const { error } = await supabase
        .from("user_settings")
        .upsert({ 
          user_id: userId, 
          background_path: path,
          updated_at: new Date().toISOString()
        });
        
      if (error) throw error;
    },
    onMutate: async (newPath) => {
      await queryClient.cancelQueries({ queryKey: [SETTINGS_KEY, userId] });
      const previousSettings = queryClient.getQueryData([SETTINGS_KEY, userId]);
      
      // Optimistic update
      queryClient.setQueryData([SETTINGS_KEY, userId], { background_path: newPath });
      
      return { previousSettings };
    },
    onError: (err, _newPath, context) => {
        console.error("Failed to save background:", err);
        if (context?.previousSettings) {
            queryClient.setQueryData([SETTINGS_KEY, userId], context.previousSettings);
        }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [SETTINGS_KEY, userId] });
    },
  });

  return {
    backgroundPath: settings?.background_path || "",
    setBackgroundPath: (path: string) => mutation.mutate(path),
  };
}
