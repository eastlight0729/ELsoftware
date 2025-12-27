import { useEffect, useRef, useState } from "react";
import { X, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskModalProps {
  isOpen: boolean;
  dates: string[];
  initialTask: string | null;
  initialSize?: string;
  onSave: (task: string, size: string) => void;
  onRemove: () => void;
  onClose: () => void;
}

const SIZES = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "everyday", label: "Everyday" },
];

export function TaskModal({ isOpen, dates, initialTask, initialSize, onSave, onRemove, onClose }: TaskModalProps) {
  const [task, setTask] = useState(initialTask || "");
  const [size, setSize] = useState(initialSize || "everyday");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTask(initialTask || "");
      setSize(initialSize || "everyday");
      // Focus after animation frame
      requestAnimationFrame(() => {
        textareaRef.current?.focus();
      });
    }
  }, [isOpen, initialTask, initialSize]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!task.trim()) {
      if (initialTask) {
        onRemove();
      } else {
        onClose();
      }
    } else {
      onSave(task, size);
    }
  };

  const sortedDates = [...dates].sort();
  const startDate = new Date(sortedDates[0]);
  const endDate = new Date(sortedDates[sortedDates.length - 1]);
  const isRange = dates.length > 1;

  const formatDate = (d: Date) => d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  const formatFullDate = (d: Date) =>
    d.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  const title = isRange
    ? `${formatDate(startDate)} - ${formatDate(endDate)} (${dates.length} days)`
    : formatFullDate(startDate);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-neutral-200 dark:border-neutral-800 animate-in zoom-in-95 duration-200"
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSave();
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-neutral-800">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{title}</h3>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* content */}
        <div className="p-6 space-y-4">
          {/* Size Selector */}
          <div>
            <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2 block">
              Intensity / Size
            </label>
            <div className="flex gap-2">
              {SIZES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setSize(s.value)}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-sm font-medium transition-colors border",
                    size === s.value
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700"
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <textarea
            ref={textareaRef}
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Write your task here..."
            className="w-full h-32 p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none resize-none text-neutral-700 dark:text-neutral-200 placeholder:text-neutral-400"
          />
          <div className="mt-2 text-xs text-neutral-400 flex justify-between">
            <span>Markdown supported (basic)</span>
            <span>⌘+Enter to save</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-neutral-50/50 dark:bg-neutral-900/50 border-t border-neutral-100 dark:border-neutral-800">
          {initialTask ? (
            <button
              onClick={onRemove}
              className="flex items-center gap-2 px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-sm font-medium"
            >
              <Trash2 size={16} />
              Remove
            </button>
          ) : (
            <div /> // Spacer
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!task.trim()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm shadow-indigo-200 dark:shadow-none transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Range
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
