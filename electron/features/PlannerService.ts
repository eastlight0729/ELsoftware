import { PlannerRepository, PlannerData } from './PlannerRepository';

export class PlannerService {
    private repository: PlannerRepository;

    constructor() {
        this.repository = new PlannerRepository();
    }

    async getPlannerData(): Promise<PlannerData> {
        return await this.repository.loadData();
    }

    async savePlannerData(data: PlannerData): Promise<void> {
        // Here we could add validation logic if needed
        return await this.repository.saveData(data);
    }
}
