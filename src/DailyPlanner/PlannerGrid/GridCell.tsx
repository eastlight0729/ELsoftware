import React from "react";
import { CellPopover } from "./CellPopover";

/**
 * Props for the GridCell component.
 */
interface GridCellProps {
  /** The background color assigned to this cell. */
  color: string | undefined | null;
  /** Whether the cell is currently part of a selection range. */
  isSelected: boolean;
  /** Whether the interaction popover should be displayed for this cell. */
  showPopover: boolean;
  /** Human-readable time representation of this specific cell (e.g., "08:15"). */
  timeString: string;
  /** Handler for the start of a mouse interaction (click/drag). */
  onMouseDown: () => void;
  /** Handler for mouse hover during a drag interaction. */
  onMouseEnter: () => void;
  /** Callback to update the color from the popover. */
  onColorSelect: (color: string) => void;
  /** Callback to clear the current selection color. */
  onClearSelection: () => void;
  /** Callback to hide the popover. */
  onClosePopover: () => void;
}

/**
 * GridCell Component
 * Represents a single 15-minute time block in the planner grid.
 * Handles mouse events for drag selection and renders the popover when active.
 */
export const GridCell: React.FC<GridCellProps> = ({
  color,
  isSelected,
  showPopover,
  timeString,
  onMouseDown,
  onMouseEnter,
  onColorSelect,
  onClearSelection,
  onClosePopover,
}) => {
  return (
    <div
      className={`
        relative cursor-pointer transition-all duration-200
        ${!color ? "hover:bg-slate-100" : "hover:brightness-95"}
        border-r border-slate-100 last:border-r-0
        first:rounded-l-xl last:rounded-r-xl
        ${isSelected ? "ring-2 ring-blue-500 z-10" : ""}
      `}
      style={{
        backgroundColor: color || "transparent",
      }}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      title={color ? `Color: ${color} (${timeString})` : `Empty (${timeString})`}
    >
      {/* 
        Render the popover if this cell is the 'anchor' for an active selection.
      */}
      {showPopover && (
        <CellPopover
          timeString={timeString}
          color={color || ""}
          onClear={onClearSelection}
          onClosePopover={onClosePopover}
          onColorSelect={onColorSelect}
        />
      )}
    </div>
  );
};
