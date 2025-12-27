import { useState, useEffect, useRef } from "react";
import { ChevronUp, ChevronsUp, RotateCcw, HelpCircle, MoreHorizontal } from "lucide-react";

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleHelpClick = () => {
    onShowHelp();
    setIsMenuOpen(false);
  };

  return (
    <div className="grid grid-cols-[32px_1fr_32px] gap-6 px-6 pb-2 items-center border-b border-neutral-300 dark:border-neutral-700">
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
      <div className="flex items-center justify-center">
        <div className="relative flex items-center">
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

      {/* Top Right: Menu Button */}
      <div className="flex items-center justify-center" ref={menuRef}>
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-sm transition-colors text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200"
            title="Menu"
          >
            <MoreHorizontal size={16} />
          </button>

          {/* Menu Dropdown */}
          {isMenuOpen && (
            <div className="absolute top-full right-0 mt-1 w-40 bg-white dark:bg-neutral-800 rounded-md shadow-lg border border-neutral-200 dark:border-neutral-700 py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
              <button
                onClick={handleHelpClick}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
              >
                <HelpCircle size={14} />
                <span>Calendar Help</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
