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

// 1 to 31
const DAYS_HEADER = Array.from({ length: 31 }, (_, i) => i + 1);

export function YearCalendar() {
  const [year, setYear] = useState(new Date().getFullYear());

  const getDaysInMonth = (monthIndex: number, year: number) => {
    return new Date(year, monthIndex + 1, 0).getDate();
  };

  const getDayOfWeek = (monthIndex: number, day: number) => {
    // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    return new Date(year, monthIndex, day).getDay();
  };

  const isWeekend = (dayOfWeek: number) => dayOfWeek === 0 || dayOfWeek === 6;

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
            {/* Grid Header (Days) */}
            <div className="flex mb-4">
              {/* Month Label Spacer */}
              <div className="w-24 shrink-0" />
              {/* Day Numbers */}
              <div className="flex-1 grid grid-cols-[repeat(31,minmax(0,1fr))] gap-1">
                {DAYS_HEADER.map((day) => (
                  <div key={day} className="text-center">
                    <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500">{day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Months Rows */}
            <div className="flex flex-col gap-3">
              {MONTHS.map((monthName, monthIndex) => {
                const daysInMonth = getDaysInMonth(monthIndex, year);

                return (
                  <div key={monthName} className="flex items-center group">
                    {/* Month Name */}
                    <div className="w-24 shrink-0">
                      <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-300 group-hover:text-primary-500 transition-colors uppercase tracking-wide">
                        {monthName.substring(0, 3)}
                      </span>
                    </div>

                    {/* Days Grid */}
                    <div className="flex-1 grid grid-cols-[repeat(31,minmax(0,1fr))] gap-1">
                      {DAYS_HEADER.map((day) => {
                        const isValid = day <= daysInMonth;

                        if (!isValid) {
                          return <div key={day} className="aspect-square rounded-sm bg-transparent" />;
                        }

                        const dayOfWeek = getDayOfWeek(monthIndex, day);
                        const weekend = isWeekend(dayOfWeek);

                        return (
                          <div
                            key={day}
                            className={cn(
                              "aspect-square rounded-sm transition-all duration-200 relative group/cell",
                              "hover:scale-125 hover:z-10 hover:shadow-lg cursor-pointer",
                              weekend
                                ? "bg-neutral-100 dark:bg-neutral-800/50"
                                : "bg-neutral-200/50 dark:bg-neutral-700/30",
                              "hover:bg-indigo-500 dark:hover:bg-indigo-500 hover:ring-2 ring-indigo-300 dark:ring-indigo-700"
                            )}
                            title={`${monthName} ${day}, ${year}`}
                          >
                            {/* Optional: Add content or markers here */}
                          </div>
                        );
                      })}
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
      </div>
    </div>
  );
}
