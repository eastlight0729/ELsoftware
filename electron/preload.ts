import { ipcRenderer, contextBridge } from "electron";

// Define specific API without exposing generic ipcRenderer
contextBridge.exposeInMainWorld("electron", {
  planner: {
    loadData: () => ipcRenderer.invoke("planner:load"),
    saveData: (data: any) => ipcRenderer.invoke("planner:save", data),
  },
  yearCalendar: {
    getMarks: () => ipcRenderer.invoke("year-calendar:get-marks"),
    toggleMark: (date: string) => ipcRenderer.invoke("year-calendar:toggle-mark", date),
    getHolidays: (year: number) => ipcRenderer.invoke("year-calendar:get-holidays", year),
  },
  // Expose a way to listen for the main process message without exposing 'on'
  onMainProcessMessage: (callback: (message: string) => void) => {
    const listener = (_event: any, message: string) => callback(message);
    ipcRenderer.on("main-process-message", listener);
    return () => ipcRenderer.off("main-process-message", listener);
  },
});
