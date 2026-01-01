import { useEffect, useRef, useState } from "react";
import { Trash2, Zap, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskModalProps {
  isOpen: boolean;
  dates: string[];
  initialTask: string | null;
  initialSize?: string;
  onSave: (task: string, size: string) => void;
  onRemove: () => void;
  onClose: () => void;
  onSwitchAction: (date: string) => void;
}

const SIZES = [
  { value: "1", label: "S" },
  { value: "2", label: "M" },
  { value: "3", label: "L" },
  { value: "everyday", label: "All" },
];

export function TaskModal({
  isOpen,
  dates,
  initialTask,
  initialSize,
  onSave,
  onRemove,
  onClose,
  onSwitchAction,
}: TaskModalProps) {
  const [taskTitle, setTaskTitle] = useState("");
  const [description, setDescription] = useState("");
  const [size, setSize] = useState(initialSize || "everyday");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  useEffect(() => {
    if (isOpen) {
      if (initialTask) {
        const parts = initialTask.split("\n\n");
        setTaskTitle(parts[0] || "");
        setDescription(parts.slice(1).join("\n\n") || "");
      } else {
        setTaskTitle("");
        setDescription("");
      }
      setSize(initialSize || "everyday");
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [isOpen, initialTask, initialSize]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!taskTitle.trim()) {
      if (initialTask) {
        onRemove();
      } else {
        onClose();
      }
    } else {
      const fullTask = description.trim() ? `${taskTitle}\n\n${description}` : taskTitle;
      onSave(fullTask, size);
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

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => {
                if (dates.length === 1) {
                  onSwitchAction(dates[0]);
                } else {
                  setIsDropdownOpen(!isDropdownOpen);
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded-lg transition-colors text-xs font-medium text-neutral-600 dark:text-neutral-300"
            >
              <Zap size={14} className="text-amber-500" />
              <span>Switch to Action</span>
              {dates.length > 1 && (
                <ChevronDown
                  size={12}
                  className={cn("transition-transform duration-200", isDropdownOpen && "rotate-180")}
                />
              )}
            </button>

            {isDropdownOpen && dates.length > 1 && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="py-1 max-h-60 overflow-y-auto">
                  {[...dates].sort().map((date) => (
                    <button
                      key={date}
                      onClick={() => {
                        onSwitchAction(date);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors flex items-center justify-between group"
                    >
                      <span className="font-medium">
                        {new Date(date).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <Zap size={12} className="opacity-0 group-hover:opacity-100 text-amber-500 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
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
                    ? "text-green-600 dark:text-green-500"
                    : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300"
                )}
              >
                {s.label}
              </button>
            ))}
            <div
              className="absolute -bottom-px left-0 h-0.5 w-1/4 bg-green-600 dark:bg-green-500 transition-transform duration-300 ease-out"
              style={{
                transform: `translateX(${SIZES.findIndex((s) => s.value === size) * 100}%)`,
              }}
            />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.metaKey && !e.ctrlKey) {
                e.preventDefault();
                document.getElementById("task-description")?.focus();
              }
            }}
            placeholder="Event Title"
            className="w-full p-4 text-lg font-semibold bg-white dark:bg-neutral-900 rounded-xl border-none outline-none text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 transition-all"
          />

          <textarea
            id="task-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add description..."
            className="w-full h-32 p-4 bg-white dark:bg-neutral-900 rounded-xl border-none outline-none resize-none text-neutral-600 dark:text-neutral-300 placeholder:text-neutral-400 transition-all text-sm"
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
              disabled={!taskTitle.trim()}
              className="px-5 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-500 text-white rounded-lg transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
