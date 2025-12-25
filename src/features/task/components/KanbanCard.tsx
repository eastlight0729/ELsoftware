import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trash2 } from "lucide-react";
import { KanbanCard as KanbanCardType } from "../types";

interface KanbanCardProps {
  card: KanbanCardType;
  onDelete: (id: string) => void;
}

export function KanbanCard({ card, onDelete }: KanbanCardProps) {
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
        className="bg-neutral-100 dark:bg-neutral-800 p-3 rounded-lg border-2 border-indigo-500/50 opacity-50 h-[100px]"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white dark:bg-neutral-900 p-3 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-800 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 group touch-none cursor-grab active:cursor-grabbing"
    >
      <div className="flex justify-between items-start gap-2">
        <p className="text-sm text-neutral-700 dark:text-neutral-200 whitespace-pre-wrap wrap-break-word w-full">
          {card.content}
        </p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(card.id);
          }}
          className="opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-red-400 transition-opacity p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
