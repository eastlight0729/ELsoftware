import { useState, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils'; // Adjust path if alias not configured, but likely is.
// If alias fails, I will try relative path ../../../lib/utils

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function isLeap(year: number) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

interface CalendarCell {
  monthIdx: number;
  day: number;
  colIndex: number; // 0-36
  isWeekend: boolean;
  isToday: boolean;
  id: string;
}

export function YearCalendar() {
  const [year] = useState(new Date().getFullYear());
  const [isMobile, setIsMobile] = useState(false);

  // Responsive Check (Breakpoint 1280px to be safe for 37 cols)
  useEffect(() => {
    const media = window.matchMedia('(max-width: 1280px)');
    const onChange = (e: MediaQueryListEvent | MediaQueryList) => setIsMobile(e.matches);
    
    onChange(media);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  const calendarData = useMemo(() => {
    const data: CalendarCell[] = [];
    const today = new Date();
    
    MONTHS.forEach((_, monthIdx) => {
       const daysCount = monthIdx === 1 && isLeap(year) ? 29 : DAYS_IN_MONTH[monthIdx];
       // Day of week for the 1st of the month (0=Sun .. 6=Sat)
       const firstDay = new Date(year, monthIdx, 1).getDay();

       for (let d = 1; d <= daysCount; d++) {
         // The visualization logic: 
         // We offset the day by 'firstDay' so that columns align by weekday.
         // Col 0 is always Sunday, Col 1 is Monday ... 
         // (Assuming firstDay 0 is Sunday).
         const colIndex = firstDay + d - 1; 
         
         // Helper: 0=Sun, 6=Sat
         const weekday = colIndex % 7;
         const isWeekend = weekday === 0 || weekday === 6;
         
         const isToday = 
            today.getFullYear() === year && 
            today.getMonth() === monthIdx && 
            today.getDate() === d;
         
         data.push({
           monthIdx,
           day: d,
           colIndex,
           isWeekend,
           isToday,
           id: `${monthIdx}-${d}`
         });
       }
    });
    return data;
  }, [year]);

  return (
    <div className="w-full h-full flex items-center justify-center p-4 md:p-8">
      <div className={cn(
        "relative p-6 rounded-3xl transition-all duration-300",
        "bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl",
        "text-xs font-medium select-none", // Reduced base text size
        "overflow-auto max-w-full max-h-full", // Scroll bar within the grid container
        // Hide scrollbar visuals
        "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
        // Grid Layout Definition
        "grid gap-1.5"
      )}
      style={{
        // Desktop: 38 cols (1 label + 37 days), 12 rows
        // Mobile: 13 cols (12 months), 38 rows (1 label + 37 days)
        gridTemplateColumns: isMobile 
            ? `repeat(12, minmax(1rem, 2rem))` 
            : `6rem repeat(37, minmax(1rem, 2rem))`,
        gridTemplateRows: isMobile
            ? `2rem repeat(37, minmax(auto, 1fr))`
            : `repeat(12, minmax(auto, 1fr))`,
      }}
      >
        {/* Render Cells */}
        {calendarData.map((cell) => {
          // Desktop: Month Name (col 1) -> Days start at col 2
          // Mobile: Month Name (row 1) -> Days start at row 2
          const row = isMobile ? cell.colIndex + 2 : cell.monthIdx + 1;
          const col = isMobile ? cell.monthIdx + 1 : cell.colIndex + 2;

          return (
            <div
              key={cell.id}
              style={{ gridRow: row, gridColumn: col }}
              className={cn(
                "aspect-square w-full h-full flex items-center justify-center rounded-md transition-colors", // Responsive square cell
                // Base colors
                cell.isWeekend ? "text-red-400" : "text-white/80",
                // Today Indicator
                cell.isToday && "bg-sky-500 text-white shadow-[0_0_10px_rgba(14,165,233,0.5)] font-bold",
                // Hover effect
                !cell.isToday && "hover:bg-white/10"
              )}
            >
              {cell.day}
            </div>
          );
        })}

        {/* Render Month Labels */}
        {MONTHS.map((monthName, i) => {
          // Desktop: Row i+1, Col 1 (First)
          // Mobile: Row 1 (First), Col i+1
          const row = isMobile ? 1 : i + 1;
          const col = isMobile ? i + 1 : 1;

          return (
             <div
               key={`label-${monthName}`}
               style={{ gridRow: row, gridColumn: col }}
               className={cn(
                 "flex items-center justify-center font-bold text-white/50 tracking-wider uppercase text-[10px]", // Extra small text for labels
                 isMobile ? "h-8" : "justify-end pr-6" // Desktop: Right aligned within first col, with padding
               )}
             >
               {monthName}
             </div>
          )
        })}
      </div>
    </div>
  );
}
