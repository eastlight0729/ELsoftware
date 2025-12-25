import { Menu, X } from "lucide-react";
import { SIDEBAR_BUTTON_BASE, SIDEBAR_BUTTON_COLORS, SIDEBAR_ICON_SIZE } from "./constants";

interface SidebarTriggerProps {
  /** Whether the sidebar is currently open. */
  isOpen: boolean;
  /** Callback to toggle the sidebar state. */
  onToggle: () => void;
}

/**
 * A fixed button to toggle the sidebar.
 * Placed at the top-left to ensure accessibility.
 */
export function SidebarTrigger({ isOpen, onToggle }: SidebarTriggerProps) {
  return (
    <button
      onClick={onToggle}
      className={`fixed top-5 left-2 z-50 ${SIDEBAR_BUTTON_BASE} ${SIDEBAR_BUTTON_COLORS}`}
      aria-label="Toggle Sidebar"
    >
      {isOpen ? <X size={SIDEBAR_ICON_SIZE} /> : <Menu size={SIDEBAR_ICON_SIZE} />}
    </button>
  );
}
