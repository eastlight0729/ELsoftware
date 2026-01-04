import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus, Archive, MoreHorizontal } from "lucide-react";
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
  onEditCardStart: (id: string) => void;
  allowAddCard?: boolean;
}

export function KanbanColumn({
  column,
  cards,
  onDeleteColumn,
  onUpdateColumnTitle,
  onEditCardStart,
  createCard,
  allowAddCard = false,
}: KanbanColumnProps) {
  const [editMode, setEditMode] = useState(false);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        className="bg-white/10 w-full h-[500px] rounded-xl border border-white/20 opacity-40 shrink-0"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white/10 w-full h-full max-h-full rounded-xl flex flex-col shrink-0 border border-white/20 shadow-lg transition-all"
    >
      {/* Column Header */}
      <div
        {...attributes}
        {...listeners}
        className="p-3 flex items-center justify-between cursor-grab active:cursor-grabbing border-b border-white/10"
      >
        <div className="flex gap-2 items-center font-bold text-sm text-white w-full">
          <div className="bg-white/20 px-2 py-0.5 rounded-full text-xs text-white/90 shadow-sm">
            {cards.length}
          </div>
          {editMode ? (
            <input
              autoFocus
              className="bg-white/10 border border-white/30 text-white rounded px-1 py-0.5 outline-none w-full placeholder-white/30"
              value={column.title}
              onChange={(e) => onUpdateColumnTitle(column.id, e.target.value)}
              onBlur={() => setEditMode(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter") setEditMode(false);
              }}
            />
          ) : (
            <span onClick={() => setEditMode(true)} className="truncate w-full cursor-text hover:bg-white/5 rounded px-1 -ml-1 transition-colors">
              {column.title}
            </span>
          )}
        </div>
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white/60 hover:text-white p-1 rounded hover:bg-white/10 transition-colors"
          >
            <MoreHorizontal size={16} />
          </button>

          {isMenuOpen && (
            <>
              {/* Backdrop to close menu */}
              <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)} />

              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-1 w-40 z-20 bg-white/10 backdrop-blur-xl rounded-lg shadow-xl border border-white/20 py-1 overflow-hidden">
                <button
                  onClick={() => {
                    onDeleteColumn(column.id);
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-white/90 hover:bg-white/10 flex items-center gap-2 transition-colors"
                >
                  <Archive size={14} />
                  Archive Column
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Cards Container */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 flex flex-col gap-2 min-h-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <SortableContext items={cardIds}>
          {cards.map((card) => (
            <KanbanCard key={card.id} card={card} onEditStart={onEditCardStart} />
          ))}
        </SortableContext>

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
                className="flex items-center gap-2 p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors w-full text-sm font-medium mt-auto"
              >
                <Plus size={16} /> Add Card
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
