import { useQueries } from "@tanstack/react-query";
import { calendarKeys } from "../api/useYearCalendar";

export function useYearCalendarHolidays(years: number[]) {
  const queries = useQueries({
    queries: years.map((year) => ({
      queryKey: calendarKeys.holidays(year),
      queryFn: async () => {
        if (!window.electron?.yearCalendar) return {};
        return window.electron.yearCalendar.getHolidays(year);
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
