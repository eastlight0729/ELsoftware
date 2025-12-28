import { useQueries } from "@tanstack/react-query";
import { calendarKeys } from "../api/useYearCalendar";
import Holidays from "date-holidays";

export function useYearCalendarHolidays(years: number[]) {
  const queries = useQueries({
    queries: years.map((year) => ({
      queryKey: calendarKeys.holidays(year),
      queryFn: async () => {
        // 1. Try Electron IPC first
        if (window.electron?.yearCalendar) {
          return window.electron.yearCalendar.getHolidays(year);
        }

        // 2. Fallback to local library for Web
        const hd = new Holidays("KR");
        const holidays = hd.getHolidays(year);

        const holidayMap: Record<string, string> = {};
        holidays.forEach((h) => {
          const date = h.date.split(" ")[0];
          holidayMap[date] = h.name;
        });
        return holidayMap;
      },
      staleTime: Infinity, // Holidays rarely change
      gcTime: 1000 * 60 * 60, // Keep in memory for 1 hour
    })),
  });

  // Merge all results
  const holidays = queries.reduce((acc, query) => {
    if (query.data) {
      Object.assign(acc, query.data);
    }
    return acc;
  }, {} as Record<string, string>);

  return holidays;
}
