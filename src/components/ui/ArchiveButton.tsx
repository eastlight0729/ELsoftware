import { Archive } from "lucide-react";
import { HeaderIconButton } from "./HeaderIconButton";

interface ArchiveButtonProps {
  /** Callback when the button is clicked */
  onClick: () => void;
}

/**
 * A standardized Archive button for feature headers.
 * Wraps HeaderIconButton with consistent icon, size, and title.
 */
export function ArchiveButton({ onClick }: ArchiveButtonProps) {
  return (
    <HeaderIconButton onClick={onClick} title="Open Archive">
      <Archive size={20} />
    </HeaderIconButton>
  );
}
