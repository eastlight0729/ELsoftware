export interface IController {
  initialize(): void;
}

export interface PlannerAPI {
  loadData: () => Promise<any>;
  saveData: (data: any) => Promise<void>;
}

export interface YearCalendarAPI {
  // Define methods if any
}
