import { useState, useEffect, useMemo, useCallback } from "react";
import { MONTHS } from "../utils";
import {
  useYearCalendarRanges,
  useUpsertYearCalendarRange,
  useDeleteYearCalendarRange,
  useYearCalendarMarks,
  useUpsertYearCalendarMark,
  useDeleteYearCalendarMark,
} from "../api/useYearCalendar";
import { useYearCalendarHolidays } from "./useYearCalendarHolidays";

export function useYearCalendarState() {
  // 1. Date State & Persistence
  const [startDate, setStartDate] = useState(() => {
    try {
      const saved = localStorage.getItem("active_year_calendar_date");
      if (saved) {
        const date = new Date(saved);
        if (!isNaN(date.getTime())) {
          return new Date(date.getFullYear(), date.getMonth(), 1);
        }
      }
    } catch (e) {
      console.error("Failed to parse saved calendar date", e);
    }
    return new Date(new Date().getFullYear(), 0, 1);
  });

  useEffect(() => {
    localStorage.setItem("active_year_calendar_date", startDate.toISOString());
  }, [startDate]);

  // 2. Computed View State
  const monthsToRender = useMemo(() => {
    const months: { year: number; monthIndex: number; name: string; key: string }[] = [];
    const currentYear = startDate.getFullYear();
    const currentMonth = startDate.getMonth();

    for (let i = 0; i < 12; i++) {
      const d = new Date(currentYear, currentMonth + i, 1);
      months.push({
        year: d.getFullYear(),
        monthIndex: d.getMonth(),
        name: MONTHS[d.getMonth()],
        key: `${d.getFullYear()}-${d.getMonth()}`,
      });
    }
    return months;
  }, [startDate]);

  const years = Array.from(new Set(monthsToRender.map((m) => m.year)));
  const yearDisplay = years.length > 1 ? `${years[0]} - ${years[1]}` : `${years[0]}`;

  const isTodayVisible = useMemo(() => {
    const today = new Date();
    const tYear = today.getFullYear();
    const tMonth = today.getMonth();
    return monthsToRender.some((m) => m.year === tYear && m.monthIndex === tMonth);
  }, [monthsToRender]);

  // 3. Navigation Handlers
  const handlePrevYear = useCallback(() => setStartDate((d) => new Date(d.getFullYear() - 1, d.getMonth(), 1)), []);
  const handleNextYear = useCallback(() => setStartDate((d) => new Date(d.getFullYear() + 1, d.getMonth(), 1)), []);
  const handlePrevMonth = useCallback(() => setStartDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1)), []);
  const handleNextMonth = useCallback(() => setStartDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1)), []);

  const handleGoToToday = useCallback(() => {
    const today = new Date();
    setStartDate(new Date(today.getFullYear(), today.getMonth() - 5, 1));
  }, []);

  // 4. Data Loading
  const { data: ranges = [] } = useYearCalendarRanges();
  const { data: marks = [] } = useYearCalendarMarks();
  const upsertRangeMutation = useUpsertYearCalendarRange();
  const deleteRangeMutation = useDeleteYearCalendarRange();
  const upsertMarkMutation = useUpsertYearCalendarMark();
  const deleteMarkMutation = useDeleteYearCalendarMark();

  // Use the new holiday caching hook
  const holidays = useYearCalendarHolidays(years);

  return {
    startDate,
    monthsToRender,
    yearDisplay,
    isTodayVisible,
    holidays,
    ranges,
    marks,
    actions: {
      handlePrevYear,
      handleNextYear,
      handlePrevMonth,
      handleNextMonth,
      handleGoToToday,
      upsertRange: upsertRangeMutation.mutate,
      deleteRange: deleteRangeMutation.mutate,
      upsertMark: upsertMarkMutation.mutate,
      deleteMark: deleteMarkMutation.mutate,
    },
  };
}
