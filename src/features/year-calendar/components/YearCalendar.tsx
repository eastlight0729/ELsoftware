import { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  useYearCalendarMarks,
  useSaveYearCalendarTasks,
  useDeleteYearCalendarMarks,
  migrateLegacyMarks,
} from "../api/useYearCalendar";
import { TaskModal } from "./TaskModal";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const TOTAL_COLUMNS = 37;
const WEEKDAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

export function YearCalendar() {
  const [year, setYear] = useState(new Date().getFullYear());
  const { data: marks = {} } = useYearCalendarMarks();
  const saveTasksMutation = useSaveYearCalendarTasks();
  const deleteTasksMutation = useDeleteYearCalendarMarks();

  const [holidays, setHolidays] = useState<Set<string>>(new Set());

  // Selection / Dragging state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<string | null>(null);
  const [dragCurrent, setDragCurrent] = useState<string | null>(null);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const today = new Date();

  useEffect(() => {
    const migrate = async () => {
      if (window.electron?.yearCalendar) {
        try {
          const legacyMarks = await window.electron.yearCalendar.getMarks();
          if (Object.keys(legacyMarks).length > 0) {
            console.log("Migrating legacy marks...");
            await migrateLegacyMarks(legacyMarks);
            await window.electron.yearCalendar.clearMarks();
            console.log("Migration complete.");
          }
        } catch (e) {
          console.error("Migration failed:", e);
        }
      }
    };
    migrate();
  }, []);

  useEffect(() => {
    if (window.electron?.yearCalendar) {
      window.electron.yearCalendar.getHolidays(year).then((data: string[]) => {
        setHolidays(new Set(data));
      });
    }
  }, [year]);

  // Global mouse up to end drag if user releases outside
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        finishDrag();
      }
    };
    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, [isDragging, dragStart, dragCurrent]);

  const getDaysInMonth = (monthIndex: number, year: number) => {
    return new Date(year, monthIndex + 1, 0).getDate();
  };

  const getStartDayOfMonth = (monthIndex: number, year: number) => {
    const day = new Date(year, monthIndex, 1).getDay();
    return (day + 6) % 7;
  };

  const formatDate = (y: number, m: number, d: number) => {
    return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  };

  const getDatesInRange = (startStr: string, endStr: string) => {
    const start = new Date(startStr);
    const end = new Date(endStr);

    // Normalize
    const min = start < end ? start : end;
    const max = start < end ? end : start;

    const dates: string[] = [];
    const current = new Date(min);

    while (current <= max) {
      // Format manually to avoid timezone issues or use exact YYYY-MM-DD
      const y = current.getFullYear();
      const m = current.getMonth();
      const d = current.getDate();
      dates.push(formatDate(y, m, d));

      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  const handlePrevYear = () => setYear((y) => y - 1);
  const handleNextYear = () => setYear((y) => y + 1);

  // Drag Handlers
  const handleMouseDown = (dateStr: string) => {
    setIsDragging(true);
    setDragStart(dateStr);
    setDragCurrent(dateStr);
  };

  const handleMouseEnter = (dateStr: string) => {
    if (isDragging) {
      setDragCurrent(dateStr);
    }
  };

  const finishDrag = () => {
    if (dragStart && dragCurrent) {
      const range = getDatesInRange(dragStart, dragCurrent);
      setSelectedDates(range);
      setIsModalOpen(true);
    }
    setIsDragging(false);
    setDragStart(null);
    setDragCurrent(null);
  };

  const handleSaveTask = (task: string) => {
    if (selectedDates.length > 0) {
      saveTasksMutation.mutate({ dates: selectedDates, task });
      setIsModalOpen(false);
      setSelectedDates([]);
    }
  };

  const handleRemoveTask = () => {
    if (selectedDates.length > 0) {
      deleteTasksMutation.mutate(selectedDates);
      setIsModalOpen(false);
      setSelectedDates([]);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDates([]);
  };

  // Determine current effective selection for highlighting
  const currentSelection = useMemo(() => {
    if (isDragging && dragStart && dragCurrent) {
      return new Set(getDatesInRange(dragStart, dragCurrent));
    }
    return new Set<string>();
  }, [isDragging, dragStart, dragCurrent]);

  return (
    <div className="w-full h-full flex flex-col gap-6 animate-in fade-in duration-500 select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-2">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-neutral-800 to-neutral-500 dark:from-neutral-100 dark:to-neutral-400">
          Year Calendar
        </h1>

        <div className="flex items-center gap-4 bg-white dark:bg-neutral-800 rounded-full p-1 pl-4 pr-1 shadow-sm border border-neutral-200 dark:border-neutral-700">
          <span className="text-xl font-mono font-medium text-neutral-700 dark:text-neutral-200">{year}</span>
          <div className="flex gap-1">
            <button
              onClick={handlePrevYear}
              className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-full transition-colors text-neutral-600 dark:text-neutral-400"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={handleNextYear}
              className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-full transition-colors text-neutral-600 dark:text-neutral-400"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid Container */}
      <div className="flex-1 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-xl overflow-hidden flex flex-col">
        {/* Scrollable Area */}
        <div className="flex-1 overflow-auto p-6">
          <div className="inline-block min-w-full">
            {/* Grid Header (Weekdays) */}
            <div className="flex mb-4 gap-6">
              <div className="w-8 shrink-0" />
              <div className="flex-1 grid grid-cols-37 gap-1">
                {Array.from({ length: TOTAL_COLUMNS }).map((_, i) => {
                  const isWeekend = i % 7 === 5 || i % 7 === 6;
                  return (
                    <div key={i} className="text-center">
                      <span
                        className={cn(
                          "text-xs font-bold",
                          isWeekend ? "text-red-400 dark:text-red-400/80" : "text-neutral-400 dark:text-neutral-500"
                        )}
                      >
                        {WEEKDAY_LABELS[i % 7]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Months Rows */}
            <div className="flex flex-col gap-3">
              {MONTHS.map((monthName, monthIndex) => {
                const daysInMonth = getDaysInMonth(monthIndex, year);
                const startDay = getStartDayOfMonth(monthIndex, year);

                const cells = [
                  ...Array.from({ length: startDay }, () => null),
                  ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
                ];

                return (
                  <div key={monthName} className="flex items-center group gap-6">
                    <div className="w-8 shrink-0 flex justify-end pr-3">
                      <span className="text-sm font-semibold text-neutral-400 dark:text-neutral-500 group-hover:text-primary-500 transition-colors">
                        {monthIndex + 1}
                      </span>
                    </div>

                    <div className="flex-1 grid grid-cols-37 gap-1">
                      {cells.map((day, cellIndex) => {
                        const isWeekend = cellIndex % 7 === 5 || cellIndex % 7 === 6;

                        if (day === null) {
                          return <div key={`blank-${cellIndex}`} className="aspect-square rounded-sm bg-transparent" />;
                        }

                        const isToday =
                          year === today.getFullYear() && monthIndex === today.getMonth() && day === today.getDate();

                        const dateStr = formatDate(year, monthIndex, day);
                        const mark = marks[dateStr];
                        const isMarked = !!mark;
                        const isHoliday = holidays.has(dateStr);

                        const isSelected = currentSelection.has(dateStr);

                        return (
                          <div
                            key={`day-${day}`}
                            onMouseDown={() => handleMouseDown(dateStr)}
                            onMouseEnter={() => handleMouseEnter(dateStr)}
                            className={cn(
                              "aspect-square rounded-sm transition-all duration-100 relative group/cell flex items-center justify-center",
                              "cursor-pointer",
                              isSelected
                                ? "bg-indigo-500/80 text-white ring-2 ring-indigo-300 z-10 scale-110 shadow-md"
                                : isMarked
                                ? "bg-emerald-100 dark:bg-emerald-900/40 ring-1 ring-emerald-500/50"
                                : isWeekend || isHoliday
                                ? "bg-neutral-100 dark:bg-neutral-800/50"
                                : "bg-neutral-200/50 dark:bg-neutral-700/30",

                              (isWeekend || isHoliday) && !isSelected
                                ? "text-red-500/80 dark:text-red-400/80"
                                : !isSelected && "text-neutral-700 dark:text-neutral-300",

                              !isMarked &&
                                !isSelected &&
                                !isDragging &&
                                "hover:bg-indigo-500 dark:hover:bg-indigo-500 hover:text-white dark:hover:text-white hover:ring-2 ring-indigo-300 dark:ring-indigo-700 hover:z-20 hover:scale-125 hover:shadow-lg"
                            )}
                            title={`${monthName} ${day}, ${year}${isToday ? " (Today)" : ""}${
                              isHoliday ? " (Holiday)" : ""
                            }${isMarked ? ` - ${mark.task}` : ""}`}
                          >
                            <span className={cn("text-[10px] font-medium leading-none", isToday && "font-bold")}>
                              {day}
                            </span>
                            {isToday && (
                              <div className="absolute inset-0 border-2 border-indigo-600 dark:border-indigo-500 rounded-sm pointer-events-none" />
                            )}
                          </div>
                        );
                      })}

                      {Array.from({ length: TOTAL_COLUMNS - cells.length }).map((_, i) => (
                        <div
                          key={`scratch-${i}`}
                          className="aspect-square rounded-sm bg-transparent pointer-events-none"
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 px-2 text-xs text-neutral-400">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-neutral-200/50 dark:bg-neutral-700/30" />
          <span>Weekday</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-neutral-100 dark:bg-neutral-800/50" />
          <span>Weekend</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-emerald-100 dark:bg-emerald-900/40 ring-1 ring-emerald-500/50" />
          <span>Marked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm border-2 border-indigo-600 dark:border-indigo-500" />
          <span>Today</span>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <span className="text-neutral-300 dark:text-neutral-600">S M T ... represents Weekdays</span>
        </div>
      </div>

      {isModalOpen && selectedDates.length > 0 && (
        <TaskModal
          isOpen={isModalOpen}
          dates={selectedDates}
          initialTask={selectedDates.length === 1 ? marks[selectedDates[0]]?.task || null : null}
          onSave={handleSaveTask}
          onRemove={handleRemoveTask}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
