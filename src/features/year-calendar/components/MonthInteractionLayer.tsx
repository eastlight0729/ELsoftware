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

        const sizeClass = (() => {
          switch (range.size) {
            case "1":
              return "h-1/4 self-end";
            case "2":
              return "h-1/2 self-end";
            case "3":
              return "h-3/4 self-end";
            default:
              return "h-full";
          }
        })();

        return (
          <div
            key={range.id}
            onClick={(e) => onRangeClick(range, e)}
            className={cn(
              "group/range relative z-10 hover:z-50",
              "rounded-sm cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 transition-colors pointer-events-auto",
              "flex items-center justify-center",
              sizeClass,
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
            {/* Tooltip */}
            <div
              className={cn(
                "absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 text-[10px] rounded-md shadow-sm whitespace-nowrap pointer-events-none opacity-0 group-hover/range:opacity-100 transition-opacity duration-75 z-50",
                "bg-neutral-800 text-white dark:bg-neutral-200 dark:text-neutral-900"
              )}
            >
              {(() => {
                const start = new Date(range.start_date).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                });
                const end = new Date(range.end_date).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                });
                return range.start_date === range.end_date ? start : `${start} - ${end}`;
              })()}
              {range.task && (
                <div className="font-semibold border-t border-white/20 dark:border-neutral-700/50 mt-1 pt-1">
                  {range.task.split("\n")[0]}
                </div>
              )}
            </div>
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
