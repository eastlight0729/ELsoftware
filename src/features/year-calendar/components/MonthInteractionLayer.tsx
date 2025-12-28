import { memo } from "react";
import { cn } from "@/lib/utils";
import { CalendarRange } from "../api/useYearCalendar";
import { getRangeSegmentsForMonth } from "../utils";

interface MonthInteractionLayerProps {
  year: number;
  monthIndex: number;
  ranges: CalendarRange[];
  dragSelection: { start: string; end: string } | null;
  onRangeClick: (range: CalendarRange, e: React.MouseEvent) => void;
  monthStartStr: string;
  monthEndStr: string;
}

export const MonthInteractionLayer = memo(function MonthInteractionLayer({
  year,
  monthIndex,
  ranges,
  dragSelection,
  onRangeClick,
  monthStartStr,
  monthEndStr,
}: MonthInteractionLayerProps) {
  return (
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
              "group/range relative z-10 hover:z-50",
              "rounded-sm cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 transition-colors pointer-events-auto",
              "flex items-center justify-center",
              !isEnd && "rounded-r-none",
              !isStart && "rounded-l-none"
            )}
            style={{
              gridColumnStart: segments.startCol,
              gridColumnEnd: `span ${segments.span}`,
              gridRow: 1,
            }}
          >
            {/* Tooltip */}
            {range.task && (
              <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs rounded-sm py-1 px-2 whitespace-nowrap opacity-0 group-hover/range:opacity-100 transition-opacity pointer-events-none drop-shadow-md z-50">
                {range.task}
              </div>
            )}
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
                gridRow: 1,
              }}
            />
          );
        })()}
    </div>
  );
});
