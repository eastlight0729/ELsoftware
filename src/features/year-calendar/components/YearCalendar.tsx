import { useState, useEffect, useMemo, useCallback } from "react";
import { ChevronUp, ChevronDown, ChevronsUp, ChevronsDown } from "lucide-react";
import {
  useYearCalendarRanges,
  useUpsertYearCalendarRange,
  useDeleteYearCalendarRange,
  CalendarRange,
} from "../api/useYearCalendar";
import { TaskModal } from "./TaskModal";
import { MonthGrid } from "./MonthGrid";
import { MONTHS, WEEKDAY_LABELS, TOTAL_COLUMNS, getDatesInRange } from "../utils";
import { cn } from "@/lib/utils";

export function YearCalendar() {
  // Start date of the 12-month view. Always day 1 of a month.
  const [startDate, setStartDate] = useState(() => {
    try {
      const saved = localStorage.getItem("active_year_calendar_date");
      if (saved) {
        const date = new Date(saved);
        if (!isNaN(date.getTime())) {
          return new Date(date.getFullYear(), date.getMonth(), 1);
        }
      }
    } catch (e) {
      console.error("Failed to parse saved calendar date", e);
    }
    return new Date(new Date().getFullYear(), 0, 1);
  });

  useEffect(() => {
    localStorage.setItem("active_year_calendar_date", startDate.toISOString());
  }, [startDate]);
  const { data: ranges = [] } = useYearCalendarRanges();
  const upsertRangeMutation = useUpsertYearCalendarRange();
  const deleteRangeMutation = useDeleteYearCalendarRange();

  const [holidays, setHolidays] = useState<Record<string, string>>({});

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

  // Generate the 12 months to display
  const monthsToRender = useMemo(() => {
    const months: { year: number; monthIndex: number; name: string; key: string }[] = [];
    const currentYear = startDate.getFullYear();
    const currentMonth = startDate.getMonth();

    for (let i = 0; i < 12; i++) {
      // Create date for each month
      // Note: Date(year, month + i, 1) handles year overflow automatically
      const d = new Date(currentYear, currentMonth + i, 1);
      months.push({
        year: d.getFullYear(),
        monthIndex: d.getMonth(), // 0-11
        name: MONTHS[d.getMonth()],
        key: `${d.getFullYear()}-${d.getMonth()}`,
      });
    }
    return months;
  }, [startDate]);

  // Fetch holidays for all years in view
  useEffect(() => {
    if (window.electron?.yearCalendar) {
      const years = Array.from(new Set(monthsToRender.map((m) => m.year)));
      Promise.all(years.map((y) => window.electron.yearCalendar.getHolidays(y))).then(
        (results: Array<Record<string, string>>) => {
          const merged = Object.assign({}, ...results);
          setHolidays(merged);
        }
      );
    }
  }, [monthsToRender]); // Re-run when view changes

  const finishDrag = useCallback(() => {
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
  }, [dragStart, dragCurrent]);

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        finishDrag();
      }
    };
    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, [isDragging, finishDrag]);

  const handlePrevYear = () => setStartDate((d) => new Date(d.getFullYear() - 1, d.getMonth(), 1));
  const handleNextYear = () => setStartDate((d) => new Date(d.getFullYear() + 1, d.getMonth(), 1));

  const handlePrevMonth = () => setStartDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const handleNextMonth = () => setStartDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  // Drag Handlers
  const handleMouseDown = useCallback((dateStr: string) => {
    setIsDragging(true);
    setDragStart(dateStr);
    setDragCurrent(dateStr);
  }, []);

  const handleMouseEnter = useCallback(
    (dateStr: string) => {
      if (isDragging) {
        setDragCurrent(dateStr);
      }
    },
    [isDragging]
  );

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

  const handleRangeClick = useCallback((range: CalendarRange, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedRange({
      start: range.start_date,
      end: range.end_date,
      id: range.id,
      task: range.task || "", // Handle null task
    });
    setIsModalOpen(true);
  }, []);

  const years = Array.from(new Set(monthsToRender.map((m) => m.year)));
  const yearDisplay = years.length > 1 ? `${years[0]} - ${years[1]}` : `${years[0]}`;

  return (
    <div className="w-full h-full flex flex-col gap-6 animate-in fade-in duration-500 select-none">
      {/* Header Area */}
      <div className="grid grid-cols-[32px_1fr] gap-6 px-6 pb-2 border-b border-neutral-300 dark:border-neutral-700">
        {/* Top Left: Up Buttons */}
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={handlePrevYear}
            className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-sm transition-colors text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200"
            title="Previous Year"
          >
            <ChevronsUp size={16} />
          </button>
          <button
            onClick={handlePrevMonth}
            className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-sm transition-colors text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
            title="Previous Month"
          >
            <ChevronUp size={16} />
          </button>
        </div>

        {/* Top Center: Year Text */}
        <div className="flex items-end justify-center pb-1">
          <span className="text-xl font-mono font-medium text-neutral-700 dark:text-neutral-200">{yearDisplay}</span>
        </div>
      </div>

      {/* Calendar Grid Container */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 pt-2">
          <div>
            {/* Grid Header (Weekdays) */}
            {/* We need to align this with the grid below, keeping the left spacer for the month numbers/buttons */}
            <div className="flex mb-2 gap-6">
              <div className="w-8 shrink-0" /> {/* Spacer for Month Numbers column */}
              <div className="flex-1 grid grid-cols-37 gap-1 mr-2 min-w-0">
                {Array.from({ length: TOTAL_COLUMNS }).map((_, i) => {
                  const isWeekend = i % 7 === 5 || i % 7 === 6;
                  return (
                    <div key={i} className="text-center">
                      <span
                        className={cn(
                          "text-[10px] font-bold",
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
              {monthsToRender.map((month) => (
                <MonthGrid
                  key={month.key}
                  monthName={month.name}
                  monthIndex={month.monthIndex}
                  year={month.year}
                  holidays={holidays}
                  ranges={ranges}
                  dragSelection={dragSelection}
                  onMouseDown={handleMouseDown}
                  onMouseEnter={handleMouseEnter}
                  onRangeClick={handleRangeClick}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Footer Area (Down Buttons) */}
        {/* Aligned with the left column */}
        <div className="px-6 pt-2 pb-4 border-t border-neutral-300 dark:border-neutral-700">
          <div className="flex flex-col items-center w-8 gap-1">
            <button
              onClick={handleNextMonth}
              className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-sm transition-colors text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
              title="Next Month"
            >
              <ChevronDown size={16} />
            </button>
            <button
              onClick={handleNextYear}
              className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-sm transition-colors text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200"
              title="Next Year"
            >
              <ChevronsDown size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 px-2 text-xs text-neutral-400">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm bg-green-500/50" />
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
