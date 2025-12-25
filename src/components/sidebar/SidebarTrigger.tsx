import { Menu, X } from "lucide-react";

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
      className="fixed top-5 left-2 z-50 p-2 rounded-lg hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50 transition-all duration-200 text-neutral-600 dark:text-neutral-200"
      aria-label="Toggle Sidebar"
    >
      {isOpen ? <X size={16} /> : <Menu size={16} />}
    </button>
  );
}
