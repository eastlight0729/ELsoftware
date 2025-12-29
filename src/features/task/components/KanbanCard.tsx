import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Pencil, Trash2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { KanbanCard as KanbanCardType } from "../types";

interface KanbanCardProps {
  card: KanbanCardType;
  onUpdate: (id: string, updates: Partial<KanbanCardType>) => void;
  onEditStart: (id: string) => void;
  onDeleteRequest: (id: string) => void;
}

export function KanbanCard({ card, onUpdate, onEditStart, onDeleteRequest }: KanbanCardProps) {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: card.id,
    data: {
      type: "Card",
      card,
    },
  });

  const [isInlineEditing, setIsInlineEditing] = useState(false);
  const [title, setTitle] = useState(card.content);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setTitle(card.content);
  }, [card.content]);

  useEffect(() => {
    if (isInlineEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isInlineEditing]);

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const handleInlineSave = () => {
    setIsInlineEditing(false);
    if (!title.trim() || title === card.content) {
      setTitle(card.content);
      return;
    }
    onUpdate(card.id, { content: title.trim() });
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
      className="group relative bg-white dark:bg-neutral-900 p-4 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all touch-none"
    >
      <div className="flex flex-col gap-2">
        {/* Title Area */}
        <div
          className="relative min-h-[24px]"
          onPointerDown={(e) => {
            // Prevent drag when interacting with text area
            if (isInlineEditing) e.stopPropagation();
          }}
        >
          {isInlineEditing ? (
            <textarea
              ref={inputRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleInlineSave}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleInlineSave();
                }
                if (e.key === "Escape") {
                  setTitle(card.content);
                  setIsInlineEditing(false);
                }
              }}
              onClick={(e) => e.stopPropagation()}
              className="w-full bg-transparent text-sm text-neutral-900 dark:text-neutral-100 resize-none outline-none border-none p-0 focus:ring-0 leading-relaxed"
              rows={Math.max(1, title.split("\n").length)}
              style={{ height: "auto" }}
            />
          ) : (
            <div
              onClick={(e) => {
                // e.stopPropagation(); // Allow drag from card body, but maybe title click edits?
                // User requirement: "If user click title text area, user can edit the text."
                // Usually this means separate from drag.
                e.stopPropagation();
                setIsInlineEditing(true);
              }}
              className="text-sm text-neutral-700 dark:text-neutral-200 whitespace-pre-wrap break-words leading-relaxed cursor-text hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              {card.content}
            </div>
          )}
        </div>

        {/* Footer / Actions */}
        <div className="flex justify-between items-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Size Badge if existing */}
          <div className="text-[10px] font-mono font-medium text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded">
            {card.size || "1"}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditStart(card.id);
              }}
              className="p-1.5 text-neutral-400 hover:text-indigo-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteRequest(card.id);
              }}
              className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
