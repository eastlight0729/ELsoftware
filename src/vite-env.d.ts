/// <reference types="vite/client" />

interface Window {
  plannerAPI: {
    loadData: () => Promise<import("./DailyPlanner/types").PlannerData>;
    saveData: (data: import("./DailyPlanner/types").PlannerData) => Promise<void>;
  };
}
