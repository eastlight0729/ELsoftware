import { Menu, X } from "lucide-react";
import { NAVIGATION_BUTTON_BASE, NAVIGATION_BUTTON_COLORS, NAVIGATION_ICON_SIZE, NAVIGATION_ICON_STROKE_WIDTH } from "./constants";

interface NavigationTriggerProps {
  /** Whether the sidebar is currently open. */
  isOpen: boolean;
  /** Callback to toggle the sidebar state. */
  onToggle: () => void;
}

/**
 * A fixed button to toggle the sidebar.
 * Placed at the top-left to ensure accessibility.
 */
export function NavigationTrigger({ isOpen, onToggle }: NavigationTriggerProps) {
  return (
    <button
      onClick={onToggle}
      className={`fixed top-3 left-2 z-50 ${NAVIGATION_BUTTON_BASE} ${NAVIGATION_BUTTON_COLORS}`}
      aria-label="Toggle Sidebar"
    >
      {isOpen ? (
        <X size={NAVIGATION_ICON_SIZE} strokeWidth={NAVIGATION_ICON_STROKE_WIDTH} />
      ) : (
        <Menu size={NAVIGATION_ICON_SIZE} strokeWidth={NAVIGATION_ICON_STROKE_WIDTH} />
      )}
    </button>
  );
}
