import { memo } from "react";
import { cn } from "@/lib/utils";

interface DayCellProps {
  day: number; // 1-31
  dateStr: string; // YYYY-MM-DD
  monthName: string;
  dayOfWeek: string;
  isToday: boolean;
  isWeekend: boolean;
  holidayName?: string;
  isCovered: boolean;
  hasAction?: boolean;
  actionTask?: string;
  onMouseDown: (dateStr: string, e: React.MouseEvent) => void;
  onMouseEnter: (dateStr: string) => void;
}

export const DayCell = memo(function DayCell({
  day,
  dateStr,
  monthName,
  dayOfWeek,
  isToday,
  isWeekend,
  holidayName,
  isCovered,
  hasAction,
  actionTask,
  onMouseDown,
  onMouseEnter,
}: DayCellProps) {
  const isHoliday = !!holidayName;

  return (
    <div
      onMouseDown={(e) => onMouseDown(dateStr, e)}
      onMouseEnter={() => onMouseEnter(dateStr)}
      className={cn(
        "aspect-square rounded-sm transition-all duration-100 relative flex items-center justify-center cursor-pointer group/cell",
        isCovered ? "bg-transparent" : isWeekend ? "bg-neutral-100 dark:bg-neutral-800/50" : "bg-transparent",
        isWeekend || isHoliday ? "text-red-500/80 dark:text-red-400/80" : "text-neutral-700 dark:text-neutral-300",
        "hover:bg-green-500/20 hover:z-50"
      )}
    >
      <span className={cn("text-[10px] font-medium leading-none", isToday && "font-bold")}>{day}</span>
      {isToday && (
        <div className="absolute inset-0 border-2 border-indigo-600 dark:border-indigo-500 rounded-sm pointer-events-none" />
      )}
      {hasAction && (
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-1.5 bg-green-600 dark:bg-green-500"
          style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
        />
      )}{" "}
      {/* Custom Tooltip */}
      <div
        className={cn(
          "absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 text-[10px] rounded-md shadow-sm whitespace-nowrap pointer-events-none opacity-0 group-hover/cell:opacity-100 transition-opacity duration-75 z-50",
          "bg-neutral-800 text-white dark:bg-neutral-200 dark:text-neutral-900"
        )}
      >
        {`${monthName} ${day}, ${dayOfWeek}${isToday ? " (Today)" : ""}${isHoliday ? ` (${holidayName})` : ""}`}
        {actionTask && (
          <div className="font-semibold border-t border-white/20 dark:border-neutral-700/50 mt-1 pt-1">
            {actionTask.split("\n")[0]}
          </div>
        )}
      </div>
    </div>
  );
});
