import { ipcMain } from 'electron';
import { CalendarService } from './CalendarService';

export class CalendarController {
    private service: CalendarService;

    constructor() {
        this.service = new CalendarService();
    }

    // Register IPC handlers (The "API" endpoints for your frontend)
    initialize() {
        // Handler 1: Get initial data
        ipcMain.handle('calendar:get-schedule', async () => {
            return this.service.getSchedule();
        });

        // Handler 2: Toggle a date
        ipcMain.handle('calendar:toggle-date', async (_event, dateStr: string) => {
            return this.service.toggleDate(dateStr);
        });
    }
}