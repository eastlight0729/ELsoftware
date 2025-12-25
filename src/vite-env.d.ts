/// <reference types="vite/client" />

interface Window {
  electron: {
    planner: {
      loadData: () => Promise<any>;
      saveData: (data: any) => Promise<void>;
    };
    yearCalendar: {
      getMarks: () => Promise<Record<string, boolean>>;
      toggleMark: (date: string) => Promise<Record<string, boolean>>;
      getHolidays: (year: number) => Promise<string[]>;
    };
    onMainProcessMessage: (callback: (message: string) => void) => () => void;
  };
}
