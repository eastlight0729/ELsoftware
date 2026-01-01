import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { memoService } from "../api/memoService";

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
  const queryClient = useQueryClient();
  const [content, setContentState] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || DEFAULT_CONTENT;
    } catch {
      return DEFAULT_CONTENT;
    }
  });

  const [hasSynced, setHasSynced] = useState(false);

  // Fetch from Supabase
  const { data: remoteMemo, isSuccess } = useQuery({
    queryKey: ["memo"],
    queryFn: memoService.getMemo,
    staleTime: 5 * 60 * 1000, // 5 minutes stale time to avoid aggressive overwrites
    retry: 1,
  });

  // Mutation to save
  const mutation = useMutation({
    mutationFn: memoService.saveMemo,
    onSuccess: (data) => {
      // Optional: Update query data silently
      queryClient.setQueryData(["memo"], data);
    },
    onError: (error) => {
      console.error("Failed to save memo:", error);
    },
  });

  // Sync Logic (Run once when remote data is available)
  useEffect(() => {
    if (isSuccess && !hasSynced) {
      if (remoteMemo?.content) {
        // Server has data, sync down
        console.log("Syncing memo from Supabase");
        setContentState(remoteMemo.content);
        localStorage.setItem(STORAGE_KEY, remoteMemo.content);
      } else if (!remoteMemo && content !== DEFAULT_CONTENT) {
        // Server empty, Local has data -> Migrate
        console.log("Migrating local memo to Supabase...");
        mutation.mutate(content);
      }
      setHasSynced(true);
    }
  }, [remoteMemo, isSuccess, hasSynced, content, mutation]);

  // Debounced Save
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const setContent = (newContent: string) => {
    setContentState(newContent);
    localStorage.setItem(STORAGE_KEY, newContent);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      mutation.mutate(newContent);
    }, 1000); // 1s debounce
  };

  return { content, setContent };
}
