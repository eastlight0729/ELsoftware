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
        className="bg-neutral-100 dark:bg-neutral-800 p-3 rounded-xl border-2 border-indigo-500/50 opacity-50 h-[100px]"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="group relative bg-white dark:bg-neutral-900 p-4 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all touch-none cursor-pointer"
      // Note: dnd-kit listeners usually capture pointer events.
      // If we want a click to register as "Open Modal" vs "Drag", we might need to rely on the fact that dnd-kit distinguishes clicks from drags.
      // However, if we put onClick here, it might fire after a drag end if not carefully managed.
      // A common pattern is to handle click on a child element or ensure drag didn't occur.
      // But typically a clean 'click' without movement fires onClick.
      onClick={() => {
        // Using stopPropagation might interfere with dnd-kit if not careful, but for a click that opens a modal, it's usually fine.
        // However, if we want dragging to work, we must not stopPointerDown or similar.
        // onClick fires after pointer up.
        onEditStart(card.id);
      }}
    >
      <div className="flex flex-col gap-2 pointer-events-none">
        {/* pointer-events-none on children ensures the parent div catches the click/drag easily, 
            but might prevent text selection if desired. 
            User wants "click the card anywhere -> modal opened". 
            Text selection is likely less priority than robust click/drag. 
        */}

        {/* Size Badge if existing */}
        {card.size && (
          <div className="flex justify-start mb-1">
            <div className="text-[10px] font-mono font-medium text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded border border-neutral-200 dark:border-neutral-700">
              {card.size}
            </div>
          </div>
        )}

        {/* Title Area */}
        <div className="relative min-h-[24px]">
          <div className="text-sm text-neutral-700 dark:text-neutral-200 whitespace-pre-wrap wrap-break-word leading-relaxed">
            {card.content}
          </div>
        </div>
      </div>
    </div>
  );
}
