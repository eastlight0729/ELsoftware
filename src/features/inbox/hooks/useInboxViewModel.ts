import { useState, useCallback } from "react";
import { useInboxItems, useCreateInboxItem, useArchiveInboxItem, useUnarchiveInboxItem } from "./useInbox";

export const useInboxViewModel = () => {
  const { data: items, isLoading } = useInboxItems();
  const { mutate: createItem } = useCreateInboxItem();
  const { mutate: archiveItem } = useArchiveInboxItem();
  const { mutate: unarchiveItem } = useUnarchiveInboxItem();
  
  const [inputValue, setInputValue] = useState("");
  const [notificationState, setNotificationState] = useState<{ isOpen: boolean; itemId: string | null }>({ isOpen: false, itemId: null });
  const [isArchiveListOpen, setIsArchiveListOpen] = useState(false);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    createItem(inputValue.trim());
    setInputValue("");
  }, [createItem, inputValue]);

  const handleArchive = useCallback((id: string) => {
    archiveItem(id);
    setNotificationState({ isOpen: true, itemId: id });
  }, [archiveItem]);

  const handleUndoArchive = useCallback(() => {
    setNotificationState(prev => {
      if (prev.itemId) {
        unarchiveItem(prev.itemId);
        return { isOpen: false, itemId: null };
      }
      return prev;
    });
  }, [unarchiveItem]);

  const handleCloseNotification = useCallback(() => {
    setNotificationState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return {
    items,
    isLoading,
    inputValue,
    setInputValue,
    handleSubmit,
    handleArchive,
    handleUndoArchive,
    handleCloseNotification,
    notificationState,
    isArchiveListOpen,
    setIsArchiveListOpen,
  };
};
