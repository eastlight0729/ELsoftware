/// <reference types="vite-plugin-electron/electron-env" />

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * The built directory structure
     *
     * ```tree
     * ├─┬─┬ dist
     * │ │ └── index.html
     * │ │
     * │ ├─┬ dist-electron
     * │ │ ├── main.js
     * │ │ └── preload.js
     * │
     * ```
     */
    APP_ROOT: string;
    /** /dist/ or /public/ */
    VITE_PUBLIC: string;
  }
}

// Used in Renderer process, expose in `preload.ts`
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
