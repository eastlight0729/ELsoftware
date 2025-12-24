interface SidebarBackdropProps {
  /** Whether the sidebar is currently open. */
  isOpen: boolean;
  /** Callback to close the sidebar when backdrop is clicked. */
  onClose: () => void;
}

/**
 * An overlay backdrop that appears when the sidebar is open on smaller screens.
 * Clicking it closes the sidebar.
 */
export function SidebarBackdrop({ isOpen, onClose }: SidebarBackdropProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-30 bg-black/20 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
      onClick={onClose}
    />
  );
}
