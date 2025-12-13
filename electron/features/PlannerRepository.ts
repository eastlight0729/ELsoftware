import { app } from 'electron';
import path from 'path';
import fs from 'fs/promises';

export interface Category {
    id: string;
    name: string;
    color: string;
}

export interface PlannerData {
    categories: Category[];
    grid: Record<number, string | null>; // index (0-47) -> categoryId
}

export class PlannerRepository {
    private filePath: string;

    constructor() {
        this.filePath = path.join(app.getPath('userData'), 'planner-data.json');
    }

    private async ensureFileExists(): Promise<void> {
        try {
            await fs.access(this.filePath);
        } catch {
            const initialData: PlannerData = {
                categories: [],
                grid: {}
            };
            await fs.writeFile(this.filePath, JSON.stringify(initialData), 'utf-8');
        }
    }

    async loadData(): Promise<PlannerData> {
        await this.ensureFileExists();
        const data = await fs.readFile(this.filePath, 'utf-8');
        return JSON.parse(data) as PlannerData;
    }

    async saveData(data: PlannerData): Promise<void> {
        await this.ensureFileExists();
        await fs.writeFile(this.filePath, JSON.stringify(data), 'utf-8');
    }
}
