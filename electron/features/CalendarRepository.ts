import { app } from 'electron';
import path from 'path';
import fs from 'fs/promises';

export class CalendarRepository {
    private filePath: string;

    constructor() {
        // Stores data in the user's application data directory for OS independence
        this.filePath = path.join(app.getPath('userData'), 'calendar-data.json');
    }

    // Helper to ensure the file exists
    private async ensureFileExists(): Promise<void> {
        try {
            await fs.access(this.filePath);
        } catch {
            await fs.writeFile(this.filePath, JSON.stringify([]), 'utf-8');
        }
    }

    // Reads the list of active dates
    async getScheduledDates(): Promise<string[]> {
        await this.ensureFileExists();
        const data = await fs.readFile(this.filePath, 'utf-8');
        return JSON.parse(data) as string[];
    }

    // Overwrites the file with the new list of dates
    async saveScheduledDates(dates: string[]): Promise<void> {
        await this.ensureFileExists();
        await fs.writeFile(this.filePath, JSON.stringify(dates), 'utf-8');
    }
}