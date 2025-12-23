import { ipcMain } from "electron";
import { PlannerService } from "./PlannerService";
import { PlannerData } from "./PlannerRepository";

export class PlannerController {
  private service: PlannerService;

  constructor() {
    this.service = new PlannerService();
  }

  initialize() {
    ipcMain.handle("planner:load", async () => {
      return this.service.getPlannerData();
    });

    ipcMain.handle("planner:save", async (_event, data: PlannerData) => {
      return this.service.savePlannerData(data);
    });
  }
}
