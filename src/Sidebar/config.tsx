import { ClipboardList, LayoutDashboard, Settings, StickyNote } from "lucide-react";
import { AppCategory } from "./types";

export interface SidebarConfigItem {
  id: AppCategory;
  label: string;
  icon: React.ReactNode;
}

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

export const settingsConfig: SidebarConfigItem = {
  id: "setting",
  label: "Settings",
  icon: <Settings size={20} />,
};
