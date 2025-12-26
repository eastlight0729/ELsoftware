import { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  useYearCalendarRanges,
  useUpsertYearCalendarRange,
  useDeleteYearCalendarRange,
  CalendarRange,
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
  const { data: ranges = [] } = useYearCalendarRanges();
  const upsertRangeMutation = useUpsertYearCalendarRange();
  const deleteRangeMutation = useDeleteYearCalendarRange();

  const [holidays, setHolidays] = useState<Set<string>>(new Set());

  // Selection / Dragging state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<string | null>(null);
  const [dragCurrent, setDragCurrent] = useState<string | null>(null);

  // Selected Range for Modal
  const [selectedRange, setSelectedRange] = useState<{ start: string; end: string; id?: string; task?: string } | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Determine current effective drag selection for highlighting temporary overlay
  const dragSelection = useMemo(() => {
    if (isDragging && dragStart && dragCurrent) {
      const start = new Date(dragStart);
      const end = new Date(dragCurrent);
      return start < end ? { start: dragStart, end: dragCurrent } : { start: dragCurrent, end: dragStart };
    }
    return null;
  }, [isDragging, dragStart, dragCurrent]);

  const today = new Date();

  useEffect(() => {
    if (window.electron?.yearCalendar) {
      window.electron.yearCalendar.getHolidays(year).then((data: string[]) => {
        setHolidays(new Set(data));
      });
    }
  }, [year]);

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
    // Only start drag if we aren't clicking an existing range (handled by stopPropagation on range overlay)
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
      // Prepare to open modal provided valid range
      const start = new Date(dragStart);
      const end = new Date(dragCurrent);
      const s = start < end ? dragStart : dragCurrent;
      const e = start < end ? dragCurrent : dragStart;

      setSelectedRange({ start: s, end: e });
      setIsModalOpen(true);
    }
    setIsDragging(false);
    setDragStart(null);
    setDragCurrent(null);
  };

  const handleSaveTask = (task: string) => {
    if (selectedRange) {
      upsertRangeMutation.mutate({
        id: selectedRange.id,
        startDate: selectedRange.start,
        endDate: selectedRange.end,
        task,
      });
      setIsModalOpen(false);
      setSelectedRange(null);
    }
  };

  const handleRemoveTask = () => {
    if (selectedRange?.id) {
      deleteRangeMutation.mutate(selectedRange.id);
      setIsModalOpen(false);
      setSelectedRange(null);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRange(null);
  };

  const handleRangeClick = (range: CalendarRange, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedRange({
      start: range.start_date,
      end: range.end_date,
      id: range.id,
      task: range.task,
    });
    setIsModalOpen(true);
  };

  // Helper to calculate segments for overlays
  const getRangeSegmentsForMonth = (
    startStr: string,
    endStr: string,
    monthIndex: number,
    year: number
  ): { startCol: number; span: number } | null => {
    const rangeStart = new Date(startStr);
    const rangeEnd = new Date(endStr);

    // Month boundaries
    const monthStart = new Date(year, monthIndex, 1);
    const monthEnd = new Date(year, monthIndex + 1, 0);

    // Check intersection
    if (rangeEnd < monthStart || rangeStart > monthEnd) return null;

    // Calculate effective start/end within this month
    const effectiveStart = rangeStart < monthStart ? monthStart : rangeStart;
    const effectiveEnd = rangeEnd > monthEnd ? monthEnd : rangeEnd;

    // Calculate Grid Positions
    const startDayOfMonth = getStartDayOfMonth(monthIndex, year); // e.g., 0 for Mon
    // Day of month (1-based)
    const startDay = effectiveStart.getDate();
    const endDay = effectiveEnd.getDate();

    // Grid Column Start = offset + day
    const startCol = startDayOfMonth + startDay;

    // Span = (end - start) + 1
    const span = endDay - startDay + 1;

    return { startCol, span };
  };

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

                // Cells for Grid
                const cells = [
                  ...Array.from({ length: startDay }, () => null),
                  ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
                ];

                return (
                  <div key={monthName} className="flex items-center group gap-6 relative">
                    <div className="w-8 shrink-0 flex justify-end pr-3">
                      <span className="text-sm font-semibold text-neutral-400 dark:text-neutral-500 group-hover:text-primary-500 transition-colors">
                        {monthIndex + 1}
                      </span>
                    </div>

                    <div className="flex-1 relative">
                      {/* Day Grid (Bottom Layer) */}
                      <div className="grid grid-cols-37 gap-1">
                        {cells.map((day, cellIndex) => {
                          const isWeekend = cellIndex % 7 === 5 || cellIndex % 7 === 6;

                          if (day === null) {
                            return (
                              <div
                                key={`blank-${cellIndex}`}
                                className="aspect-square rounded-sm bg-transparent pointer-events-none"
                              />
                            );
                          }

                          const isToday =
                            year === today.getFullYear() && monthIndex === today.getMonth() && day === today.getDate();

                          const dateStr = formatDate(year, monthIndex, day);
                          const isHoliday = holidays.has(dateStr);

                          return (
                            <div
                              key={`day-${day}`}
                              onMouseDown={() => handleMouseDown(dateStr)}
                              onMouseEnter={() => handleMouseEnter(dateStr)}
                              className={cn(
                                "aspect-square rounded-sm transition-all duration-100 relative flex items-center justify-center cursor-pointer",
                                isWeekend || isHoliday
                                  ? "bg-neutral-100 dark:bg-neutral-800/50 text-red-500/80 dark:text-red-400/80"
                                  : "bg-neutral-200/50 dark:bg-neutral-700/30 text-neutral-700 dark:text-neutral-300",
                                "hover:bg-indigo-500/20 hover:z-0"
                              )}
                              title={`${monthName} ${day}, ${year}${isToday ? " (Today)" : ""}${
                                isHoliday ? " (Holiday)" : ""
                              }`}
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

                      {/* Range Overlays (Top Layer) */}
                      <div className="absolute inset-0 grid grid-cols-37 gap-1 pointer-events-none">
                        {/* Render Saved Ranges */}
                        {ranges.map((range) => {
                          const segments = getRangeSegmentsForMonth(range.start_date, range.end_date, monthIndex, year);
                          if (!segments) return null;
                          return (
                            <div
                              key={range.id}
                              onClick={(e) => handleRangeClick(range, e)}
                              className={cn(
                                "rounded-sm bg-indigo-500/80 dark:bg-indigo-500/60 shadow-md ring-1 ring-indigo-400 backdrop-blur-[1px] cursor-pointer hover:bg-indigo-500 hover:scale-[1.02] transition-all z-10 pointer-events-auto",
                                "flex items-center justify-center overflow-hidden"
                              )}
                              style={{
                                gridColumnStart: segments.startCol,
                                gridColumnEnd: `span ${segments.span}`,
                              }}
                              title={range.task}
                            >
                              <span className="text-[10px] text-white truncate px-1 font-medium opacity-0 hover:opacity-100 transition-opacity">
                                {range.task}
                              </span>
                            </div>
                          );
                        })}

                        {/* Render Drag Preview Range */}
                        {dragSelection &&
                          (() => {
                            const segments = getRangeSegmentsForMonth(
                              dragSelection.start,
                              dragSelection.end,
                              monthIndex,
                              year
                            );
                            if (!segments) return null;
                            return (
                              <div
                                className="rounded-sm bg-indigo-400/50 ring-2 ring-indigo-500 z-20 pointer-events-none"
                                style={{
                                  gridColumnStart: segments.startCol,
                                  gridColumnEnd: `span ${segments.span}`,
                                }}
                              />
                            );
                          })()}
                      </div>
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
          <div className="w-4 h-4 rounded-sm bg-indigo-500/80 ring-1 ring-indigo-400" />
          <span>Task Range</span>
        </div>
      </div>

      {isModalOpen && selectedRange && (
        <TaskModal
          isOpen={isModalOpen}
          dates={getDatesInRange(selectedRange.start, selectedRange.end)}
          initialTask={selectedRange.task || null}
          onSave={handleSaveTask}
          onRemove={handleRemoveTask}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
