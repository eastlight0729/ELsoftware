import { memo } from "react";
import { cn } from "@/lib/utils";
import { CalendarRange } from "../api/useYearCalendar";
import { getRangeSegmentsForMonth } from "../utils";

interface MonthRangeLayerProps {
  year: number;
  monthIndex: number;
  ranges: CalendarRange[];
  monthStartStr: string;
  monthEndStr: string;
}

export const MonthRangeLayer = memo(function MonthRangeLayer({
  year,
  monthIndex,
  ranges,
  monthStartStr,
  monthEndStr,
}: MonthRangeLayerProps) {
  return (
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
              gridRow: 1,
            }}
          />
        );
      })}
    </div>
  );
});
