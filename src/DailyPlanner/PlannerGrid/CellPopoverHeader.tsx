import React from "react";
import { Trash2 } from "lucide-react";

/**
 * Props for the PopoverHeader component.
 */
interface PopoverHeaderProps {
  /** Human-readable representation of the selected time range. */
  timeString: string;
  /** Whether to show the clear button (usually true if a range is selected). */
  showClear: boolean;
  /** Callback triggered when the 'Clear' button is clicked. */
  onClear: () => void;
}

/**
 * PopoverHeader Component
 * Displays the selected time range and an optional clear button at the top of the cell popover.
 */
export const PopoverHeader: React.FC<PopoverHeaderProps> = ({ timeString, showClear, onClear }) => {
  return (
    <div className="px-2 py-1.5 border-b border-slate-100 flex justify-between items-center">
      {/* Selected Time Range Label */}
      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{timeString}</span>

      {/* Clear Action Button */}
      {showClear && (
        <button
          onClick={onClear}
          className="text-xs flex items-center gap-1 text-red-500 hover:bg-red-50 px-2 py-1 rounded-md transition-colors"
        >
          <Trash2 size={12} />
          Clear
        </button>
      )}
    </div>
  );
};
