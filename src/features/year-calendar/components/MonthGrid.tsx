import { memo, useMemo } from "react";
import { cn } from "@/lib/utils";
import { CalendarRange } from "../api/useYearCalendar";
import { getDaysInMonth, getRangeSegmentsForMonth, getStartDayOfMonth, formatDate, TOTAL_COLUMNS } from "../utils";

interface MonthGridProps {
  year: number;
  monthIndex: number;
  monthName: string;
  holidays: Set<string>;
  ranges: CalendarRange[];
  dragSelection: { start: string; end: string } | null;
  onMouseDown: (dateStr: string) => void;
  onMouseEnter: (dateStr: string) => void;
  onRangeClick: (range: CalendarRange, e: React.MouseEvent) => void;
}

export const MonthGrid = memo(function MonthGrid({
  year,
  monthIndex,
  monthName,
  holidays,
  ranges,
  dragSelection,
  onMouseDown,
  onMouseEnter,
  onRangeClick,
}: MonthGridProps) {
  const daysInMonth = getDaysInMonth(monthIndex, year);
  const startDay = getStartDayOfMonth(monthIndex, year);
  const today = new Date();

  const monthRanges = useMemo(() => {
    const start = formatDate(year, monthIndex, 1);
    const end = formatDate(year, monthIndex, daysInMonth);
    return ranges.filter((r) => r.start_date <= end && r.end_date >= start);
  }, [ranges, year, monthIndex, daysInMonth]);

  // Cells for Grid
  const cells = [
    ...Array.from({ length: startDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="flex items-center group gap-6 relative">
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

            const isToday = year === today.getFullYear() && monthIndex === today.getMonth() && day === today.getDate();

            const dateStr = formatDate(year, monthIndex, day);
            const isHoliday = holidays.has(dateStr);

            const isCovered =
              (dragSelection && dateStr >= dragSelection.start && dateStr <= dragSelection.end) ||
              monthRanges.some((r) => dateStr >= r.start_date && dateStr <= r.end_date);

            return (
              <div
                key={`day-${day}`}
                onMouseDown={() => onMouseDown(dateStr)}
                onMouseEnter={() => onMouseEnter(dateStr)}
                className={cn(
                  "aspect-square rounded-sm transition-all duration-100 relative flex items-center justify-center cursor-pointer",
                  isCovered ? "bg-transparent" : isWeekend ? "bg-neutral-100 dark:bg-neutral-800/50" : "bg-transparent",
                  isWeekend || isHoliday
                    ? "text-red-500/80 dark:text-red-400/80"
                    : "text-neutral-700 dark:text-neutral-300",
                  "hover:bg-green-500/20 hover:z-0"
                )}
                title={`${monthName} ${day}, ${year}${isToday ? " (Today)" : ""}${isHoliday ? " (Holiday)" : ""}`}
              >
                <span className={cn("text-[10px] font-medium leading-none", isToday && "font-bold")}>{day}</span>
                {isToday && (
                  <div className="absolute inset-0 border-2 border-indigo-600 dark:border-indigo-500 rounded-sm pointer-events-none" />
                )}
              </div>
            );
          })}
          {Array.from({ length: TOTAL_COLUMNS - cells.length }).map((_, i) => (
            <div key={`scratch-${i}`} className="aspect-square rounded-sm bg-transparent pointer-events-none" />
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
                onClick={(e) => onRangeClick(range, e)}
                className={cn(
                  "rounded-sm bg-green-500/50 dark:bg-green-500/40 cursor-pointer hover:bg-green-500/70 hover:scale-[1.02] transition-all z-10 pointer-events-auto",
                  "flex items-center justify-center overflow-hidden"
                )}
                style={{
                  gridColumnStart: segments.startCol,
                  gridColumnEnd: `span ${segments.span}`,
                }}
                title={range.task || ""}
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
              const segments = getRangeSegmentsForMonth(dragSelection.start, dragSelection.end, monthIndex, year);
              if (!segments) return null;
              return (
                <div
                  className="rounded-sm bg-green-400/30 z-20 pointer-events-none"
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
});
