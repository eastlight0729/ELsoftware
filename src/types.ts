export interface ToDo {
  id: string;
  text: string;
  completed: boolean;
  color: string;
  date: string;
}

export interface PlannerData {
  todos: ToDo[];
  // date string (YYYY-MM-DD) -> grid (stores color strings or IDs)
  plans: Record<string, Record<number, string | null>>;
}
