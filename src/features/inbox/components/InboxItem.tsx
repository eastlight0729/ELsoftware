import { Trash2 } from "lucide-react";
import { useDeleteInboxItem } from "../hooks/useInbox";
import type { InboxItem as InboxItemType } from "../api";

interface InboxItemProps {
  item: InboxItemType;
}

export const InboxItem = ({ item }: InboxItemProps) => {
  const { mutate: deleteItem } = useDeleteInboxItem();

  return (
    <div className="group flex items-center justify-between p-3 mb-2 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm transition-all hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-600">
      <span className="text-neutral-700 dark:text-neutral-200 text-base font-medium">{item.content}</span>
      <button
        onClick={() => deleteItem(item.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-neutral-400 hover:text-red-500 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg"
        aria-label="Delete item"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};
