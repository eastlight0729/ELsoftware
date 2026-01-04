import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Archive, FolderInput } from "lucide-react";
import { ListCard as ListCardType } from "../types";

interface ListCardProps {
  card: ListCardType;
  onEditStart: (id: string) => void;
  onArchive: (id: string) => void;
}

export function ListCard({ card, onEditStart, onArchive }: ListCardProps) {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: card.id,
    data: {
      type: "Card",
      card,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-white/20 p-3 rounded-xl border border-white/30 opacity-50 h-[100px]"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="group relative bg-white/40 hover:bg-white/60 p-4 rounded-xl shadow-sm border border-white/20 backdrop-blur-sm transition-all touch-none cursor-pointer"
      onClick={() => {
        onEditStart(card.id);
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="text-sm text-white/90 font-medium whitespace-pre-wrap wrap-break-word leading-relaxed">
            {card.content}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Implement move logic later or pass a handler
            }}
            className="p-1.5 text-white/70 hover:text-sky-400 hover:bg-white/20 rounded-lg transition-colors"
            title="Move to..."
          >
            <FolderInput size={18} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onArchive(card.id);
            }}
            className="p-1.5 text-white/70 hover:text-orange-400 hover:bg-white/20 rounded-lg transition-colors"
            title="Archive"
          >
            <Archive size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
