import { memo, useMemo } from "react";
import { CalendarRange, CalendarMark } from "../api/useYearCalendar";
import { getDaysInMonth, getStartDayOfMonth, formatDate, TOTAL_COLUMNS } from "../utils";
import { DayCell } from "./DayCell";
import { MonthRangeLayer } from "./MonthRangeLayer";
import { MonthInteractionLayer } from "./MonthInteractionLayer";

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
  onActionClick?: (mark: CalendarMark, e: React.MouseEvent) => void;
}

export const MonthGrid = memo(
  function MonthGrid({
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
          <MonthRangeLayer
            year={year}
            monthIndex={monthIndex}
            ranges={monthRanges}
            monthStartStr={monthStartStr}
            monthEndStr={monthEndStr}
          />

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

              const isToday =
                year === today.getFullYear() && monthIndex === today.getMonth() && day === today.getDate();

              const dateStr = formatDate(year, monthIndex, day);

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
                  dayOfWeek={DAY_NAMES[cellIndex % 7]}
                  isToday={isToday}
                  isWeekend={isWeekend}
                  holidayName={holidays[dateStr]}
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
          <MonthInteractionLayer
            year={year}
            monthIndex={monthIndex}
            ranges={monthRanges}
            dragSelection={dragSelection}
            onRangeClick={onRangeClick}
            monthStartStr={monthStartStr}
            monthEndStr={monthEndStr}
          />
        </div>
      </div>
    );
  },
  (prev, next) => {
    // 1. Primitive & Stable Props Check
    if (
      prev.year !== next.year ||
      prev.monthIndex !== next.monthIndex ||
      prev.monthName !== next.monthName ||
      prev.ranges !== next.ranges ||
      prev.marks !== next.marks ||
      prev.holidays !== next.holidays ||
      prev.onMouseDown !== next.onMouseDown ||
      prev.onMouseEnter !== next.onMouseEnter ||
      prev.onRangeClick !== next.onRangeClick ||
      prev.onActionClick !== next.onActionClick
    ) {
      return false;
    }

    // 2. Drag Selection Optimization
    // If drag selection hasn't changed, we're good (implied by primitives if ref stable, but object changes ref)
    if (prev.dragSelection === next.dragSelection) return true;

    // Drag selection changed reference. Check if it affects *this* month.
    const mStart = formatDate(next.year, next.monthIndex, 1);
    const days = getDaysInMonth(next.monthIndex, next.year);
    const mEnd = formatDate(next.year, next.monthIndex, days);

    const overlaps = (sel: { start: string; end: string } | null) => {
      if (!sel) return false;
      return sel.start <= mEnd && sel.end >= mStart;
    };

    const prevOverlaps = overlaps(prev.dragSelection);
    const nextOverlaps = overlaps(next.dragSelection);

    // If both are outside this month, the visual range didn't change for this month.
    if (!prevOverlaps && !nextOverlaps) return true;

    // Otherwise, we need to re-render.
    return false;
  }
);
