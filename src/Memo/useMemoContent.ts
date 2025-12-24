import { useState, useEffect } from "react";

const STORAGE_KEY = "memo-content";
const DEFAULT_CONTENT = "# My Memo\n\nStart writing...";

/**
 * Custom hook to manage memo content.
 * Handles persistence to localStorage to ensure notes are saved between sessions.
 *
 * @returns {Object} An object containing:
 * - `content`: The current markdown string.
 * - `setContent`: Function to update the markdown content.
 */
export function useMemoContent() {
  const [content, setContent] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || DEFAULT_CONTENT;
    } catch {
      return DEFAULT_CONTENT;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, content);
  }, [content]);

  return { content, setContent };
}
