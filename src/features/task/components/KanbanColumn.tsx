import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { KanbanCard as KanbanCardType, KanbanColumn as KanbanColumnType } from "../types";
import { KanbanCard } from "./KanbanCard";
import { NewCardForm } from "./NewCardForm";

interface KanbanColumnProps {
  column: KanbanColumnType;
  cards: KanbanCardType[];
  onDeleteColumn: (id: string) => void;
  onUpdateColumnTitle: (id: string, title: string) => void;
  createCard: (columnId: string, content: string) => void;
  onUpdateCard: (id: string, updates: Partial<KanbanCardType>) => void;
  onEditCardStart: (id: string) => void;
  allowAddCard?: boolean;
}

export function KanbanColumn({
  column,
  cards,
  onDeleteColumn,
  onUpdateColumnTitle,
  onUpdateCard,
  onEditCardStart,
  createCard,
  allowAddCard = false,
}: KanbanColumnProps) {
  const [editMode, setEditMode] = useState(false);
  const [isAddingCard, setIsAddingCard] = useState(false);

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const cardIds = useMemo(() => cards.map((c) => c.id), [cards]);

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-neutral-100/50 dark:bg-neutral-800/50 w-[300px] h-[500px] rounded-xl border-2 border-indigo-500 opacity-40 shrink-0"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-neutral-100/50 dark:bg-neutral-800/50 w-[300px] h-full max-h-full rounded-xl flex flex-col shrink-0"
    >
      {/* Column Header */}
      <div
        {...attributes}
        {...listeners}
        className="p-3 flex items-center justify-between cursor-grab active:cursor-grabbing border-b border-neutral-200 dark:border-neutral-700/50"
      >
        <div className="flex gap-2 items-center font-bold text-sm text-neutral-700 dark:text-neutral-200 w-full">
          <div className="bg-neutral-200 dark:bg-neutral-700 px-2 py-0.5 rounded-full text-xs text-neutral-500 dark:text-neutral-400">
            {cards.length}
          </div>
          {editMode ? (
            <input
              autoFocus
              className="bg-white dark:bg-neutral-900 border border-indigo-500 rounded px-1 py-0.5 outline-none w-full"
              value={column.title}
              onChange={(e) => onUpdateColumnTitle(column.id, e.target.value)}
              onBlur={() => setEditMode(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter") setEditMode(false);
              }}
            />
          ) : (
            <span onClick={() => setEditMode(true)} className="truncate w-full cursor-text">
              {column.title}
            </span>
          )}
        </div>
        <button
          onClick={() => onDeleteColumn(column.id)}
          className="text-neutral-400 hover:text-red-400 p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Cards Container */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 flex flex-col gap-2 min-h-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {allowAddCard && (
          <>
            {isAddingCard ? (
              <NewCardForm
                onSubmit={(content) => {
                  createCard(column.id, content);
                  setIsAddingCard(false); // keep form open? usually close
                }}
                onCancel={() => setIsAddingCard(false)}
              />
            ) : (
              <button
                onClick={() => setIsAddingCard(true)}
                className="flex items-center gap-2 p-2 rounded-lg text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700/50 transition-colors w-full text-sm font-medium"
              >
                <Plus size={16} /> Add Card
              </button>
            )}
          </>
        )}

        <SortableContext items={cardIds}>
          {cards.map((card) => (
            <KanbanCard key={card.id} card={card} onEditStart={onEditCardStart} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
