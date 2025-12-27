import { memo, useMemo } from "react";
import { cn } from "@/lib/utils";
import { CalendarRange, CalendarMark } from "../api/useYearCalendar";
import { getDaysInMonth, getRangeSegmentsForMonth, getStartDayOfMonth, formatDate, TOTAL_COLUMNS } from "../utils";
import { DayCell } from "./DayCell";

const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

interface MonthGridProps {
  year: number;
  monthIndex: number;
  monthName: string;
  holidays: Record<string, string>;
  ranges: CalendarRange[];
  marks: CalendarMark[];
  dragSelection: { start: string; end: string } | null;
  onMouseDown: (dateStr: string) => void;
  onMouseEnter: (dateStr: string) => void;
  onRangeClick: (range: CalendarRange, e: React.MouseEvent) => void;
  onActionClick?: (mark: CalendarMark, e: React.MouseEvent) => void; // Optional if we want direct click handler for actions later, but interaction is via cell click for now
}

export const MonthGrid = memo(function MonthGrid({
  year,
  monthIndex,
  monthName,
  holidays,
  ranges,
  marks,
  dragSelection,
  onMouseDown,
  onMouseEnter,
  onRangeClick,
}: MonthGridProps) {
  const daysInMonth = getDaysInMonth(monthIndex, year);
  const startDay = getStartDayOfMonth(monthIndex, year);
  const today = new Date();

  const monthStartStr = formatDate(year, monthIndex, 1);
  const monthEndStr = formatDate(year, monthIndex, daysInMonth);

  const monthRanges = useMemo(() => {
    return ranges.filter((r) => r.start_date <= monthEndStr && r.end_date >= monthStartStr);
  }, [ranges, monthStartStr, monthEndStr]);

  const monthMarks = useMemo(() => {
    return marks.filter((m) => m.date >= monthStartStr && m.date <= monthEndStr);
  }, [marks, monthStartStr, monthEndStr]);

  const marksMap = useMemo(() => {
    const map = new Set<string>();
    monthMarks.forEach((m) => map.add(m.date));
    return map;
  }, [monthMarks]);

  // Cells for Grid
  const cells = [
    ...Array.from({ length: startDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="flex items-center group gap-6 relative">
      {/* ... header ... */}
      <div className="w-8 shrink-0 flex justify-end pr-3">
        <span className="text-sm font-semibold text-neutral-400 dark:text-neutral-500 group-hover:text-primary-500 transition-colors">
          {monthIndex + 1}
        </span>
      </div>

      <div className="flex-1 relative mr-2 min-w-0">
        {/* Range Backgrounds (Bottom Layer - Colors) */}
        <div className="absolute inset-0 grid grid-cols-37 gap-1 pointer-events-none z-0">
          {ranges.map((range) => {
            const segments = getRangeSegmentsForMonth(range.start_date, range.end_date, monthIndex, year);
            if (!segments) return null;

            const isStart = range.start_date >= monthStartStr;
            const isEnd = range.end_date <= monthEndStr;

            const isSmall = range.size === "1" || range.size === "2";

            return (
              <div
                key={`bg-${range.id}`}
                className={cn(
                  "rounded-sm relative",
                  "bg-green-300 dark:bg-green-700",
                  isSmall ? "h-1.5 self-end mb-1" : "h-full",
                  !isStart &&
                    "rounded-l-none before:content-[''] before:absolute before:right-full before:top-0 before:bottom-0 before:w-6 before:bg-linear-to-r before:from-transparent before:to-green-300 dark:before:to-green-700",
                  !isEnd &&
                    "rounded-r-none after:content-[''] after:absolute after:left-full after:top-0 after:bottom-0 after:w-6 after:bg-linear-to-r after:from-green-300 after:to-transparent dark:after:from-green-700"
                )}
                style={{
                  gridColumnStart: segments.startCol,
                  gridColumnEnd: `span ${segments.span}`,
                }}
              />
            );
          })}
        </div>

        {/* Day Grid (Middle Layer - Text) */}
        <div className="grid grid-cols-37 gap-1 relative z-10">
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
            const holidayName = holidays[dateStr];
            const dayOfWeek = DAY_NAMES[cellIndex % 7];

            const isCoveredByRange = monthRanges.some((r) => dateStr >= r.start_date && dateStr <= r.end_date);
            const isCoveredByDrag = dragSelection && dateStr >= dragSelection.start && dateStr <= dragSelection.end;
            const isCovered = !!(isCoveredByRange || isCoveredByDrag);
            const hasAction = marksMap.has(dateStr);

            return (
              <DayCell
                key={`day-${day}`}
                day={day}
                dateStr={dateStr}
                monthName={monthName}
                dayOfWeek={dayOfWeek}
                isToday={isToday}
                isWeekend={isWeekend}
                holidayName={holidayName}
                isCovered={isCovered}
                hasAction={hasAction}
                onMouseDown={onMouseDown}
                onMouseEnter={onMouseEnter}
              />
            );
          })}
          {Array.from({ length: TOTAL_COLUMNS - cells.length }).map((_, i) => (
            <div key={`scratch-${i}`} className="aspect-square rounded-sm bg-transparent pointer-events-none" />
          ))}
        </div>

        {/* Range Overlays (Top Layer - Interactions) */}
        <div className="absolute inset-0 grid grid-cols-37 gap-1 pointer-events-none z-20">
          {/* Render Saved Ranges */}
          {ranges.map((range) => {
            const segments = getRangeSegmentsForMonth(range.start_date, range.end_date, monthIndex, year);
            if (!segments) return null;

            const isStart = range.start_date >= monthStartStr;
            const isEnd = range.end_date <= monthEndStr;

            return (
              <div
                key={range.id}
                onClick={(e) => onRangeClick(range, e)}
                className={cn(
                  "rounded-sm cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 transition-colors pointer-events-auto",
                  "flex items-center justify-center overflow-hidden",
                  !isEnd && "rounded-r-none",
                  !isStart && "rounded-l-none"
                )}
                style={{
                  gridColumnStart: segments.startCol,
                  gridColumnEnd: `span ${segments.span}`,
                }}
                title={range.task || ""}
              >
                <span className="text-[10px] text-white truncate px-1 font-medium opacity-0 hover:opacity-100 transition-opacity drop-shadow-md">
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

              const isStart = dragSelection.start >= monthStartStr;
              const isEnd = dragSelection.end <= monthEndStr;

              return (
                <div
                  className={cn(
                    "rounded-sm relative",
                    "bg-green-400/30",
                    !isStart &&
                      "rounded-l-none before:content-[''] before:absolute before:right-full before:top-0 before:bottom-0 before:w-6 before:bg-linear-to-r before:from-transparent before:to-green-400/30",
                    !isEnd &&
                      "rounded-r-none after:content-[''] after:absolute after:left-full after:top-0 after:bottom-0 after:w-6 after:bg-linear-to-r after:from-green-400/30 after:to-transparent"
                  )}
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
