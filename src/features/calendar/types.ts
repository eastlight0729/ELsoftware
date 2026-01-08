export interface MonthCardProps {
  date: Date;
  name: string;
  days: Date[];
}

export interface CalendarState {
  currentDate: Date;
  direction: number;
}
