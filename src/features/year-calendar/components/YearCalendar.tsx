import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
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
  const [year, setYear] = useState(new Date().getFullYear());
  const [direction, setDirection] = useState(0); // 1 = next (slide left), -1 = prev (slide right)
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

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '50%' : '-50%',
      opacity: 0,
      scale: 0.95
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '50%' : '-50%',
      opacity: 0,
      scale: 0.95
    })
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { offset, velocity } = info;
    const swipe = offset.x;
    const velocityX = velocity.x;
    const threshold = 100;

    // Trigger if dragged far enough OR flicked fast enough
    if (swipe < -threshold || (swipe < -10 && velocityX < -500)) {
        // Swiped Left -> Next Year
        setDirection(1);
        setYear(y => y + 1);
    } else if (swipe > threshold || (swipe > 10 && velocityX > 500)) {
        // Swiped Right -> Prev Year
        setDirection(-1);
        setYear(y => y - 1);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center md:p-8 overflow-hidden relative">
      <AnimatePresence mode="popLayout" initial={false} custom={direction}>
        <motion.div
          key={year}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          dragDirectionLock
          onDragEnd={handleDragEnd}
          className={cn(
            "relative p-6 rounded-3xl cursor-grab active:cursor-grabbing",
            "bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl",
            "text-xs font-medium select-none", // Reduced base text size
            "overflow-y-auto overflow-x-hidden max-w-full max-h-full", 
            // Hide scrollbar visuals
            "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
            // Grid Layout Definition
            "grid gap-1.5"
          )}
          style={{
            touchAction: "pan-y",
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
          {/* Year Watermark */}
          <div className="absolute top-4 right-8 pointer-events-none z-0">
            <span className="text-[8rem] font-black text-white/5 leading-none tracking-tighter">
              {year}
            </span>
          </div>

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
                  "aspect-square w-full h-full flex items-center justify-center rounded-md transition-colors z-10", // Responsive square cell
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
                   "flex items-center justify-center font-bold text-white/50 tracking-wider uppercase text-[10px] z-10", // Extra small text for labels
                   isMobile ? "h-8" : "justify-end pr-6" // Desktop: Right aligned within first col, with padding
                 )}
               >
                 {monthName}
               </div>
            )
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
