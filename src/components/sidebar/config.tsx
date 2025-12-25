import { Calendar, ClipboardList, Settings, StickyNote } from "lucide-react";
import { AppCategory } from "./types";

/**
 * Configuration interface for a single item in the sidebar navigation.
 */
export interface SidebarConfigItem {
  /** The unique identifier for the category, used for state management. */
  id: AppCategory;
  /** The display label for the menu item. */
  label: string;
  /** The icon component to display. */
  icon: React.ReactNode;
}

/**
 * The main navigation items displayed in the top section of the sidebar.
 */
export const sidebarConfig: SidebarConfigItem[] = [
  {
    id: "memo",
    label: "Memo",
    icon: <StickyNote size={16} />,
  },
  {
    id: "task",
    label: "Task",
    icon: <ClipboardList size={16} />,
  },
  // Schedule removed

  {
    id: "year",
    label: "Year Calendar",
    icon: <Calendar size={16} />,
  },
];

/**
 * Configuration for the settings item, displayed at the bottom of the sidebar.
 */
export const settingsConfig: SidebarConfigItem = {
  id: "setting",
  label: "Settings",
  icon: <Settings size={16} />,
};
