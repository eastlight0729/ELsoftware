import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { memoService } from "../api/memoService";
import { useAuth } from "../../auth/hooks/useAuth";

const STORAGE_KEY = "memo-content";
const DEFAULT_CONTENT = "# My Memo\n\nStart writing...";

/**
 * Custom hook to manage memo content with Supabase synchronization.
 * Migration Logic:
 * 1. Loads from localStorage initially (Local-First).
 * 2. Fetches from Supabase.
 * 3. If Supabase has data, overrides local (Server Truth).
 * 4. If Supabase is empty but local has data, uploads local (Migration).
 * 5. Debounces saves to Supabase.
 */
export function useMemoContent() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [content, setContentState] = useState<string>(DEFAULT_CONTENT);
  const [hasLoadedLocal, setHasLoadedLocal] = useState(false);
  const [hasSynced, setHasSynced] = useState(false);

  // Derived key based on user ID
  const storageKey = user ? `${STORAGE_KEY}-${user.id}` : null;

  // Reset state when user changes to prevent cross-user pollution if component stays mounted
  useEffect(() => {
    setHasSynced(false);
    setHasLoadedLocal(false);
    // content will be re-populated by the LocalStorage loader effect or Sync effect
    setContentState(DEFAULT_CONTENT);
  }, [user?.id]);

  // Load from LocalStorage when user/storageKey becomes available
  useEffect(() => {
    if (storageKey) {
      try {
        const local = localStorage.getItem(storageKey);
        if (local) {
          setContentState(local);
        }
      } catch (e) {
        console.error("Error loading memo from storage", e);
      }
      setHasLoadedLocal(true);
    }
  }, [storageKey]);

  // Fetch from Supabase
  const { data: remoteMemo, isSuccess } = useQuery({
    queryKey: ["memo", user?.id],
    queryFn: memoService.getMemo,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    enabled: !!user, // Only fetch if user is authenticated
  });

  // Mutation to save
  const mutation = useMutation({
    mutationFn: memoService.saveMemo,
    onSuccess: (data) => {
      if (user) {
        queryClient.setQueryData(["memo", user.id], data);
      }
    },
    onError: (error) => {
      console.error("Failed to save memo:", error);
    },
  });

  // Sync Logic
  useEffect(() => {
    // Only proceed if we've attempted to load local data and remote fetch is done
    if (isSuccess && hasLoadedLocal && !hasSynced && storageKey) {
      if (remoteMemo?.content) {
        // Server has data, sync down (Server Truth)
        console.log("Syncing memo from Supabase");
        setContentState(remoteMemo.content);
        localStorage.setItem(storageKey, remoteMemo.content);
      } else if (!remoteMemo && content !== DEFAULT_CONTENT) {
        // Server empty, Local has data -> Migrate
        console.log("Migrating local memo to Supabase...");
        mutation.mutate(content);
      }
      setHasSynced(true);
    }
  }, [remoteMemo, isSuccess, hasSynced, content, mutation, hasLoadedLocal, storageKey]);

  // Debounced Save
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const setContent = (newContent: string) => {
    setContentState(newContent);
    if (storageKey) {
      localStorage.setItem(storageKey, newContent);
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      mutation.mutate(newContent);
    }, 1000); // 1s debounce
  };

  return { content, setContent };
}
