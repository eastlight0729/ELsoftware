import { useState } from "react";
import { Undo2, Trash2 } from "lucide-react";
import { useDeleteInboxItem, useUnarchiveInboxItem } from "../hooks/useInbox";
import { InboxItem } from "../api";

export const ArchivedItem = ({ item }: { item: InboxItem }) => {
  const { mutate: deleteItem } = useDeleteInboxItem();
  const { mutate: unarchiveItem } = useUnarchiveInboxItem();
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <div className="flex items-center justify-between p-3 mb-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/20 transition-colors">
      <span className="text-white/80 text-sm truncate flex-1 pr-4">{item.content}</span>
      
      <div className="flex items-center gap-2 shrink-0">
        {isDeleting ? (
          <>
            <button
              onClick={() => setIsDeleting(false)}
              className="px-3 py-1.5 text-xs font-medium text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => deleteItem(item.id)}
              className="px-3 py-1.5 text-xs font-medium text-red-400 hover:text-red-300 bg-red-400/10 hover:bg-red-400/20 rounded-lg transition-colors"
            >
              Delete
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => unarchiveItem(item.id)}
              className="p-2 text-white/50 hover:text-sky-400 hover:bg-white/10 rounded-lg transition-colors"
              title="Put back to inbox"
            >
              <Undo2 size={16} />
            </button>
            <button
              onClick={() => setIsDeleting(true)}
              className="p-2 text-white/50 hover:text-red-400 hover:bg-white/10 rounded-lg transition-colors"
              title="Delete permanently"
            >
              <Trash2 size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};
