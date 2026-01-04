import { useDroppable } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { Plus, Archive, MoreHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { KanbanCard as KanbanCardType, KanbanColumn as KanbanColumnType } from "../types";
import { KanbanCard } from "./KanbanCard";
import { NewCardForm } from "./NewCardForm";

interface KanbanColumnProps {
  column: KanbanColumnType;
  cards: KanbanCardType[];
  index: number;
  totalColumns: number;
  onDeleteColumn: (id: string) => void;
  onUpdateColumnTitle: (id: string, title: string) => void;
  createCard: (columnId: string, content: string) => void;
  onCreateColumnAfter: (id: string) => void;
  onEditCardStart: (id: string) => void;
  allowAddCard?: boolean;
}

export function KanbanColumn({
  column,
  cards,
  index,
  totalColumns,
  onDeleteColumn,
  onUpdateColumnTitle,
  onCreateColumnAfter,
  onEditCardStart,
  createCard,
  allowAddCard = false,
}: KanbanColumnProps) {
  const [editMode, setEditMode] = useState(false);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { setNodeRef } = useDroppable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });

  const cardIds = useMemo(() => cards.map((c) => c.id), [cards]);

  return (
    <div
      ref={setNodeRef}
      className="bg-white/10 w-full h-full max-h-full rounded-xl flex flex-col shrink-0 border border-white/20 shadow-lg transition-all"
    >
      {/* Column Header */}
      <div className="p-3 flex items-center justify-between border-b border-white/10">
        <div className="flex gap-2 items-center font-bold text-sm text-white w-full">
          <span className="text-[10px] font-mono font-normal text-white/40 bg-white/5 px-1.5 py-0.5 rounded border border-white/5 mr-1 shrink-0">
            {index + 1} / {totalColumns}
          </span>
          
          {editMode ? (
            <input
              autoFocus
              className="bg-white/10 border border-white/30 text-white rounded px-1 py-0.5 outline-none w-full placeholder-white/30"
              value={column.title}
              placeholder="Input column name"
              onChange={(e) => onUpdateColumnTitle(column.id, e.target.value)}
              onBlur={() => setEditMode(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter") setEditMode(false);
              }}
            />
          ) : (
            <span
              onClick={() => setEditMode(true)}
              className={`truncate w-full cursor-text hover:bg-white/5 rounded px-1 -ml-1 transition-colors min-h-[24px] flex items-center ${
                !column.title ? "text-white/40" : ""
              }`}
            >
              {column.title || "Input column name"}
            </span>
          )}
        </div>
        <div className="relative ml-3">
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
                {allowAddCard && (
                  <button
                    onClick={() => {
                      setIsAddingCard(true);
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-white/90 hover:bg-white/10 flex items-center gap-2 transition-colors border-b border-white/5"
                  >
                    <Plus size={14} />
                    Add Card
                  </button>
                )}
                <button
                  onClick={() => {
                    onCreateColumnAfter(column.id);
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-white/90 hover:bg-white/10 flex items-center gap-2 transition-colors border-b border-white/5"
                >
                  <Plus size={14} />
                  Add Column
                </button>
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
        {allowAddCard && isAddingCard && (
          <div className="mb-2">
            <NewCardForm
              onSubmit={(content) => {
                createCard(column.id, content);
                setIsAddingCard(false);
              }}
              onCancel={() => setIsAddingCard(false)}
            />
          </div>
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
