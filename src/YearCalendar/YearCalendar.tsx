import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Maximum columns needed: 6 (max start offset) + 31 (max days) = 37
const TOTAL_COLUMNS = 37;
const WEEKDAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

export function YearCalendar() {
  const [year, setYear] = useState(new Date().getFullYear());

  const getDaysInMonth = (monthIndex: number, year: number) => {
    return new Date(year, monthIndex + 1, 0).getDate();
  };

  const getStartDayOfMonth = (monthIndex: number, year: number) => {
    // 0 = Monday, ..., 6 = Sunday
    const day = new Date(year, monthIndex, 1).getDay();
    // Convert 0(Sun)..6(Sat) to 0(Mon)..6(Sun)
    // Sun(0) -> 6
    // Mon(1) -> 0
    return (day + 6) % 7;
  };

  const handlePrevYear = () => setYear((y) => y - 1);
  const handleNextYear = () => setYear((y) => y + 1);

  return (
    <div className="w-full h-full flex flex-col gap-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between px-2">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-neutral-800 to-neutral-500 dark:from-neutral-100 dark:to-neutral-400">
          Year Calendar
        </h1>

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
      <div className="flex-1 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-xl overflow-hidden flex flex-col">
        {/* Scrollable Area */}
        <div className="flex-1 overflow-auto p-6">
          <div className="inline-block min-w-full">
            {/* Grid Header (Weekdays) */}
            <div className="flex mb-4">
              {/* Month Label Spacer */}
              <div className="w-24 shrink-0" />
              {/* Columns */}
              <div className="flex-1 grid grid-cols-[repeat(37,minmax(0,1fr))] gap-1">
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
              {MONTHS.map((monthName, monthIndex) => {
                const daysInMonth = getDaysInMonth(monthIndex, year);
                const startDay = getStartDayOfMonth(monthIndex, year);

                // Create an array representing the cells for this row
                // 1. Empty cells for offset
                // 2. Day numbers
                const cells = [
                  ...Array.from({ length: startDay }, () => null),
                  ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
                ];

                return (
                  <div key={monthName} className="flex items-center group">
                    {/* Month Name */}
                    <div className="w-24 shrink-0">
                      <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-300 group-hover:text-primary-500 transition-colors uppercase tracking-wide">
                        {monthName.substring(0, 3)}
                      </span>
                    </div>

                    {/* Days Grid */}
                    <div className="flex-1 grid grid-cols-[repeat(37,minmax(0,1fr))] gap-1">
                      {/* Render valid cells (blanks + days) */}
                      {cells.map((day, cellIndex) => {
                        // Global column index determines weekday
                        const isWeekend = cellIndex % 7 === 5 || cellIndex % 7 === 6;

                        if (day === null) {
                          return <div key={`blank-${cellIndex}`} className="aspect-square rounded-sm bg-transparent" />;
                        }

                        return (
                          <div
                            key={`day-${day}`}
                            className={cn(
                              "aspect-square rounded-sm transition-all duration-200 relative group/cell flex items-center justify-center",
                              "hover:scale-125 hover:z-10 hover:shadow-lg cursor-pointer",
                              isWeekend
                                ? "bg-neutral-100 dark:bg-neutral-800/50 text-red-500/80 dark:text-red-400/80"
                                : "bg-neutral-200/50 dark:bg-neutral-700/30 text-neutral-700 dark:text-neutral-300",
                              "hover:bg-indigo-500 dark:hover:bg-indigo-500 hover:text-white dark:hover:text-white hover:ring-2 ring-indigo-300 dark:ring-indigo-700"
                            )}
                            title={`${monthName} ${day}, ${year}`}
                          >
                            <span className="text-[10px] font-medium leading-none">{day}</span>
                          </div>
                        );
                      })}

                      {/* Render remaining empty cells to maintain grid structure (optional but helps with hover effects sometimes) */}
                      {Array.from({ length: TOTAL_COLUMNS - cells.length }).map((_, i) => (
                        <div
                          key={`scratch-${i}`}
                          className="aspect-square rounded-sm bg-transparent pointer-events-none"
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Legend / Footer */}
      <div className="flex justify-end gap-4 px-2 text-xs text-neutral-400">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-neutral-200/50 dark:bg-neutral-700/30" />
          <span>Weekday</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-neutral-100 dark:bg-neutral-800/50" />
          <span>Weekend</span>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <span className="text-neutral-300 dark:text-neutral-600">S M T ... represents Weekdays</span>
        </div>
      </div>
    </div>
  );
}
