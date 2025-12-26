import { useState, useEffect, useMemo, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  const [year, setYear] = useState(new Date().getFullYear());
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

  useEffect(() => {
    if (window.electron?.yearCalendar) {
      window.electron.yearCalendar.getHolidays(year).then((data: Record<string, string>) => {
        setHolidays(data);
      });
    }
  }, [year]);

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

  const handlePrevYear = () => setYear((y) => y - 1);
  const handleNextYear = () => setYear((y) => y + 1);

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

  return (
    <div className="w-full h-full flex flex-col gap-6 animate-in fade-in duration-500 select-none">
      {/* Header */}
      <div className="flex items-center justify-end px-2">
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
      <div className="flex-1 overflow-hidden flex flex-col border-y border-neutral-300 dark:border-neutral-700">
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
              {MONTHS.map((monthName, monthIndex) => (
                <MonthGrid
                  key={monthName}
                  monthName={monthName}
                  monthIndex={monthIndex}
                  year={year}
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
