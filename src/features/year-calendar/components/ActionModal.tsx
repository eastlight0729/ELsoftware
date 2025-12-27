import { useEffect, useRef, useState } from "react";
import { Trash2 } from "lucide-react";

interface ActionModalProps {
  isOpen: boolean;
  date: string; // YYYY-MM-DD
  initialTask: string | null;
  onSave: (task: string) => void;
  onRemove: () => void;
  onClose: () => void;
}

export function ActionModal({ isOpen, date, initialTask, onSave, onRemove, onClose }: ActionModalProps) {
  const [task, setTask] = useState(initialTask || "");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTask(initialTask || "");
      requestAnimationFrame(() => {
        textareaRef.current?.focus();
      });
    }
  }, [isOpen, initialTask]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!task.trim()) {
      if (initialTask) {
        onRemove();
      } else {
        onClose();
      }
    } else {
      onSave(task);
    }
  };

  const formattedDate = new Date(date).toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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
        <div className="flex items-center justify-between px-6 py-5">
          <div>
            <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">Action</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">{formattedDate}</p>
          </div>
        </div>

        {/* content */}
        <div className="px-6 pb-6 space-y-4">
          <textarea
            ref={textareaRef}
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="What needs to be done?"
            className="w-full h-32 p-4 bg-white dark:bg-neutral-900 rounded-xl border-none outline-none resize-none text-neutral-700 dark:text-neutral-200 placeholder:text-neutral-400 transition-all text-base"
          />
          <div className="flex items-center justify-end text-xs text-neutral-400">
            <span className="text-neutral-500 dark:text-neutral-400">⌘ + Enter</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-200 dark:border-neutral-700/50">
          {initialTask ? (
            <button
              onClick={onRemove}
              className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-sm font-medium"
            >
              <Trash2 size={16} />
              <span className="hidden sm:inline">Delete</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!task.trim()}
              className="px-5 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-500 text-white rounded-lg transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Action
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
