import { useState, useMemo } from "react";
import {
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
const SWIPE_THRESHOLD = 50;
const VELOCITY_THRESHOLD = 200;
const SPRING_TRANSITION = { type: "spring", stiffness: 300, damping: 30 } as const;

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

interface MonthCardProps {
  date: Date;
  name: string;
  days: Date[];
}

import { GlassPanel, GlassPanelContent, GlassPanelHeader } from "@/components/ui/GlassPanel";

function MonthCard({ date, name, days }: MonthCardProps) {
  return (
    <GlassPanel>
      <GlassPanelHeader className="justify-center py-2 min-h-[40px]">
        <span className="text-sm font-bold tracking-wide text-white/80">{name}</span>
      </GlassPanelHeader>

      <GlassPanelContent>
        <div className="grid grid-cols-7 gap-y-1 gap-x-0.5 text-center">
          {WEEKDAYS.map((day, i) => (
            <div key={`${name}-d-${i}`} className="text-[10px] font-medium uppercase text-white/40">
              {day}
            </div>
          ))}

          {days.map((day, i) => {
            const isCurrentMonth = isSameMonth(day, date);
            const isWeekend = day.getDay() === 0 || day.getDay() === 6;

            return (
              <div
                key={`${name}-day-${i}`}
                className={cn(
                  "flex aspect-square items-center justify-center rounded-sm text-[10px] sm:text-xs",
                  !isCurrentMonth && "opacity-0",
                  isCurrentMonth && "text-white/70",
                  isCurrentMonth && isWeekend && "text-red-400/80",
                  isToday(day) && "bg-sky-500 font-bold text-white shadow-sm rounded-md"
                )}
              >
                {isCurrentMonth ? day.getDate() : ""}
              </div>
            );
          })}
        </div>
      </GlassPanelContent>
    </GlassPanel>
  );
}

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

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, { offset, velocity }: PanInfo) => {
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

  const months = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const monthDate = setMonth(new Date(year, 0, 1), i);
      const days = eachDayOfInterval({
        start: startOfWeek(startOfMonth(monthDate), { weekStartsOn: 1 }),
        end: endOfWeek(endOfMonth(monthDate), { weekStartsOn: 1 }),
      });
      return {
        date: monthDate,
        name: monthDate.toLocaleString("default", { month: "long" }),
        days,
      };
    });
  }, [year]);

  return (
    <div className="relative flex items-center justify-center w-full h-full overflow-hidden md:p-8">
      <AnimatePresence mode="popLayout" initial={false} custom={direction}>
        <motion.div
          key={year}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={SPRING_TRANSITION}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          dragDirectionLock
          onDragEnd={handleDragEnd}
          className="w-full h-full overflow-y-auto touch-pan-y [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          <div className="flex flex-col h-full max-w-7xl mx-auto p-4">
            <div className="flex flex-col w-full h-full transition-all border shadow-lg bg-white/10 rounded-xl shrink-0 border-white/20">
              <div className="flex items-center justify-between p-3 border-b border-white/10">
                <div className="flex items-center w-full gap-2 text-sm font-bold text-white">
                  <span className="flex items-center min-h-6 px-1 -ml-1 transition-colors rounded cursor-text truncate hover:bg-white/5">
                    {year}
                  </span>
                </div>
              </div>

              <div className="flex-1 p-4 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {months.map((month) => (
                    <MonthCard key={month.name} date={month.date} name={month.name} days={month.days} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
