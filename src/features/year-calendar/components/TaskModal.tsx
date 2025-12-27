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
        className="bg-neutral-100 dark:bg-neutral-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-neutral-200 dark:border-neutral-700 animate-in zoom-in-95 duration-200"
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSave();
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5">
          <div>
            <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">{title}</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">{subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors p-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 space-y-4">
          {/* Size Selector */}
          <div className="relative flex w-full border-b border-neutral-200 dark:border-neutral-700">
            {SIZES.map((s) => (
              <button
                key={s.value}
                onClick={() => setSize(s.value)}
                className={cn(
                  "flex-1 pb-2 text-xs font-medium transition-colors duration-200 outline-none",
                  size === s.value
                    ? "text-neutral-900 dark:text-neutral-100"
                    : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300"
                )}
              >
                {s.label}
              </button>
            ))}
            <div
              className="absolute -bottom-px left-0 h-0.5 w-1/4 bg-neutral-900 dark:bg-neutral-100 transition-transform duration-300 ease-out"
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
            className="w-full h-32 p-4 bg-white dark:bg-neutral-900 rounded-xl border-none focus:ring-2 focus:ring-neutral-200 dark:focus:ring-neutral-700 outline-none resize-none text-neutral-700 dark:text-neutral-200 placeholder:text-neutral-400 transition-all text-base"
          />

          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Markdown supported</span>
            <span className="bg-neutral-200 dark:bg-neutral-700 px-2 py-1 rounded text-neutral-600 dark:text-neutral-300">
              ⌘ + Enter
            </span>
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
              className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-900 rounded-lg transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
