import React from "react";
import { NAVIGATION_BUTTON_ACTIVE, NAVIGATION_BUTTON_BASE, NAVIGATION_BUTTON_COLORS } from "./constants";

interface NavigationItemProps<T extends string> {
  /** The unique identifier for this item. passed back in onClick. */
  id: T;
  /** The icon element to render. */
  icon: React.ReactNode;
  /** The text label for the item. */
  label: string;
  /** Whether this item is currently selected. */
  isActive: boolean;
  /** Callback to handle click events, receives the id. */
  onClick: (id: T) => void;
  /** Whether to show the text label (expanded state) or just the icon (collapsed state). */
  showLabel: boolean;
}

/**
 * A single navigation item.
 * Handles styling for active/inactive states.
 * Memoized to prevent re-renders when other items change.
 */
function NavigationItemInternal<T extends string>({ id, icon, label, isActive, onClick, showLabel }: NavigationItemProps<T>) {
  return (
    <button
      onClick={() => onClick(id)}
      title={label}
      className={`
        group flex items-center gap-2 ${NAVIGATION_BUTTON_BASE}
        justify-center md:justify-start
        relative overflow-hidden
        ${isActive ? NAVIGATION_BUTTON_ACTIVE : NAVIGATION_BUTTON_COLORS}
      `}
    >
      <span
        className={`relative z-10 transition-colors duration-200 shrink-0 ${
          isActive ? "text-emerald-500" : "group-hover:text-neutral-800 dark:group-hover:text-neutral-200"
        }`}
      >
        {icon}
      </span>

      {showLabel && (
        <span className="relative z-10 whitespace-nowrap overflow-hidden hidden md:block text-sm font-medium animate-in fade-in slide-in-from-left-2">
          {label}
        </span>
      )}
    </button>
  );
}

// Cast to any to allow generic usage in React.memo which can be tricky with generics
export const NavigationItem = React.memo(NavigationItemInternal) as typeof NavigationItemInternal;
