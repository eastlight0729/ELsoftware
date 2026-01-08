import { memo, useState } from "react";
import { Archive, FolderInput } from "lucide-react";
import { useUpdateInboxItem } from "../hooks/useInbox";
import type { InboxItem as InboxItemType } from "../api";
import { ItemCard, ItemCardContent, ItemCardActionButton } from "@/components/ui/ItemCard";

interface InboxItemProps {
  item: InboxItemType;
  onArchive: (id: string) => void;
}

export const InboxItem = memo(({ item, onArchive }: InboxItemProps) => {
  const { mutate: updateItem } = useUpdateInboxItem();
  
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(item.content);

  const handleSave = () => {
    if (inputValue.trim() && inputValue !== item.content) {
      updateItem({ id: item.id, content: inputValue.trim() });
    } else {
      setInputValue(item.content); // Reset if empty or unchanged
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setInputValue(item.content);
      setIsEditing(false);
    }
  };

  return (
    <ItemCard
      actions={
        <>
          <ItemCardActionButton
            variant="info"
            title="Move to..."
            onClick={() => {}}
          >
            <FolderInput size={18} />
          </ItemCardActionButton>
          <ItemCardActionButton
            variant="danger"
            title="Archive"
            onClick={() => onArchive(item.id)}
          >
            <Archive size={18} />
          </ItemCardActionButton>
        </>
      }
    >
      {isEditing ? (
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          autoFocus
          className="w-full bg-transparent text-sm text-white/90 font-medium outline-none border-b border-white/50 pb-1 placeholder:text-white/50"
        />
      ) : (
        <ItemCardContent
          onClick={() => setIsEditing(true)}
          className="cursor-text"
        >
          {item.content}
        </ItemCardContent>
      )}
    </ItemCard>
  );
});

InboxItem.displayName = "InboxItem";
