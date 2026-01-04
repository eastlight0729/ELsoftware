export const NAVIGATION_ICON_SIZE = 20;

/**
 * Base layout styles for all navigation buttons (trigger, menu items).
 * Ensures consistent shape and spacing.
 */
export const NAVIGATION_BUTTON_BASE = "p-2 rounded-lg transition-all duration-200";

/**
 * Standard color scheme for interactive buttons.
 * Derived from the standard NavigationTrigger design.
 */
export const NAVIGATION_BUTTON_COLORS =
  "text-neutral-600 dark:text-neutral-200 hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50";

/**
 * Color scheme for the currently active menu item.
 */
export const NAVIGATION_BUTTON_ACTIVE =
  "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-sm";

/**
 * Standard stroke width for navigation icons.
 * 1.5 provides a cleaner, more modern look than the default 2.
 */
export const NAVIGATION_ICON_STROKE_WIDTH = 1.5;
