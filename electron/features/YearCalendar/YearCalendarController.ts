import { ipcMain, app } from "electron";
import path from "node:path";
import fs from "node:fs/promises";
import Holidays from "date-holidays";

const DATA_FILE = "year-calendar.json";

import { IController } from "../../shared/types";

export class YearCalendarController implements IController {
  private dataPath: string;

  constructor() {
    this.dataPath = path.join(app.getPath("userData"), DATA_FILE);
  }

  public initialize() {
    ipcMain.handle("year-calendar:get-marks", () => this.getMarks());
    ipcMain.handle("year-calendar:toggle-mark", (_, date: string) => this.toggleMark(date));
    ipcMain.handle("year-calendar:get-holidays", (_, year: number) => this.getHolidays(year));
  }

  private async getMarks(): Promise<Record<string, boolean>> {
    try {
      const content = await fs.readFile(this.dataPath, "utf-8");
      const data = JSON.parse(content);
      return data.marks || {};
    } catch (error) {
      // If file doesn't exist or error, return empty
      return {};
    }
  }

  private async toggleMark(date: string): Promise<Record<string, boolean>> {
    const marks = await this.getMarks();
    if (marks[date]) {
      delete marks[date]; // Unmark
    } else {
      marks[date] = true; // Mark
    }

    try {
      await fs.writeFile(this.dataPath, JSON.stringify({ marks }, null, 2));
    } catch (error) {
      console.error("Failed to save calendar marks", error);
    }
    return marks;
  }

  private getHolidays(year: number): string[] {
    const hd = new Holidays("KR");
    const holidays = hd.getHolidays(year);
    // Return array of YYYY-MM-DD strings
    return holidays.map((h) => h.date.split(" ")[0]);
  }
}
