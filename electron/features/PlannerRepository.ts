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
    // date string (YYYY-MM-DD) -> grid
    plans: Record<string, Record<number, string | null>>;
}

// Old interface for migration
interface LegacyPlannerData {
    categories: Category[];
    grid?: Record<number, string | null>;
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
                plans: {}
            };
            await fs.writeFile(this.filePath, JSON.stringify(initialData), 'utf-8');
        }
    }

    async loadData(): Promise<PlannerData> {
        await this.ensureFileExists();
        const rawData = await fs.readFile(this.filePath, 'utf-8');
        const parsed = JSON.parse(rawData);

        // Migration check: if it has 'grid' but not 'plans', migrate it
        if ('grid' in parsed && !('plans' in parsed)) {
            const legacy = parsed as LegacyPlannerData;
            const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD local
            const newData: PlannerData = {
                categories: legacy.categories || [],
                plans: {
                    [today]: legacy.grid || {}
                }
            };
            // Save migrated data immediately
            await this.saveData(newData);
            return newData;
        }

        // Ensure plans exists even if empty object (robustness)
        if (!parsed.plans) {
            parsed.plans = {};
        }

        return parsed as PlannerData;
    }

    async saveData(data: PlannerData): Promise<void> {
        await this.ensureFileExists();
        await fs.writeFile(this.filePath, JSON.stringify(data), 'utf-8');
    }
}
