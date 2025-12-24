/// <reference types="vite/client" />

interface Window {
  api: {
    getSchedule: () => Promise<string[]>;
    toggleDate: (date: string) => Promise<string[]>;
  };
  plannerAPI: {
    loadData: () => Promise<import("./DailyPlanner/types").PlannerData>;
    saveData: (data: import("./DailyPlanner/types").PlannerData) => Promise<void>;
  };
}
