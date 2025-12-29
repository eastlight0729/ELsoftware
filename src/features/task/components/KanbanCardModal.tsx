import { useEffect, useRef, useState } from "react";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { KanbanCard } from "../types";

interface KanbanCardModalProps {
  isOpen: boolean;
  card: KanbanCard | null;
  onSave: (id: string, updates: Partial<KanbanCard>) => void;
  onRemove: (id: string) => void;
  onClose: () => void;
}

const SIZES = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "5", label: "5" },
  { value: "8", label: "8" },
];

export function KanbanCardModal({ isOpen, card, onSave, onRemove, onClose }: KanbanCardModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [size, setSize] = useState("1");
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && card) {
      setTitle(card.content);
      setDescription(card.description || "");
      setSize(card.size || "1");
      requestAnimationFrame(() => {
        titleInputRef.current?.focus();
      });
    }
  }, [isOpen, card]);

  if (!isOpen || !card) return null;

  const handleSave = () => {
    if (!title.trim()) return;

    onSave(card.id, {
      content: title.trim(),
      description: description.trim(),
      size,
    });
    onClose();
  };

  const handleRemove = () => {
    onRemove(card.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-neutral-100 dark:bg-neutral-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-neutral-200 dark:border-neutral-700 animate-in zoom-in-95 duration-200"
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSave();
        }}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-neutral-200 dark:border-neutral-700">
          <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">Edit Card</h3>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-4">
          {/* Size Selector */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Size</span>
            <div className="flex space-x-1">
              {SIZES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setSize(s.value)}
                  className={cn(
                    "w-8 h-8 rounded-full text-xs font-medium transition-colors border",
                    size === s.value
                      ? "bg-green-600 border-green-600 text-white"
                      : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:border-green-500"
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Title</label>
            <input
              ref={titleInputRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.metaKey && !e.ctrlKey) {
                  e.preventDefault();
                  document.getElementById("card-description")?.focus();
                }
              }}
              className="w-full p-3 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:border-green-500 dark:focus:border-green-500 outline-none transition-all text-neutral-900 dark:text-neutral-100 font-medium"
              placeholder="Card Title"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Description</label>
            <textarea
              id="card-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details..."
              className="w-full h-32 p-3 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:border-green-500 dark:focus:border-green-500 outline-none resize-none text-neutral-600 dark:text-neutral-300 text-sm transition-all"
            />
          </div>

          <div className="flex items-center justify-end text-xs text-neutral-400">
            <span className="text-neutral-500 dark:text-neutral-400">⌘ + Enter to save</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-200 dark:border-neutral-700/50 bg-neutral-50 dark:bg-neutral-800/50">
          <button
            onClick={handleRemove}
            className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-sm font-medium"
          >
            <Trash2 size={16} />
            <span className="hidden sm:inline">Delete</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!title.trim()}
              className="px-5 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-500 text-white rounded-lg transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
