import { useState } from "react";
import { AppCategory } from "./types";
import { SidebarItem } from "./SidebarItem";
import { sidebarConfig, settingsConfig } from "./config";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

import { LogOut } from "lucide-react";

interface SidebarProps {
  /** Whether the sidebar is expanded (true) or collapsed (false). */
  isOpen: boolean;
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
 * The main collapsible sidebar navigation component.
 * Displays navigation items defined in `config.tsx`.
 */
export function Sidebar({ isOpen, activeCategory, onSelectCategory, userEmail, onLogout }: SidebarProps) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = () => {
    onLogout();
    setShowLogoutConfirm(false);
  };
  return (
    <aside
      className={`
        fixed top-0 left-0 h-full z-40 flex flex-col
        ${isOpen ? "w-64" : "w-12"}
        bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md
        border-r border-neutral-200 dark:border-neutral-800
        transition-all duration-300 ease-in-out
        pt-20 shadow-2xl pb-4
      `}
    >
      {/* User Info - Only visible when open */}
      <div
        className={`px-4 mb-6 transition-all duration-300 ease-in-out ${
          isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 hidden"
        }`}
      >
        <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-100/50 dark:bg-neutral-800/50 border border-neutral-200/50 dark:border-neutral-700/50 group">
          <div className="h-8 w-8 rounded-full bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs shadow-sm shrink-0">
            {userEmail?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-400">Account</span>
            <span
              className="text-xs font-medium text-neutral-700 dark:text-neutral-200 truncate pr-2"
              title={userEmail || ""}
            >
              {userEmail}
            </span>
          </div>
          <button
            onClick={handleLogoutClick}
            className="ml-auto p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
            title="Sign out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {/* Menu Header - Changes opacity based on open state */}
      <div className={`px-4 mb-2 transition-opacity duration-200 ${isOpen ? "opacity-100" : "opacity-0 hidden"}`}>
        <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider px-2">Menu</h2>
      </div>

      {/* Main Navigation Items */}
      <nav className="flex flex-col gap-2 px-2 py-2 flex-1">
        {sidebarConfig.map((item) => (
          <SidebarItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            isActive={activeCategory === item.id}
            onClick={() => onSelectCategory(item.id)}
            showLabel={isOpen}
          />
        ))}
      </nav>

      {/* Settings Category at the bottom */}
      <div className="px-2 py-2 z-10">
        <SidebarItem
          icon={settingsConfig.icon}
          label={settingsConfig.label}
          isActive={activeCategory === settingsConfig.id}
          onClick={() => onSelectCategory(settingsConfig.id)}
          showLabel={isOpen}
        />
      </div>

      {/* Decorative background element */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-linear-to-t from-neutral-100/50 dark:from-neutral-800/50 to-transparent pointer-events-none" />

      <ConfirmModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleConfirmLogout}
        title="Sign Out"
        message="Are you sure you want to sign out of your account?"
        confirmLabel="Sign Out"
        variant="danger"
      />
    </aside>
  );
}
