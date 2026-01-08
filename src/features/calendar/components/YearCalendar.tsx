import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence, PanInfo, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

// --- Constants & Helpers ---

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const variants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "50%" : "-50%",
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? "50%" : "-50%",
    opacity: 0,
    scale: 0.95,
  }),
};

const SWIPE_THRESHOLD = 100;
const VELOCITY_THRESHOLD = 500;

interface GridPos {
  gridColumn: number;
  gridRow: number;
}

interface CalendarCell {
  id: string;
  day: number;
  isWeekend: boolean;
  isToday: boolean;
  desktopPos: GridPos;
  mobilePos: GridPos;
}

export function YearCalendar() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [direction, setDirection] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Responsive Listener
  useEffect(() => {
    const media = window.matchMedia("(max-width: 1280px)");
    const update = () => setIsMobile(media.matches);

    update(); // Initial check
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  // Data Generation
  const { cells, labels } = useMemo(() => {
    const cellData: CalendarCell[] = [];
    const today = new Date();

    MONTHS.forEach((_, monthIdx) => {
      // Automatic day count using Date(year, month + 1, 0)
      const daysCount = new Date(year, monthIdx + 1, 0).getDate();
      const firstDay = new Date(year, monthIdx, 1).getDay(); // 0=Sun

      for (let d = 1; d <= daysCount; d++) {
        const colIndex = firstDay + d - 1;
        const weekday = colIndex % 7;
        const isToday = today.getFullYear() === year && today.getMonth() === monthIdx && today.getDate() === d;

        // Visual Coordinates
        // Desktop: Row = Month (1-based), Col = Item (Label + Index)
        const desktopRow = monthIdx + 1;
        const desktopCol = colIndex + 2;

        cellData.push({
          id: `${year}-${monthIdx}-${d}`,
          day: d,
          isWeekend: weekday === 0 || weekday === 6,
          isToday,
          desktopPos: { gridRow: desktopRow, gridColumn: desktopCol },
          mobilePos: { gridRow: desktopCol, gridColumn: desktopRow }, // Transposed
        });
      }
    });

    // Pre-calculate label positions
    const labelData = MONTHS.map((name, i) => ({
      name,
      desktopPos: { gridRow: i + 1, gridColumn: 1 },
      mobilePos: { gridRow: 1, gridColumn: i + 1 },
    }));

    return { cells: cellData, labels: labelData };
  }, [year]);

  const handleDragEnd = (_: never, { offset, velocity }: PanInfo) => {
    const swipe = offset.x;
    const velocityX = velocity.x;

    const isLeftSwipe = swipe < -SWIPE_THRESHOLD || (swipe < -10 && velocityX < -VELOCITY_THRESHOLD);
    const isRightSwipe = swipe > SWIPE_THRESHOLD || (swipe > 10 && velocityX > VELOCITY_THRESHOLD);

    if (isLeftSwipe) {
      setDirection(1);
      setYear((y) => y + 1);
    } else if (isRightSwipe) {
      setDirection(-1);
      setYear((y) => y - 1);
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
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          dragDirectionLock
          onDragEnd={handleDragEnd}
          className={cn(
            "relative p-6 rounded-3xl cursor-grab active:cursor-grabbing",
            "bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl",
            "text-xs font-medium select-none",
            "overflow-y-auto overflow-x-hidden max-w-full max-h-full",
            "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]", // Hide scrollbars
            "grid gap-1.5"
          )}
          style={{
            touchAction: "pan-y",
            // Desktop: Label Col + 37 Day Cols
            // Mobile: Label Row + 37 Day Rows
            gridTemplateColumns: isMobile ? `repeat(12, minmax(1rem, 2rem))` : `6rem repeat(37, minmax(1rem, 2rem))`,
            gridTemplateRows: isMobile ? `2rem repeat(37, minmax(auto, 1fr))` : `repeat(12, minmax(auto, 1fr))`,
          }}
        >
          {/* Background Year Number */}
          <div className="absolute top-4 right-8 pointer-events-none z-0">
            <span className="text-[8rem] font-black text-white/5 leading-none tracking-tighter">{year}</span>
          </div>

          {/* Days */}
          {cells.map((cell) => (
            <div
              key={cell.id}
              style={isMobile ? cell.mobilePos : cell.desktopPos}
              className={cn(
                "aspect-square w-full h-full flex items-center justify-center rounded-md transition-colors z-10",
                cell.isWeekend ? "text-red-400" : "text-white/80",
                cell.isToday && "bg-sky-500 text-white shadow-[0_0_10px_rgba(14,165,233,0.5)] font-bold",
                !cell.isToday && "hover:bg-white/10"
              )}
            >
              {cell.day}
            </div>
          ))}

          {/* Month Labels */}
          {labels.map((label) => (
            <div
              key={`label-${label.name}`}
              style={isMobile ? label.mobilePos : label.desktopPos}
              className={cn(
                "flex items-center justify-center font-bold text-white/50 tracking-wider uppercase text-[10px] z-10",
                isMobile ? "h-8" : "justify-end pr-6"
              )}
            >
              {label.name}
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
