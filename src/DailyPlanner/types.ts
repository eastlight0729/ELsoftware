/**
 * Represents a single task item in the daily planner.
 */
export interface ToDo {
  /** Unique identifier for the ToDo item. */
  id: string;
  /** The text content of the task. */
  text: string;
  /** Completion status of the task. */
  completed: boolean;
  /** Hex or CSS color string associated with the task for visual categorization. */
  color: string;
  /** ISO date string (YYYY-MM-DD) indicating when this task is scheduled for. */
  date: string;
}

/**
 * Main data structure for storing all daily planner information.
 */
export interface PlannerData {
  /** Collection of all ToDo items across all dates. */
  todos: ToDo[];
  /**
   * Maps a date string (YYYY-MM-DD) to a grid of time slots.
   * Each time slot is indexed (e.g., 0-95 for 15-min intervals) mapping to a color or category ID.
   */
  plans: Record<string, Record<number, string | null>>;
}
