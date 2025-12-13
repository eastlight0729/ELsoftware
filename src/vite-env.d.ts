/// <reference types="vite/client" />

interface Window {
    api: {
        getSchedule: () => Promise<string[]>;
        toggleDate: (date: string) => Promise<string[]>;
    }
    plannerAPI: {
        loadData: () => Promise<import('./types').PlannerData>;
        saveData: (data: import('./types').PlannerData) => Promise<void>;
    }
}