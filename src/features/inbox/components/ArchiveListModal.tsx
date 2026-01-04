import { motion, AnimatePresence } from "framer-motion";
import { X, Undo2, Trash2, Archive } from "lucide-react";
import { useArchivedInboxItems, useDeleteInboxItem, useUnarchiveInboxItem } from "../hooks/useInbox";
import { useState } from "react";
import { InboxItem } from "../api";

interface ArchiveListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ArchivedItem = ({ item }: { item: InboxItem }) => {
  const { mutate: deleteItem } = useDeleteInboxItem();
  const { mutate: unarchiveItem } = useUnarchiveInboxItem();
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <div className="flex items-center justify-between p-3 mb-2 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
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

export const ArchiveListModal = ({ isOpen, onClose }: ArchiveListModalProps) => {
  const { data: items, isLoading } = useArchivedInboxItems();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-xs z-40"
          />
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-md bg-neutral-900/90 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[60vh]"
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-2 text-white/90">
                <Archive size={20} className="text-orange-400" />
                <h3 className="font-semibold">Archive</h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
              {isLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-12 bg-white/5 animate-pulse rounded-xl" />
                  ))}
                </div>
              ) : items?.length === 0 ? (
                <div className="text-center py-10 text-white/40">
                  <Archive size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No archived items</p>
                </div>
              ) : (
                items?.map((item) => <ArchivedItem key={item.id} item={item} />)
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
