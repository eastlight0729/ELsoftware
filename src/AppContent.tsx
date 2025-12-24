import { AppCategory } from "./Sidebar/types";
import { DailyPlanner } from "./DailyPlanner/DailyPlanner";
import { PomodoroTimer } from "./PomodoroTimer/PomodoroTimer";
import { Memo } from "./Memo/Memo";

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
    case "schedule":
      return (
        <>
          <PomodoroTimer />
          <DailyPlanner />
        </>
      );
    case "memo":
      return <Memo />;
    case "task":
      return (
        /* Task View - Placeholder */
        <div className="w-full h-[60vh] flex flex-col items-center justify-center text-neutral-400 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-3xl">
          <span className="text-xl font-medium">Tasks</span>
          <span className="text-sm mt-2">No features yet. Just empty space.</span>
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
