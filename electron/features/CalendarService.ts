import { CalendarRepository } from './CalendarRepository';

export class CalendarService {
    private repo: CalendarRepository;

    constructor() {
        this.repo = new CalendarRepository();
    }

    // Wraps the repository's read method for the Controller
    async getSchedule(): Promise<string[]> {
        return this.repo.getScheduledDates();
    }

    // Implements DoD Ex 1 and Ex 2: Toggles date availability
    async toggleDate(dateStr: string): Promise<string[]> {
        // 1. Get current data
        const currentDates = await this.repo.getScheduledDates();

        // 2. Check if date exists
        const dateIndex = currentDates.indexOf(dateStr);
        const newDates = [...currentDates];

        if (dateIndex > -1) {
            // Logic: Switch Off (Remove date)
            newDates.splice(dateIndex, 1);
        } else {
            // Logic: Switch On (Add date)
            newDates.push(dateStr);
        }

        // 3. Save new state
        await this.repo.saveScheduledDates(newDates);

        // Return updated list to update UI later
        return newDates;
    }

    // Implements DoD: User know what today is
    getToday() {
        const now = new Date();
        return {
            year: now.getFullYear(),
            month: now.getMonth() + 1, // Add 1 because getMonth() returns 0-11
            day: now.getDate()
        };
    }
}