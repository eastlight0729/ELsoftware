import { Calendar, Inbox, Kanban, Settings, StickyNote } from "lucide-react";
import { AppCategory } from "./types";
import { NAVIGATION_ICON_SIZE, NAVIGATION_ICON_STROKE_WIDTH } from "./constants";

/**
 * Configuration interface for a single item in the navigation.
 */
export interface NavigationConfigItem {
  /** The unique identifier for the category, used for state management. */
  id: AppCategory;
  /** The display label for the menu item. */
  label: string;
  /** The icon component to display. */
  icon: React.ReactNode;
}

/**
 * The main navigation items displayed in the top section of the navigation.
 */
export const navigationConfig: NavigationConfigItem[] = [
  {
    id: "inbox",
    label: "Inbox",
    icon: <Inbox size={NAVIGATION_ICON_SIZE} strokeWidth={NAVIGATION_ICON_STROKE_WIDTH} />,
  },
  {
    id: "memo",
    label: "Memo",
    icon: <StickyNote size={NAVIGATION_ICON_SIZE} strokeWidth={NAVIGATION_ICON_STROKE_WIDTH} />,
  },
  {
    id: "task",
    label: "Kanban",
    icon: <Kanban size={NAVIGATION_ICON_SIZE} strokeWidth={NAVIGATION_ICON_STROKE_WIDTH} />,
  },
  // Schedule removed

  {
    id: "year",
    label: "Year Calendar",
    icon: <Calendar size={NAVIGATION_ICON_SIZE} strokeWidth={NAVIGATION_ICON_STROKE_WIDTH} />,
  },
];

/**
 * Configuration for the settings item, displayed at the bottom of the navigation.
 */
export const settingsConfig: NavigationConfigItem = {
  id: "setting",
  label: "Settings",
  icon: <Settings size={NAVIGATION_ICON_SIZE} strokeWidth={NAVIGATION_ICON_STROKE_WIDTH} />,
};
