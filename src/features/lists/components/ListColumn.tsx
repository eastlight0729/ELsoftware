import { useDroppable } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { MoreHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { ListCard as ListCardType, ListColumn as ListColumnType } from "../types";
import { ListCard } from "./ListCard";
import { NewCardForm } from "./NewCardForm";
import { ListColumnMenu } from "./ListColumnMenu";

interface ListColumnProps {
  column: ListColumnType;
  cards: ListCardType[];
  index: number;
  totalColumns: number;
  onDeleteColumn: (id: string) => void;
  onUpdateColumnTitle: (id: string, title: string) => void;
  createCard: (columnId: string, content: string) => void;
  onCreateColumnAfter: (id: string) => void;
  onEditCardStart: (id: string) => void;
  onArchiveCard: (id: string) => void;
  allowAddCard?: boolean;
}

export function ListColumn({
  column,
  cards,
  index,
  totalColumns,
  onDeleteColumn,
  onUpdateColumnTitle,
  onCreateColumnAfter,
  onEditCardStart,
  onArchiveCard,
  createCard,
  allowAddCard = false,
}: ListColumnProps) {
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
      className="bg-white/10 w-full h-full rounded-xl flex flex-col shrink-0 border border-white/20 shadow-lg transition-all"
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
            <ListColumnMenu
              onAddCard={
                allowAddCard
                  ? () => {
                      setIsAddingCard(true);
                    }
                  : undefined
              }
              onAddColumn={() => onCreateColumnAfter(column.id)}
              onArchive={() => onDeleteColumn(column.id)}
              onClose={() => setIsMenuOpen(false)}
            />
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
            <ListCard 
              key={card.id} 
              card={card} 
              onEditStart={onEditCardStart} 
              onArchive={onArchiveCard}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
