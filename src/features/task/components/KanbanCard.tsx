import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { KanbanCard as KanbanCardType } from "../types";

interface KanbanCardProps {
  card: KanbanCardType;
  onEditStart: (id: string) => void;
}

export function KanbanCard({ card, onEditStart }: KanbanCardProps) {
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
      <div className="flex flex-col gap-2 pointer-events-none">
        


        {/* Title Area */}
        <div className="relative min-h-[24px]">
          <div className="text-sm text-white/90 font-medium whitespace-pre-wrap wrap-break-word leading-relaxed">
            {card.content}
          </div>
        </div>
      </div>
    </div>
  );
}
