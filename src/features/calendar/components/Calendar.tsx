import { useState, useMemo } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addYears,
  subYears,
  isSameMonth,
  isToday,
  setMonth,
} from "date-fns";
import { motion, AnimatePresence, PanInfo, Variants } from "framer-motion";

import { cn } from "@/lib/utils";

const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];

const variants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
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
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.95,
  }),
};

const SWIPE_THRESHOLD = 50;
const VELOCITY_THRESHOLD = 200;

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [direction, setDirection] = useState(0);

  const year = currentDate.getFullYear();

  const nextYear = () => {
    setDirection(1);
    setCurrentDate((prev) => addYears(prev, 1));
  };

  const prevYear = () => {
    setDirection(-1);
    setCurrentDate((prev) => subYears(prev, 1));
  };

  const handleDragEnd = (_: never, { offset, velocity }: PanInfo) => {
    const swipe = offset.x;
    const velocityX = velocity.x;

    const isLeftSwipe = swipe < -SWIPE_THRESHOLD || (swipe < -10 && velocityX < -VELOCITY_THRESHOLD);
    const isRightSwipe = swipe > SWIPE_THRESHOLD || (swipe > 10 && velocityX > VELOCITY_THRESHOLD);

    if (isLeftSwipe) {
      nextYear();
    } else if (isRightSwipe) {
      prevYear();
    }
  };

  // Generate 12 months for the current year
  const months = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const monthDate = setMonth(new Date(year, 0, 1), i);
      const days = eachDayOfInterval({
        start: startOfWeek(startOfMonth(monthDate), { weekStartsOn: 1 }),
        end: endOfWeek(endOfMonth(monthDate), { weekStartsOn: 1 }),
      });
      return {
        date: monthDate,
        name: format(monthDate, "MMMM"),
        days,
      };
    });
  }, [year]);

  return (
    <div className="w-full h-full flex items-center justify-center p-4 md:p-8 overflow-hidden relative">
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
          className="w-full h-full overflow-y-auto touch-pan-y [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          <div className="max-w-7xl mx-auto h-full flex flex-col">
            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-8 pt-4">
              {months.map((month, index) => (
                <div
                  key={month.name}
                  className={cn(
                    "p-4 rounded-2xl",
                    "bg-white/5 backdrop-blur-md border border-white/10 shadow-lg",
                    "flex flex-col gap-3"
                  )}
                >
                  <div className="flex justify-between items-end border-b border-white/5 pb-2">
                    <span className="text-sm font-bold text-white/80 tracking-wide">
                      {month.name}
                    </span>
                    {index === 0 && (
                      <span className="text-xl font-black text-white/20 tracking-tighter leading-none">
                        {year}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-7 gap-y-1 gap-x-0.5 text-center">
                    {/* Weekday Headers */}
                    {WEEKDAYS.map((day, i) => (
                      <div
                        key={`${month.name}-d-${i}`}
                        className="text-[10px] font-medium text-white/40 uppercase"
                      >
                        {day}
                      </div>
                    ))}

                    {/* Calendar Days */}
                    {month.days.map((day, i) => {
                      const isCurrentMonth = isSameMonth(day, month.date);
                      return (
                        <div
                          key={`${month.name}-day-${i}`}
                          className={cn(
                            "aspect-square flex items-center justify-center rounded-sm text-[10px] sm:text-xs",
                            !isCurrentMonth && "opacity-0", // Hide days from other months for cleaner look? Or low opacity?
                            isCurrentMonth && "text-white/70",
                            isCurrentMonth && (day.getDay() === 0 || day.getDay() === 6) && "text-red-400/80",
                            isToday(day) && "bg-sky-500 text-white font-bold shadow-sm rounded-md"
                          )}
                        >
                          {isCurrentMonth ? format(day, "d") : ""}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
