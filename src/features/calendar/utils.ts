export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const TOTAL_COLUMNS = 37;
export const WEEKDAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

const parseDateLocal = (dateStr: string) => {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
};

export const getDaysInMonth = (monthIndex: number, year: number) => {
  return new Date(year, monthIndex + 1, 0).getDate();
};

export const getStartDayOfMonth = (monthIndex: number, year: number) => {
  const day = new Date(year, monthIndex, 1).getDay();
  return (day + 6) % 7;
};

export const formatDate = (y: number, m: number, d: number) => {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
};

export const getDatesInRange = (startStr: string, endStr: string) => {
  const start = parseDateLocal(startStr);
  const end = parseDateLocal(endStr);

  // Normalize
  const min = start < end ? start : end;
  const max = start < end ? end : start;

  const dates: string[] = [];
  const current = new Date(min);

  while (current <= max) {
    const y = current.getFullYear();
    const m = current.getMonth();
    const d = current.getDate();
    dates.push(formatDate(y, m, d));

    current.setDate(current.getDate() + 1);
  }
  return dates;
};

export const getRangeSegmentsForMonth = (
  startStr: string,
  endStr: string,
  monthIndex: number,
  year: number
): { startCol: number; span: number } | null => {
  const rangeStart = parseDateLocal(startStr);
  const rangeEnd = parseDateLocal(endStr);

  // Month boundaries
  const monthStart = new Date(year, monthIndex, 1);
  const monthEnd = new Date(year, monthIndex + 1, 0);

  // Check intersection
  if (rangeEnd < monthStart || rangeStart > monthEnd) return null;

  // Calculate effective start/end within this month
  const effectiveStart = rangeStart < monthStart ? monthStart : rangeStart;
  const effectiveEnd = rangeEnd > monthEnd ? monthEnd : rangeEnd;

  // Calculate Grid Positions
  const startDayOfMonth = getStartDayOfMonth(monthIndex, year); // e.g., 0 for Mon
  // Day of month (1-based)
  const startDay = effectiveStart.getDate();
  const endDay = effectiveEnd.getDate();

  // Grid Column Start = offset + day
  const startCol = startDayOfMonth + startDay;

  // Span = (end - start) + 1
  const span = endDay - startDay + 1;

  return { startCol, span };
};
