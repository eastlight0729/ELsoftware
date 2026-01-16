import { AppCategory } from "./components/navigation/types";

// import { Memo } from "./features/memo";
import { Calendar } from "./features/calendar";
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
 * Internal helper component for features not yet implemented.
 */
const ComingSoon = ({ title }: { title: string }) => (
  <div className="flex h-full w-full items-center justify-center">
    <div className="flex flex-col items-center justify-center rounded-2xl border border-white/20 bg-white/10 p-12 text-center text-white shadow-xl backdrop-blur-md">
      <h2 className="mb-2 text-2xl font-bold drop-shadow-md">{title}</h2>
      <p className="font-medium text-white/80">Coming Soon</p>
    </div>
  </div>
);

/**
 * Renders the main content based on the active category.
 * Centralizes the routing logic.
 */
export function AppContent({ activeCategory, userEmail, onLogout }: AppContentProps) {
  switch (activeCategory) {
    case "inbox":
      return <InboxView />;
    case "actions":
      return <ComingSoon title="Actions" />;
    case "calendar":
      return <Calendar />;
    case "lists":
      return (
          <ListBoard />
      );
    case "review":
      return <ComingSoon title="Review" />;
//     case "memo":
//       return <Memo />;
    case "setting":
      return <SettingsView userEmail={userEmail} onLogout={onLogout} />;
    default:
      return null;
  }
}
