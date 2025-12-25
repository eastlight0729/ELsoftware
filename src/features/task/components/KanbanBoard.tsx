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
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
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

export function KanbanBoard() {
  const { data: columns = [] } = useColumns();
  const { data: cards = [] } = useCards();

  const { mutate: createColumn } = useCreateColumn();
  const { mutate: deleteColumn } = useDeleteColumn();
  const { mutate: updateColumn } = useUpdateColumn();

  const { mutate: createCard } = useCreateCard();
  const { mutate: deleteCard } = useDeleteCard();
  const { mutate: updateCard } = useUpdateCard();

  const columnIds = useMemo(() => columns.map((col) => col.id), [columns]);

  const [activeColumn, setActiveColumn] = useState<KanbanColumnType | null>(null);
  const [activeCard, setActiveCard] = useState<KanbanCardType | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // 3px movement to start drag
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

    // We can add sophisticated drag over logic here if needed
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
      // Reorder columns
      const oldIndex = columns.findIndex((col) => col.id === activeId);
      const newIndex = columns.findIndex((col) => col.id === overId);

      // Calculate new position
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

    // Card Drag End
    const isActiveACard = active.data.current?.type === "Card";
    if (isActiveACard) {
      // Find active card and over card/column
      const activeCardData = cards.find((c) => c.id === activeId);
      if (!activeCardData) return;

      // Dropped over a Card
      if (over.data.current?.type === "Card") {
        const overCardData = cards.find((c) => c.id === overId);
        if (!overCardData) return;

        if (activeCardData.column_id === overCardData.column_id && activeId === overId) return;

        // Dropped onto another card - update column and approximate position
        updateCard({
          id: activeId as string,
          updates: {
            column_id: overCardData.column_id,
            position: overCardData.position + 0.1,
          },
        });
        return;
      }

      // Dropped over a Column (empty area)
      if (over.data.current?.type === "Column") {
        const columnId = overId as string;
        if (activeCardData.column_id === columnId) return; // Same column, no reorder info

        // Move to column, append to bottom
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
  };

  return (
    <DndContext sensors={sensors} onDragStart={onDragStart} onDragOver={onDragOver} onDragEnd={onDragEnd}>
      <div className="flex h-full w-full gap-4 overflow-x-auto pb-4">
        <SortableContext items={columnIds}>
          {columns.map((col) => (
            <KanbanColumn
              key={col.id}
              column={col}
              cards={cards.filter((c) => c.column_id === col.id).sort((a, b) => a.position - b.position)}
              onDeleteColumn={deleteColumn}
              onUpdateColumnTitle={(id, title) => updateColumn({ id, updates: { title } })}
              createCard={(columnId, content) => {
                const colCards = cards.filter((c) => c.column_id === columnId);
                const maxPos = colCards.length > 0 ? Math.max(...colCards.map((c) => c.position)) : 0;
                createCard({ column_id: columnId, content, position: maxPos + 1000 });
              }}
              deleteCard={deleteCard}
            />
          ))}
        </SortableContext>

        <button
          onClick={createNewColumn}
          className="h-[60px] min-w-[300px] rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-700 flex items-center justify-center gap-2 text-neutral-500 hover:text-neutral-700 hover:border-neutral-400 dark:hover:text-neutral-300 transition-colors"
        >
          <Plus size={20} />
          <span className="font-medium">Add Column</span>
        </button>
      </div>

      {createPortal(
        <DragOverlay>
          {activeColumn && (
            <KanbanColumn
              column={activeColumn}
              cards={cards.filter((c) => c.column_id === activeColumn.id).sort((a, b) => a.position - b.position)}
              onDeleteColumn={() => {}}
              onUpdateColumnTitle={() => {}}
              createCard={() => {}}
              deleteCard={() => {}}
            />
          )}
          {activeCard && <KanbanCard card={activeCard} onDelete={() => {}} />}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
}
