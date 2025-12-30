import { useState } from "react";
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

interface ArchiveDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ArchiveDrawer({ isOpen, onClose }: ArchiveDrawerProps) {
  const [activeTab, setActiveTab] = useState<"cards" | "columns">("cards");
  const [confirmDelete, setConfirmDelete] = useState<{
    type: "card" | "column";
    id: string;
    count?: number; // for cascading delete warning
  } | null>(null);

  const { data: archivedCards = [] } = useArchivedCards();
  const { data: archivedColumns = [] } = useArchivedColumns();

  const { mutate: restoreCard } = useRestoreCard();
  const { mutate: restoreColumn } = useRestoreColumn();
  const { mutate: hardDeleteCard } = useHardDeleteCard();
  const { mutate: hardDeleteColumn } = useHardDeleteColumn();

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

  // Removed unused getCascadingCount logic for now as it was causing lints and not fully implemented
  // logic can be added later if strict counting is required.

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-[400px] z-50 bg-white dark:bg-neutral-900 shadow-2xl border-l border-neutral-200 dark:border-neutral-700 flex flex-col transform transition-transform duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center gap-2">
            <Archive className="text-neutral-500" size={20} />
            <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100">Archived Items</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex p-4 gap-2">
          <button
            onClick={() => setActiveTab("cards")}
            className={cn(
              "flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors",
              activeTab === "cards"
                ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                : "text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
            )}
          >
            Cards ({archivedCards.length})
          </button>
          <button
            onClick={() => setActiveTab("columns")}
            className={cn(
              "flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors",
              activeTab === "columns"
                ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                : "text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
            )}
          >
            Columns ({archivedColumns.length})
          </button>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
          {activeTab === "cards" ? (
            archivedCards.length === 0 ? (
              <EmptyState message="No archived cards" />
            ) : (
              archivedCards.map((card: ArchivedKanbanCard) => (
                <div
                  key={card.id}
                  className="bg-white dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 p-3 rounded-lg flex items-start justify-between group hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
                >
                  <div className="min-w-0 flex-1 mr-3">
                    <h3 className="font-medium text-neutral-800 dark:text-neutral-200 truncate">{card.content}</h3>
                    <div className="flex items-center gap-2 text-xs text-neutral-500 mt-1">
                      <span className="bg-neutral-100 dark:bg-neutral-700 px-1.5 py-0.5 rounded truncate max-w-[120px]">
                        {card.kanban_columns?.title || "Unknown Column"}
                      </span>
                      <span>•</span>
                      {card.deleted_at && <span>{format(new Date(card.deleted_at), "MMM d, h:mm a")}</span>}
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => handleRestoreCard(card)}
                      title="Restore"
                      className="p-1.5 text-neutral-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors"
                    >
                      <RotateCcw size={16} />
                    </button>
                    <button
                      onClick={() => setConfirmDelete({ type: "card", id: card.id })}
                      title="Permanently Delete"
                      className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )
          ) : archivedColumns.length === 0 ? (
            <EmptyState message="No archived columns" />
          ) : (
            archivedColumns.map((col) => (
              <div
                key={col.id}
                className="bg-white dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 p-3 rounded-lg flex items-start justify-between group hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
              >
                <div className="min-w-0 flex-1 mr-3">
                  <h3 className="font-medium text-neutral-800 dark:text-neutral-200 truncate">{col.title}</h3>
                  <div className="text-xs text-neutral-500 mt-1">
                    {col.deleted_at && format(new Date(col.deleted_at), "MMM d, h:mm a")}
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => handleRestoreColumn(col)}
                    title="Restore"
                    className="p-1.5 text-neutral-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors"
                  >
                    <RotateCcw size={16} />
                  </button>
                  <button
                    onClick={() => setConfirmDelete({ type: "column", id: col.id })}
                    title="Permanently Delete"
                    className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Toast Notification */}
        {toastMessage && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[350px] bg-neutral-800 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom-5 fade-in duration-300 z-50">
            <AlertCircle size={18} className="text-green-400" />
            <span className="text-sm font-medium">{toastMessage}</span>
          </div>
        )}
      </div>

      {/* Logic for Cascading Warning */}
      {/* We need active cards to count cascade. 
          Actually, we can just say "This will permanently delete this column and ALL cards inside it." 
          getting the exact count is nice but not strictly required if costly. 
      */}

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
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-48 text-neutral-400">
      <Archive size={32} className="mb-2 opacity-20" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
