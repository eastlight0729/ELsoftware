import { Calendar, Inbox, Kanban, Settings, CheckSquare, BarChart2 } from "lucide-react";
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
    id: "actions",
    label: "Actions",
    icon: <CheckSquare size={NAVIGATION_ICON_SIZE} strokeWidth={NAVIGATION_ICON_STROKE_WIDTH} />,
  },
  {
    id: "calendar",
    label: "Calendar",
    // Note: Reusing the Calendar icon but id is now 'calendar' instead of 'year'
    icon: <Calendar size={NAVIGATION_ICON_SIZE} strokeWidth={NAVIGATION_ICON_STROKE_WIDTH} />,
  },
  {
    id: "lists",
    label: "Lists",
    icon: <Kanban size={NAVIGATION_ICON_SIZE} strokeWidth={NAVIGATION_ICON_STROKE_WIDTH} />,
  },
  {
    id: "review",
    label: "Review",
    icon: <BarChart2 size={NAVIGATION_ICON_SIZE} strokeWidth={NAVIGATION_ICON_STROKE_WIDTH} />,
  },
//   {
//     id: "memo",
//     label: "Reference", // Renamed from Memo
//     icon: <StickyNote size={NAVIGATION_ICON_SIZE} strokeWidth={NAVIGATION_ICON_STROKE_WIDTH} />,
//   },
];

/**
 * Configuration for the settings item, displayed at the bottom of the navigation.
 */
export const settingsConfig: NavigationConfigItem = {
  id: "setting",
  label: "Settings",
  icon: <Settings size={NAVIGATION_ICON_SIZE} strokeWidth={NAVIGATION_ICON_STROKE_WIDTH} />,
};
