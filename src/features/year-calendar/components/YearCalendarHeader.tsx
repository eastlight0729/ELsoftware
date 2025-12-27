import { ChevronUp, ChevronsUp, RotateCcw, Info } from "lucide-react";

interface YearCalendarHeaderProps {
  yearDisplay: string;
  isTodayVisible: boolean;
  onPrevYear: () => void;
  onPrevMonth: () => void;
  onGoToToday: () => void;
  onShowHelp: () => void;
}

export function YearCalendarHeader({
  yearDisplay,
  isTodayVisible,
  onPrevYear,
  onPrevMonth,
  onGoToToday,
  onShowHelp,
}: YearCalendarHeaderProps) {
  return (
    <div className="grid grid-cols-[32px_1fr] gap-6 px-6 pb-2 border-b border-neutral-300 dark:border-neutral-700">
      {/* Top Left: Up Buttons */}
      <div className="flex flex-col items-center gap-1">
        <button
          onClick={onPrevYear}
          className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-sm transition-colors text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200"
          title="Previous Year"
        >
          <ChevronsUp size={16} />
        </button>
        <button
          onClick={onPrevMonth}
          className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-sm transition-colors text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
          title="Previous Month"
        >
          <ChevronUp size={16} />
        </button>
      </div>

      {/* Top Center: Year Text & Reset Button */}
      <div className="flex items-center justify-center pb-1">
        <div className="relative flex items-center">
          <button
            onClick={onShowHelp}
            className="absolute right-full mr-4 p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-sm transition-colors text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200"
            title="Calendar Info"
          >
            <Info size={16} />
          </button>
          <span className="text-xl font-mono font-medium text-neutral-700 dark:text-neutral-200 leading-none">
            {yearDisplay}
          </span>
          {!isTodayVisible && (
            <button
              onClick={onGoToToday}
              className="absolute left-full ml-4 p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-sm transition-colors text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200"
              title="Go to Today"
            >
              <RotateCcw size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
