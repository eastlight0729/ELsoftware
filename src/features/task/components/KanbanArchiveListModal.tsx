import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, RotateCcw, Trash2, Archive, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  useArchivedCards,
  useArchivedColumns,
  useRestoreCard,
  useRestoreColumn,
  useHardDeleteCard,
  useHardDeleteColumn,
} from "../hooks";
import { ArchivedKanbanCard, KanbanColumn } from "../types";
import { ConfirmModal } from "./ConfirmModal";

interface KanbanArchiveListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KanbanArchiveListModal = ({ isOpen, onClose }: KanbanArchiveListModalProps) => {
  const [activeTab, setActiveTab] = useState<"cards" | "columns">("cards");
  // Logic for confirm delete
  const [confirmDelete, setConfirmDelete] = useState<{
    type: "card" | "column";
    id: string;
  } | null>(null);

  // Data Hooks
  const { data: archivedCards = [], isLoading: isLoadingCards } = useArchivedCards();
  const { data: archivedColumns = [], isLoading: isLoadingColumns } = useArchivedColumns();

  // Mutation Hooks
  const { mutate: restoreCard } = useRestoreCard();
  const { mutate: restoreColumn } = useRestoreColumn();
  const { mutate: hardDeleteCard } = useHardDeleteCard();
  const { mutate: hardDeleteColumn } = useHardDeleteColumn();

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRestoreCard = (card: ArchivedKanbanCard) => {
    // Check Parent Column Logic
    if (!card.kanban_columns) {
      showToast("Error: Parent Column no longer exists.");
      return;
    }

    if (card.kanban_columns?.deleted_at) {
      showToast("Error: Parent Column is archived. Restore it first.");
      return;
    }

    restoreCard(card.id, {
      onSuccess: () => showToast(`Card restored to "${card.kanban_columns!.title}"`),
    });
  };

  const handleRestoreColumn = (column: KanbanColumn) => {
    restoreColumn(column.id, {
      onSuccess: () => showToast(`Column "${column.title}" restored`),
    });
  };

  const isLoading = isLoadingCards || isLoadingColumns;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/20 backdrop-blur-xs z-40"
            />
            {/* Modal */}
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col h-[500px]"
            >
              {/* Header */}
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

              {/* Tabs */}
              <div className="flex p-3 gap-2 border-b border-white/10">
                <button
                  onClick={() => setActiveTab("cards")}
                  className={cn(
                    "flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all relative overflow-hidden",
                    activeTab === "cards"
                      ? "text-white bg-white/20 shadow-sm"
                      : "text-white/60 hover:text-white hover:bg-white/10"
                  )}
                >
                  Cards <span className="text-xs opacity-70 ml-1">({archivedCards.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab("columns")}
                  className={cn(
                    "flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all relative overflow-hidden",
                    activeTab === "columns"
                      ? "text-white bg-white/20 shadow-sm"
                      : "text-white/60 hover:text-white hover:bg-white/10"
                  )}
                >
                  Columns <span className="text-xs opacity-70 ml-1">({archivedColumns.length})</span>
                </button>
              </div>

              {/* List Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                {isLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-12 bg-white/5 animate-pulse rounded-xl" />
                    ))}
                  </div>
                ) : activeTab === "cards" ? (
                    archivedCards.length === 0 ? (
                      <EmptyState message="No archived cards" />
                    ) : (
                      archivedCards.map((card: ArchivedKanbanCard) => (
                        <div
                          key={card.id}
                          className="group bg-white/5 border border-white/10 p-3 rounded-2xl flex items-start justify-between hover:bg-white/10 hover:border-white/20 transition-all"
                        >
                          <div className="min-w-0 flex-1 mr-3">
                            <h3 className="font-medium text-white truncate">{card.content}</h3>
                            <div className="flex items-center gap-2 text-xs text-white/50 mt-1">
                              <span className="bg-white/10 px-1.5 py-0.5 rounded truncate max-w-[120px]">
                                {card.kanban_columns?.title || "Unknown"}
                              </span>
                              <span>•</span>
                              {card.deleted_at && <span>{format(new Date(card.deleted_at), "MMM d")}</span>}
                            </div>
                          </div>
                          <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleRestoreCard(card)}
                              title="Restore"
                              className="p-1.5 text-white/60 hover:text-green-400 hover:bg-white/10 rounded-lg transition-colors"
                            >
                              <RotateCcw size={16} />
                            </button>
                            <button
                              onClick={() => setConfirmDelete({ type: "card", id: card.id })}
                              title="Permanently Delete"
                              className="p-1.5 text-white/60 hover:text-red-400 hover:bg-white/10 rounded-lg transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))
                    )
                ) : (
                    archivedColumns.length === 0 ? (
                        <EmptyState message="No archived columns" />
                      ) : (
                        archivedColumns.map((col) => (
                          <div
                            key={col.id}
                            className="group bg-white/5 border border-white/10 p-3 rounded-2xl flex items-start justify-between hover:bg-white/10 hover:border-white/20 transition-all"
                          >
                            <div className="min-w-0 flex-1 mr-3">
                              <h3 className="font-medium text-white truncate">{col.title}</h3>
                              <div className="text-xs text-white/50 mt-1">
                                {col.deleted_at && format(new Date(col.deleted_at), "MMM d")}
                              </div>
                            </div>
                            <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleRestoreColumn(col)}
                                title="Restore"
                                className="p-1.5 text-white/60 hover:text-green-400 hover:bg-white/10 rounded-lg transition-colors"
                              >
                                <RotateCcw size={16} />
                              </button>
                              <button
                                onClick={() => setConfirmDelete({ type: "column", id: col.id })}
                                title="Permanently Delete"
                                className="p-1.5 text-white/60 hover:text-red-400 hover:bg-white/10 rounded-lg transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))
                      )
                )}
              </div>

               {/* Toast Notification (Inside Modal or Portal? Inside is fine if strictly related) */}
               {/* Just displaying it absolute at the bottom of the modal */}
               <AnimatePresence>
                {toastMessage && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] bg-neutral-900/90 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 backdrop-blur-md border border-white/10 z-60"
                  >
                    <AlertCircle size={18} className="text-green-400" />
                    <span className="text-sm font-medium">{toastMessage}</span>
                  </motion.div>
                )}
               </AnimatePresence>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={!!confirmDelete}
        title={confirmDelete?.type === "card" ? "Delete Card Permanently?" : "Delete Column Permanently?"}
        message={
          confirmDelete?.type === "card"
            ? "Are you sure you want to delete this card? This action cannot be undone."
            : "Are you sure? This will permanently delete this column AND all cards inside it. This cannot be undone."
        }
        onConfirm={() => {
          if (confirmDelete) {
            if (confirmDelete.type === "card") {
              hardDeleteCard(confirmDelete.id);
            } else {
              hardDeleteColumn(confirmDelete.id);
            }
            setConfirmDelete(null);
          }
        }}
        onCancel={() => setConfirmDelete(null)}
        isDestructive
        confirmLabel="Permanently Delete"
      />
    </>
  );
};

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-48 text-white/40">
      <Archive size={32} className="mb-2 opacity-50" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
