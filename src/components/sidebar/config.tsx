import { Calendar, Kanban, Settings, StickyNote } from "lucide-react";
import { AppCategory } from "./types";
import { SIDEBAR_ICON_SIZE, SIDEBAR_ICON_STROKE_WIDTH } from "./constants";

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
    icon: <StickyNote size={SIDEBAR_ICON_SIZE} strokeWidth={SIDEBAR_ICON_STROKE_WIDTH} />,
  },
  {
    id: "task",
    label: "Kanban",
    icon: <Kanban size={SIDEBAR_ICON_SIZE} strokeWidth={SIDEBAR_ICON_STROKE_WIDTH} />,
  },
  // Schedule removed

  {
    id: "year",
    label: "Year Calendar",
    icon: <Calendar size={SIDEBAR_ICON_SIZE} strokeWidth={SIDEBAR_ICON_STROKE_WIDTH} />,
  },
];

/**
 * Configuration for the settings item, displayed at the bottom of the sidebar.
 */
export const settingsConfig: SidebarConfigItem = {
  id: "setting",
  label: "Settings",
  icon: <Settings size={SIDEBAR_ICON_SIZE} strokeWidth={SIDEBAR_ICON_STROKE_WIDTH} />,
};
