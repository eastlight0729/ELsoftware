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
  { value: "1", label: "S" },
  { value: "2", label: "M" },
  { value: "3", label: "L" },
  { value: "everyday", label: "All" },
];

export function TaskModal({ isOpen, dates, initialTask, initialSize, onSave, onRemove, onClose }: TaskModalProps) {
  const [task, setTask] = useState(initialTask || "");
  const [size, setSize] = useState(initialSize || "everyday");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTask(initialTask || "");
      setSize(initialSize || "everyday");
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

  const title = isRange ? `${formatDate(startDate)} - ${formatDate(endDate)}` : formatFullDate(startDate);
  const subtitle = isRange ? `${dates.length} days selected` : "Schedule a task";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-zinc-950 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95 duration-200"
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSave();
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5">
          <div>
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">{title}</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 space-y-4">
          {/* Size Selector */}
          <div className="relative flex w-full border-b border-zinc-200 dark:border-zinc-800">
            {SIZES.map((s) => (
              <button
                key={s.value}
                onClick={() => setSize(s.value)}
                className={cn(
                  "flex-1 pb-2 text-xs font-medium transition-colors duration-200 outline-none",
                  size === s.value
                    ? "text-zinc-900 dark:text-zinc-100"
                    : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
                )}
              >
                {s.label}
              </button>
            ))}
            <div
              className="absolute -bottom-px left-0 h-0.5 w-1/4 bg-zinc-900 dark:bg-zinc-100 transition-transform duration-300 ease-out"
              style={{
                transform: `translateX(${SIZES.findIndex((s) => s.value === size) * 100}%)`,
              }}
            />
          </div>

          <textarea
            ref={textareaRef}
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="What are you planning?"
            className="w-full h-32 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl border-none focus:ring-2 focus:ring-zinc-200 dark:focus:ring-zinc-800 outline-none resize-none text-zinc-700 dark:text-zinc-200 placeholder:text-zinc-400 transition-all text-base"
          />

          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Markdown supported</span>
            <span className="bg-zinc-100 dark:bg-zinc-900 px-2 py-1 rounded text-zinc-500">⌘ + Enter</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-100 dark:border-zinc-900/50">
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
              className="px-4 py-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!task.trim()}
              className="px-5 py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 rounded-lg transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
