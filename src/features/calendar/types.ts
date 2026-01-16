export interface MonthCardProps {
  date: Date;
  name: string;
  days: Date[];
  onDateClick?: (date: Date) => void;
}

export interface CalendarState {
  currentDate: Date;
  direction: number;
}
