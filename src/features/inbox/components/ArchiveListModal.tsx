import { motion, AnimatePresence } from "framer-motion";
import { X, Archive } from "lucide-react";
import { useArchivedInboxItems } from "../hooks/useInbox";
import { ArchivedItem } from "./ArchivedItem";

interface ArchiveListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

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
            className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[300px]"
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-2 text-white/90">
                <Archive size={20} className="text-white" />
                <h3 className="font-semibold">Archive</h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
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
