import { AppCategory } from "./components/navigation/types";

import { Memo } from "./features/memo";
import { YearCalendar } from "./features/year-calendar";
import { ListBoard } from "./features/lists";
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
    case "actions":
      return (
        <div className="flex h-full w-full items-center justify-center">
            <div className="flex flex-col items-center justify-center p-12 text-center text-white bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20">
                <h2 className="text-2xl font-bold mb-2 drop-shadow-md">Actions</h2>
                <p className="text-white/80 font-medium">Coming Soon</p>
            </div>
        </div>
      );
    case "calendar":
      return <YearCalendar />;
    case "lists":
      return (
        <div className="w-full h-full overflow-hidden">
          <ListBoard />
        </div>
      );
    case "review":
      return (
        <div className="flex h-full w-full items-center justify-center">
             <div className="flex flex-col items-center justify-center p-12 text-center text-white bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20">
                 <h2 className="text-2xl font-bold mb-2 drop-shadow-md">Review</h2>
                 <p className="text-white/80 font-medium">Coming Soon</p>
             </div>
        </div>
      );
    case "memo":
      return <Memo />;
    case "setting":
      return <SettingsView userEmail={userEmail} onLogout={onLogout} />;
    default:
      return null;
  }
}
