import { ClipboardList, LayoutDashboard, Settings, StickyNote } from "lucide-react";
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
    icon: <StickyNote size={20} />,
  },
  {
    id: "task",
    label: "Task",
    icon: <ClipboardList size={20} />,
  },
  {
    id: "schedule",
    label: "Schedule",
    icon: <LayoutDashboard size={20} />,
  },
];

/**
 * Configuration for the settings item, displayed at the bottom of the sidebar.
 */
export const settingsConfig: SidebarConfigItem = {
  id: "setting",
  label: "Settings",
  icon: <Settings size={20} />,
};
