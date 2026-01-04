import { memo } from "react";
import { Trash2 } from "lucide-react";
import { useDeleteInboxItem } from "../hooks/useInbox";
import type { InboxItem as InboxItemType } from "../api";

interface InboxItemProps {
  item: InboxItemType;
}

export const InboxItem = memo(({ item }: InboxItemProps) => {
  const { mutate: deleteItem } = useDeleteInboxItem();

  return (
    <div className="group flex items-center justify-between p-3 mb-2 bg-white/20 backdrop-blur-xl rounded-xl border border-white/30 shadow-sm transition-all hover:shadow-md hover:border-white/50 hover:bg-white/30">
      <span className="text-white text-base font-medium drop-shadow-sm">{item.content}</span>
      <button
        onClick={() => deleteItem(item.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-white/70 hover:text-red-100 hover:bg-white/20 rounded-lg"
        aria-label="Delete item"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
});

InboxItem.displayName = "InboxItem";
