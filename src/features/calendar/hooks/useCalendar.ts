import { useState, useMemo } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addYears,
  subYears,
  setMonth,
} from "date-fns";
import { PanInfo } from "framer-motion";

import { SWIPE_THRESHOLD, VELOCITY_THRESHOLD } from "../constants";

export function useCalendar() {
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

  return {
    year,
    direction,
    months,
    handleDragEnd,
  };
}
