import { AppCategory } from "./components/navigation/types";

import { Memo } from "./features/memo";
import { YearCalendar } from "./features/year-calendar";
import { KanbanBoard } from "./features/task";
import { InboxView } from "./features/inbox";
import { SettingsView } from "./features/settings";

interface AppContentProps {
  /** The currently active category to display. */
  activeCategory: AppCategory;
  /** The email of the currently logged in user. */
  userEmail?: string | null;
  /** Callback to log out the user. */
  onLogout: () => void;
}

/**
 * Renders the main content based on the active category.
 * Centralizes the routing logic.
 */
export function AppContent({ activeCategory, userEmail, onLogout }: AppContentProps) {
  switch (activeCategory) {
    case "inbox":
      return <InboxView />;
    case "memo":
      return <Memo />;
    case "year":
      return <YearCalendar />;
    case "task":
      return (
        <div className="w-full h-full overflow-hidden">
          <KanbanBoard />
        </div>
      );
    case "setting":
      return <SettingsView userEmail={userEmail} onLogout={onLogout} />;
    default:
      return null;
  }
}
