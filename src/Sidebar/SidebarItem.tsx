import React from "react";

interface SidebarItemProps {
  /** The icon element to render. */
  icon: React.ReactNode;
  /** The text label for the item. */
  label: string;
  /** Whether this item is currently selected. */
  isActive: boolean;
  /** Callback to handle click events. */
  onClick: () => void;
  /** Whether to show the text label (expanded state) or just the icon (collapsed state). */
  showLabel: boolean;
}

/**
 * A single navigation item in the sidebar.
 * Handles styling for active/inactive states and collapsed/expanded modes.
 */
export function SidebarItem({ icon, label, isActive, onClick, showLabel }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      title={!showLabel ? label : undefined}
      className={`
        group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200
        ${showLabel ? "w-full text-left" : "w-full justify-center"}
        relative overflow-hidden
        ${
          isActive
            ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-sm"
            : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 hover:text-neutral-700 dark:hover:text-neutral-200"
        }
      `}
    >
      <span
        className={`relative z-10 transition-colors duration-200 ${
          isActive ? "text-emerald-500" : "group-hover:text-neutral-800 dark:group-hover:text-neutral-200"
        }`}
      >
        {icon}
      </span>

      {showLabel && (
        <span className="relative z-10 whitespace-nowrap overflow-hidden transition-all duration-200 animate-in fade-in slide-in-from-left-2">
          {label}
        </span>
      )}
    </button>
  );
}
