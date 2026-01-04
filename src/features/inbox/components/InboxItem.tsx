import { memo, useState } from "react";
import { Trash2 } from "lucide-react";
import { useDeleteInboxItem, useUpdateInboxItem } from "../hooks/useInbox";
import type { InboxItem as InboxItemType } from "../api";

interface InboxItemProps {
  item: InboxItemType;
}

export const InboxItem = memo(({ item }: InboxItemProps) => {
  const { mutate: deleteItem } = useDeleteInboxItem();
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
    <div className="group flex items-center justify-between p-3 mb-2 bg-white/20 backdrop-blur-xl rounded-xl border border-white/30 shadow-sm transition-all hover:shadow-md hover:border-white/50 hover:bg-white/30">
      {isEditing ? (
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          autoFocus
          className="flex-1 bg-transparent text-white text-base font-medium outline-none border-b border-white/50 pb-1 mr-4 placeholder:text-white/50"
        />
      ) : (
        <span 
          onClick={() => setIsEditing(true)}
          className="flex-1 text-white text-base font-medium drop-shadow-sm cursor-text truncate pr-4"
        >
          {item.content}
        </span>
      )}
      <button
        onClick={() => deleteItem(item.id)}
        className="p-2 text-white/70 hover:text-red-100 hover:bg-white/20 rounded-lg transition-colors shrink-0"
        aria-label="Delete item"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
});

InboxItem.displayName = "InboxItem";
