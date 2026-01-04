import { DndContext, DragOverlay } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { Archive } from "lucide-react";
import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  useCards,
  useColumns,
  useCreateCard,
  useCreateColumn,
  useDeleteCard,
  useDeleteColumn,
  useListCarousel,
  useListDragDrop,
  useRestoreColumn,
  useUpdateCard,
  useUpdateColumn,
} from "../hooks";
import { UndoNotification } from "@/components/ui/UndoNotification";
import { ConfirmModal } from "./ConfirmModal";
import { ListArchiveModal } from "./ListArchiveModal";
import { ListCard } from "./ListCard";
import { ListCardModal } from "./ListCardModal";
import { ListColumn } from "./ListColumn";

export function ListBoard() {
  const { data: columnsData = [] } = useColumns();
  const columns = columnsData;
  const { data: cards = [] } = useCards();

  const { mutate: createColumn } = useCreateColumn();
  const { mutate: deleteColumn } = useDeleteColumn();
  const { mutate: restoreColumn } = useRestoreColumn();
  const { mutate: updateColumn } = useUpdateColumn();

  const { mutate: createCard } = useCreateCard();
  const { mutate: deleteCard } = useDeleteCard(); // Performs Archive
  const { mutate: updateCard } = useUpdateCard();

  const columnIds = useMemo(() => columns.map((col) => col.id), [columns]);

  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [deletingCardId, setDeletingCardId] = useState<string | null>(null);
  const [archivedColumnId, setArchivedColumnId] = useState<string | null>(null);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);

  // --- Hooks for Logic Extraction ---
  
  const {
    currentIndex,
    setCurrentIndex,
    columnsPerPage,
    swipeHandlers,
  } = useListCarousel({ columns, createColumn });

  const { 
    sensors, 
    activeColumn, 
    activeCard, 
    onDragStart, 
    onDragOver, 
    onDragEnd 
  } = useListDragDrop({
    columns,
    cards,
    updateColumn,
    updateCard,
  });

  // --- Handlers ---

  const handleCreateColumnAfter = (columnId: string) => {
    const index = columns.findIndex((c) => c.id === columnId);
    if (index === -1) return;

    const currentColumn = columns[index];
    const nextColumn = columns[index + 1];

    let newPosition = 0;
    if (nextColumn) {
      newPosition = (currentColumn.position + nextColumn.position) / 2;
    } else {
      newPosition = currentColumn.position + 1000;
    }

    createColumn(
      {
        title: "New Column",
        position: newPosition,
      },
      {
        onSuccess: () => {
          setCurrentIndex((prev) => prev + 1);
        },
      }
    );
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Header */}
      <header className="flex-none mb-8">
        <div className="w-full max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-md">Lists</h1>
            <p className="text-white/80 font-medium">Manage your workflow.</p>
          </div>
          <button
            onClick={() => setIsArchiveOpen(true)}
            className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all border border-white/10 shadow-lg hover:scale-105"
            title="Open Archive"
          >
            <Archive size={20} />
          </button>
        </div>
      </header>

      {/* Board Content (Carousel) */}
      <div className="flex-1 w-full relative overflow-hidden pb-0">
        <DndContext
          sensors={sensors}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragEnd={onDragEnd}
        >
          <div
            className="h-full w-full overflow-hidden touch-pan-y"
            {...swipeHandlers}
          >
            <div
              className="flex h-full transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
              style={{
                transform: `translateX(calc(-${currentIndex} * (100% / ${columnsPerPage})))`,
              }}
            >
              <SortableContext items={columnIds}>
                {columns.map((col) => (
                  <div
                    key={col.id}
                    style={{ flex: `0 0 calc(100% / ${columnsPerPage})` }}
                    className="h-full px-2"
                  >
                    <div className="h-full w-full">
                      <ListColumn
                        column={col}
                        cards={cards
                          .filter((c) => c.column_id === col.id)
                          .sort((a, b) => a.position - b.position)}
                        index={columns.indexOf(col)}
                        totalColumns={columns.length}
                        onDeleteColumn={(id) => {
                          deleteColumn(id);
                          setArchivedColumnId(id);
                        }}
                        onUpdateColumnTitle={(id, title) =>
                          updateColumn({ id, updates: { title } })
                        }
                        createCard={(columnId, content) => {
                          const colCards = cards.filter(
                            (c) => c.column_id === columnId
                          );
                          const maxPos =
                            colCards.length > 0
                              ? Math.max(...colCards.map((c) => c.position))
                              : 0;
                          createCard({
                            column_id: columnId,
                            content,
                            position: maxPos + 1000,
                          });
                        }}
                        onCreateColumnAfter={handleCreateColumnAfter}
                        onEditCardStart={setEditingCardId}
                        allowAddCard={true}
                      />
                    </div>
                  </div>
                ))}
              </SortableContext>
            </div>
          </div>

          {createPortal(
            <DragOverlay>
              {activeColumn && (
                <div className="h-full" style={{ width: 300 }}>
                  <ListColumn
                    column={activeColumn}
                    cards={cards
                      .filter((c) => c.column_id === activeColumn.id)
                      .sort((a, b) => a.position - b.position)}
                    index={columns.findIndex((c) => c.id === activeColumn.id)}
                    totalColumns={columns.length}
                    onDeleteColumn={() => {}}
                    onUpdateColumnTitle={() => {}}
                    createCard={() => {}}
                    onCreateColumnAfter={() => {}}
                    onEditCardStart={() => {}}
                  />
                </div>
              )}
              {activeCard && (
                <ListCard card={activeCard} onEditStart={() => {}} />
              )}
            </DragOverlay>,
            document.body
          )}

          <ListCardModal
            isOpen={!!editingCardId}
            card={cards.find((c) => c.id === editingCardId) || null}
            onSave={(id, updates) => updateCard({ id, updates })}
            onRemove={(id) => {
              setEditingCardId(null);
              setDeletingCardId(id);
            }}
            onClose={() => setEditingCardId(null)}
          />

          <ConfirmModal
            isOpen={!!deletingCardId}
            title="Archive Card"
            message="Are you sure you want to archive this card? It will be moved to the Archived Items."
            onConfirm={() => {
              if (deletingCardId) {
                deleteCard(deletingCardId);
                setDeletingCardId(null);
              }
            }}
            onCancel={() => setDeletingCardId(null)}
            confirmLabel="Archive"
          />
        </DndContext>
      </div>

      <ListArchiveModal
        isOpen={isArchiveOpen}
        onClose={() => setIsArchiveOpen(false)}
      />

      <UndoNotification
        isOpen={!!archivedColumnId}
        message="Column archived"
        onUndo={() => {
          if (archivedColumnId) {
            restoreColumn(archivedColumnId);
            setArchivedColumnId(null);
          }
        }}
        onClose={() => setArchivedColumnId(null)}
      />
    </div>
  );
}
