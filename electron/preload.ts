import { ipcRenderer, contextBridge } from "electron";

// Define specific API without exposing generic ipcRenderer
contextBridge.exposeInMainWorld("electron", {
  yearCalendar: {
    getMarks: () => ipcRenderer.invoke("year-calendar:get-marks"),
    toggleMark: (date: string) => ipcRenderer.invoke("year-calendar:toggle-mark", date),
    clearMarks: () => ipcRenderer.invoke("year-calendar:clear-marks"),
    getHolidays: (year: number) => ipcRenderer.invoke("year-calendar:get-holidays", year),
  },
  system: {
    openFileDialog: () => ipcRenderer.invoke("system:open-file-dialog"),
  },
  // Expose a way to listen for the main process message without exposing 'on'
  onMainProcessMessage: (callback: (message: string) => void) => {
    const listener = (_event: any, message: string) => callback(message);
    ipcRenderer.on("main-process-message", listener);
    return () => ipcRenderer.off("main-process-message", listener);
  },
});
