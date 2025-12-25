/// <reference types="vite/client" />

interface Window {
  electron: {
    yearCalendar: {
      getMarks: () => Promise<Record<string, boolean>>;
      toggleMark: (date: string) => Promise<Record<string, boolean>>;
      clearMarks: () => Promise<void>;
      getHolidays: (year: number) => Promise<string[]>;
    };
    onMainProcessMessage: (callback: (message: string) => void) => () => void;
  };
}
