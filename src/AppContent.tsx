import { AppCategory } from "./components/sidebar/types";

import { Memo } from "./features/memo";
import { YearCalendar } from "./features/year-calendar";
import { KanbanBoard } from "./features/task";

interface AppContentProps {
  /** The currently active category to display. */
  activeCategory: AppCategory;
}

/**
 * Renders the main content based on the active category.
 * Centralizes the routing logic.
 */
export function AppContent({ activeCategory }: AppContentProps) {
  switch (activeCategory) {
    case "memo":
      return <Memo />;
    case "year":
      return <YearCalendar />;
    case "task":
      return (
        <div className="w-full h-[80vh] overflow-hidden">
          <KanbanBoard />
        </div>
      );
    case "setting":
    default:
      return (
        /* Settings View - Placeholder */
        <div className="w-full h-[60vh] flex flex-col items-center justify-center text-neutral-400 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-3xl">
          <span className="text-xl font-medium">Settings</span>
          <span className="text-sm mt-2">No features yet. Just empty space.</span>
        </div>
      );
  }
}
