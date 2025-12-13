/// <reference types="vite/client" />

interface Window {
    api: {
        getSchedule: () => Promise<string[]>;
        toggleDate: (date: string) => Promise<string[]>;
    }
}