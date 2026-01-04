import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { Plus, Archive, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  useCards,
  useColumns,
  useCreateCard,
  useCreateColumn,
  useDeleteCard,
  useDeleteColumn,
  useUpdateCard,
  useUpdateColumn,
} from "../hooks";
import { KanbanCard as KanbanCardType, KanbanColumn as KanbanColumnType } from "../types";
import { KanbanCard } from "./KanbanCard";
import { KanbanColumn } from "./KanbanColumn";
import { KanbanCardModal } from "./KanbanCardModal";
import { ConfirmModal } from "./ConfirmModal";
import { KanbanArchiveListModal } from "./KanbanArchiveListModal";

export function KanbanBoard() {
  const { data: columnsData = [] } = useColumns();
  const columns = columnsData; // specific instance for easier usage
  const { data: cards = [] } = useCards();

  const { mutate: createColumn } = useCreateColumn();
  const { mutate: deleteColumn } = useDeleteColumn();
  const { mutate: updateColumn } = useUpdateColumn();

  const { mutate: createCard } = useCreateCard();
  const { mutate: deleteCard } = useDeleteCard(); // Performs Archive
  const { mutate: updateCard } = useUpdateCard();

  const columnIds = useMemo(() => columns.map((col) => col.id), [columns]);

  const [activeColumn, setActiveColumn] = useState<KanbanColumnType | null>(null);
  const [activeCard, setActiveCard] = useState<KanbanCardType | null>(null);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [deletingCardId, setDeletingCardId] = useState<string | null>(null);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);

  // Carousel State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [columnsPerPage, setColumnsPerPage] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setColumnsPerPage(1);
      } else if (window.innerWidth < 1280) {
        setColumnsPerPage(3);
      } else {
        setColumnsPerPage(4);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Ensure index is valid when columns change or resize
  useEffect(() => {
    if (columns.length > 0) {
      const maxStartingIndex = Math.max(0, columns.length - columnsPerPage);
      if (currentIndex > maxStartingIndex) {
        setCurrentIndex(maxStartingIndex);
      }
    }
  }, [columns.length, columnsPerPage, currentIndex]);


  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }

    if (event.active.data.current?.type === "Card") {
      setActiveCard(event.active.data.current.card);
      return;
    }
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveColumn(null);
    setActiveCard(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const isActiveAColumn = active.data.current?.type === "Column";
    if (isActiveAColumn) {
      if (activeId === overId) return;
      const oldIndex = columns.findIndex((col) => col.id === activeId);
      const newIndex = columns.findIndex((col) => col.id === overId);

      const newColumns = arrayMove(columns, oldIndex, newIndex);

      const prevCol = newColumns[newIndex - 1];
      const nextCol = newColumns[newIndex + 1];

      let newPos = 0;
      if (!prevCol) {
        newPos = (newColumns[0]?.position || 0) - 1000;
        if (newColumns[0]) newPos = newColumns[0].position / 2;
        else newPos = 1000;
      } else if (!nextCol) {
        newPos = prevCol.position + 1000;
      } else {
        newPos = (prevCol.position + nextCol.position) / 2;
      }

      updateColumn({ id: activeId as string, updates: { position: newPos } });
      return;
    }

    const isActiveACard = active.data.current?.type === "Card";
    if (isActiveACard) {
      const activeCardData = cards.find((c) => c.id === activeId);
      if (!activeCardData) return;

      if (over.data.current?.type === "Card") {
        const overCardData = cards.find((c) => c.id === overId);
        if (!overCardData) return;

        if (activeCardData.column_id === overCardData.column_id && activeId === overId) return;

        updateCard({
          id: activeId as string,
          updates: {
            column_id: overCardData.column_id,
            position: overCardData.position + 0.1,
          },
        });
        return;
      }

      if (over.data.current?.type === "Column") {
        const columnId = overId as string;
        if (activeCardData.column_id === columnId) return;

        const colCards = cards.filter((c) => c.column_id === columnId);
        const maxPos = colCards.length > 0 ? Math.max(...colCards.map((c) => c.position)) : 0;

        updateCard({
          id: activeId as string,
          updates: {
            column_id: columnId,
            position: maxPos + 1000,
          },
        });
      }
    }
  };

  const createNewColumn = () => {
    const maxPos = columns.length > 0 ? Math.max(...columns.map((c) => c.position)) : 0;
    createColumn({
      title: "New Column",
      position: maxPos + 1000,
    });
    // Slide to the new column
    setCurrentIndex(prev => prev + 1);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    if (currentIndex + columnsPerPage < columns.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Add logic
      createNewColumn();
    }
  };

  const isAtEnd = currentIndex + columnsPerPage >= columns.length;

  return (
    <div className="flex flex-col h-full w-full">
      {/* Header */}
      <header className="flex-none mb-8">
        <div className="w-full max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-md">Kanban Board</h1>
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
      <div className="flex-1 w-full relative overflow-hidden px-12 pb-4">
        {/* Navigation Buttons in the 'Left/Right Center' */}
        <div className="absolute top-1/2 -translate-y-1/2 left-2 z-10">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-xl transition-all hover:bg-white/20 hover:scale-110 disabled:opacity-0 disabled:pointer-events-none`}
          >
            <ChevronLeft size={24} />
          </button>
        </div>

        <div className="absolute top-1/2 -translate-y-1/2 right-2 z-10">
          <button
            onClick={handleNext}
            className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-xl transition-all hover:bg-white/20 hover:scale-110 group flex items-center gap-2"
          >
            {isAtEnd ? <Plus size={24} className="group-hover:rotate-90 transition-transform" /> : <ChevronRight size={24} />}
          </button>
        </div>

        <DndContext sensors={sensors} onDragStart={onDragStart} onDragOver={onDragOver} onDragEnd={onDragEnd}>
          <div className="h-full w-full overflow-hidden">
             <div 
               className="flex h-full transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
               style={{ 
                 transform: `translateX(calc(-${currentIndex} * (100% / ${columnsPerPage})))`
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
                        <KanbanColumn
                          column={col}
                          cards={cards.filter((c) => c.column_id === col.id).sort((a, b) => a.position - b.position)}
                          onDeleteColumn={deleteColumn}
                          onUpdateColumnTitle={(id, title) => updateColumn({ id, updates: { title } })}
                          createCard={(columnId, content) => {
                            const colCards = cards.filter((c) => c.column_id === columnId);
                            const maxPos = colCards.length > 0 ? Math.max(...colCards.map((c) => c.position)) : 0;
                            createCard({ column_id: columnId, content, position: maxPos + 1000 });
                          }}
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
                  <KanbanColumn
                    column={activeColumn}
                    cards={cards.filter((c) => c.column_id === activeColumn.id).sort((a, b) => a.position - b.position)}
                    onDeleteColumn={() => {}}
                    onUpdateColumnTitle={() => {}}
                    createCard={() => {}}
                    onEditCardStart={() => {}}
                  />
                </div>
              )}
              {activeCard && <KanbanCard card={activeCard} onEditStart={() => {}} />}
            </DragOverlay>,
            document.body
          )}

          <KanbanCardModal
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

      <KanbanArchiveListModal isOpen={isArchiveOpen} onClose={() => setIsArchiveOpen(false)} />
    </div>
  );
}
