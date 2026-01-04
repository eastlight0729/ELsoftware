import { AppCategory } from "./types";
import { SidebarItem } from "./SidebarItem";
import { sidebarConfig, settingsConfig } from "./config";
import { SidebarUserProfile } from "./SidebarUserProfile";

interface SidebarProps {
  /** The currently selected category in the main application. */
  activeCategory: AppCategory;
  /** Callback to change the active category. */
  onSelectCategory: (category: AppCategory) => void;
  /** The email of the currently logged in user. */
  userEmail?: string | null;
  /** Callback to log out the user. */
  onLogout: () => void;
}

/**
 * The main floating dock navigation component.
 * Displays navigation items defined in `config.tsx`.
 */
export function Sidebar({ activeCategory, onSelectCategory, userEmail, onLogout }: SidebarProps) {
  return (
    <aside
      className="
        fixed bottom-6 left-1/2 -translate-x-1/2 z-50
        flex flex-row items-center gap-2 p-2
        bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md
        border border-neutral-200 dark:border-neutral-800
        rounded-2xl shadow-2xl
        transition-all duration-300 ease-in-out
      "
    >
      {/* Main Navigation Items */}
      <nav className="flex flex-row gap-1">
        {sidebarConfig.map((item) => (
          <SidebarItem
            key={item.id}
            id={item.id}
            icon={item.icon}
            label={item.label}
            isActive={activeCategory === item.id}
            onClick={onSelectCategory}
            showLabel={false}
          />
        ))}
      </nav>

      {/* Separator */}
      <div className="w-px h-8 bg-neutral-200 dark:bg-neutral-700 mx-1" />

      {/* Settings Category */}
      <SidebarItem
        id={settingsConfig.id}
        icon={settingsConfig.icon}
        label={settingsConfig.label}
        isActive={activeCategory === settingsConfig.id}
        onClick={onSelectCategory}
        showLabel={false}
      />

      {/* Separator */}
      <div className="w-px h-8 bg-neutral-200 dark:bg-neutral-700 mx-1" />

      {/* User Info - Dock Style */}
      <div className="pl-1">
        <SidebarUserProfile email={userEmail} onLogout={onLogout} />
      </div>
    </aside>
  );
}
