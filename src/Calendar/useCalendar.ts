import { useState, useEffect, useMemo } from "react";
import Holidays from "date-holidays";
import { CalendarState, MonthLabel } from "./types";

/**
 * Custom hook to manage the Calendar logic and state.
 * Handles date generation, holiday calculations, and interaction with the backend API.
 * Uses memoization to optimize performance for expensive date calculations.
 *
 * @returns {CalendarState} The complete state and handlers required by the Calendar UI.
 */
export function useCalendar(): CalendarState {
  const toLocalISOString = (date: Date) => {
    const offset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - offset);
    return localDate.toISOString().split("T")[0];
  };

  const getDatesRange = (startYear: number, endYear: number) => {
    const dates = [];
    const date = new Date(startYear, 0, 1);
    while (date.getFullYear() <= endYear) {
      dates.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return dates;
  };

  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());

  // MEMOIZATION START
  // These values only change once a year (or never during a session), so we shouldn't re-calculate them on every render.

  const todayStr = useMemo(() => toLocalISOString(new Date()), []);

  // We only need the current 4 year window
  const currentYear = new Date().getFullYear();

  const dates = useMemo(() => getDatesRange(currentYear, currentYear + 4), [currentYear]);

  const holidaysMap = useMemo(() => {
    const map = new Map<string, string>();
    const hd = new Holidays("KR");
    for (let y = currentYear; y <= currentYear + 4; y++) {
      const yearHolidays = hd.getHolidays(y);
      yearHolidays.forEach((h) => {
        const dateObj = new Date(h.date);
        const dStr = toLocalISOString(dateObj);
        map.set(dStr, h.name);
      });
    }
    return map;
  }, [currentYear]);

  const months = useMemo(() => {
    const m: MonthLabel[] = [];
    let lastMonth = -1;

    if (dates.length > 0) {
      const startDay = dates[0].getDay();
      dates.forEach((date, i) => {
        const currentMonth = date.getMonth();
        if (currentMonth !== lastMonth) {
          lastMonth = currentMonth;
          const colIndex = Math.floor((i + startDay) / 7);
          const label = date.toLocaleString("default", { month: "short" });
          m.push({ label, index: colIndex });
        }
      });
    }
    return m;
  }, [dates]);
  // MEMOIZATION END

  useEffect(() => {
    async function fetchData() {
      if (window.api) {
        const savedDates = await window.api.getSchedule();
        setSelectedDates(new Set(savedDates));
      }
    }
    fetchData();
  }, []);

  const toggleDate = async (dateStr: string) => {
    if (window.api) {
      const updatedList = await window.api.toggleDate(dateStr);
      setSelectedDates(new Set(updatedList));
    }
  };

  return {
    dates,
    selectedDates,
    todayStr,
    toggleDate,
    months,
    holidaysMap,
  };
}
